import React, { useState, useEffect, useMemo } from 'react';
import { Product, CartItem, Order, GoogleSitesTheme, StoreConfig } from './types';
import { DEFAULT_PRODUCTS } from './data/defaultProducts';
import { DEFAULT_STORE_CONFIG } from './data/storeConfig';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { GoogleSitesEmbedModal } from './components/GoogleSitesEmbedModal';
import { ProductManagerModal } from './components/ProductManagerModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { Footer } from './components/Footer';
import { generateGoogleSitesEmbedHtml } from './utils/embedGenerator';
import { subscribeToProducts } from './lib/productsService';
import { subscribeToStoreConfig, saveStoreConfigToFirestore } from './lib/configService';
import { onAdminAuthChange, logoutAdmin, isAuthorizedAdmin } from './lib/authService';
import {
  MessageCircle,
  Code,
  ArrowUpDown,
  Flame,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Plus,
  Lock,
  Unlock,
  Loader2,
  Database,
  Settings
} from 'lucide-react';

export default function App() {
  // Products state (subscribed in real-time to Firebase Firestore!)
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Store config state (synced with Firebase Firestore in real-time!)
  const [config, setConfig] = useState<StoreConfig>(() => {
    try {
      const saved = localStorage.getItem('tekohub_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_STORE_CONFIG,
          ...parsed
        };
      }
    } catch (e) {
      console.error('Failed to load saved config', e);
    }
    return DEFAULT_STORE_CONFIG;
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('tekohub_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load cart', e);
    }
    return [];
  });

  // Theme
  const [currentTheme, setCurrentTheme] = useState<GoogleSitesTheme>(() => {
    try {
      const saved = localStorage.getItem('tekohub_theme');
      if (saved) return saved as GoogleSitesTheme;
    } catch {
      // default
    }
    return 'aristotle';
  });

  // Search, Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [deliveryArea, setDeliveryArea] = useState<'dhaka' | 'outside'>('dhaka');

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [isProductManagerOpen, setIsProductManagerOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [customBannerUrl, setCustomBannerUrl] = useState('');

  // Store Owner / Admin Authentication State (Firebase Auth backed)
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Real-time Firestore subscription for products
  useEffect(() => {
    const unsubscribe = subscribeToProducts((loaded) => {
      setProducts(loaded);
      setIsLoadingProducts(false);
    });
    return () => unsubscribe();
  }, []);

  // Real-time Firestore subscription for store configurations (bKash, Nagad, Rocket, delivery charges)
  useEffect(() => {
    const unsubscribe = subscribeToStoreConfig((liveConfig) => {
      setConfig(liveConfig);
      try {
        localStorage.setItem('tekohub_config', JSON.stringify(liveConfig));
      } catch (e) {
        console.error(e);
      }
    });
    return () => unsubscribe();
  }, []);

  // Firebase Auth session listener with strict owner authorization
  useEffect(() => {
    const unsub = onAdminAuthChange((user) => {
      if (user && isAuthorizedAdmin(user.email)) {
        setIsAdmin(true);
        setAdminEmail(user.email);
      } else {
        setIsAdmin(false);
        setAdminEmail(null);
        setIsProductManagerOpen(false);
      }
    });
    return () => unsub();
  }, []);

  // Keyboard shortcut: Alt+A to toggle or open Admin Login
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        if (isAdmin) {
          handleLockAdmin();
        } else {
          setIsAdminLoginOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin]);

  // Sync cart & config to localStorage for offline shopping bag resilience
  useEffect(() => {
    try {
      localStorage.setItem('tekohub_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('tekohub_config', JSON.stringify(config));
    } catch (e) {
      console.error(e);
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem('tekohub_theme', currentTheme);
    } catch (e) {
      console.error(e);
    }
  }, [currentTheme]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLockAdmin = async () => {
    try {
      await logoutAdmin();
      setIsAdmin(false);
      setAdminEmail(null);
      showToast('🔒 Store Owner session closed. Viewing in Public Customer Mode.');
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenProductEditor = (productId?: string) => {
    setEditingProductId(productId || null);
    setIsProductManagerOpen(true);
  };

  // Categories list
  const categories = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.category)));
    const standard = ['All', 'Audio & TWS', 'Smartwatches', 'Chargers & Power', 'Gaming & Desk', 'Accessories', 'Fashion'];
    const allCats = [...standard];
    list.forEach((c) => {
      if (!allCats.includes(c)) allCats.push(c);
    });
    return allCats;
  }, [products]);

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, activeCategory, searchQuery, sortBy]);

  // Cart operations
  const handleAddToCart = (product: Product, selectedColor?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === selectedColor
      );
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += 1;
        return copy;
      }
      return [...prev, { product, quantity: 1, selectedColor }];
    });
    showToast(`Added "${product.title}" to cart`);
  };

  const handleQuickBuy = (product: Product, selectedColor?: string) => {
    setCart([{ product, quantity: 1, selectedColor }]);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCart((prev) => {
      const copy = [...prev];
      copy[index].quantity = quantity;
      return copy;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleOrderComplete = (order: Order) => {
    setCompletedOrder(order);
    setCart([]);
    setIsCheckoutOpen(false);
  };

  const handleDownloadHtml = () => {
    const embedHtml = generateGoogleSitesEmbedHtml(products, config);
    const blob = new Blob([embedHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tekohub-store-embed.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded tekohub-store-embed.html');
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Premium, soft background styling (Requirement 1: soft off-white/light gray/cream)
  const themeClasses = useMemo(() => {
    switch (currentTheme) {
      case 'vision':
        return {
          wrapper: 'bg-[#F1F5F9] text-slate-900',
          accent: 'text-sky-600',
          button: 'bg-sky-600 hover:bg-sky-700'
        };
      case 'level':
        return {
          wrapper: 'bg-[#F7F5F0] text-slate-900',
          accent: 'text-amber-600',
          button: 'bg-amber-600 hover:bg-amber-700'
        };
      case 'darkCyber':
        return {
          wrapper: 'bg-slate-950 text-slate-100',
          accent: 'text-orange-400',
          button: 'bg-orange-600 hover:bg-orange-500'
        };
      case 'aristotle':
      default:
        // Premium soft off-white / light slate gray
        return {
          wrapper: 'bg-[#F6F7F9] text-slate-900',
          accent: 'text-orange-600',
          button: 'bg-orange-600 hover:bg-orange-700'
        };
    }
  }, [currentTheme]);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${themeClasses.wrapper}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Store Owner Active Mode Top Alert Banner */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white text-xs px-4 py-2 font-medium shadow-md sticky top-0 z-50 border-b border-orange-500">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-black tracking-wide">🛡️ STORE OWNER MODE ACTIVE</span>
              <span className="text-[11px] bg-black/25 px-2 py-0.5 rounded font-mono">
                {adminEmail || 'Firebase Auth Verified'}
              </span>
              <span className="hidden md:inline text-orange-100 text-[11px]">
                — Real-time Firestore sync active. Edits appear live for all customers.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenProductEditor()}
                className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Manage Products</span>
              </button>
              <button
                onClick={handleLockAdmin}
                className="bg-black/30 hover:bg-black/50 text-white px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                title="Log out and return to public customer view"
              >
                <Lock className="w-3 h-3" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenEmbedModal={() => setIsEmbedModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        whatsappNumber={config.whatsappNumber}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        onOpenProductManager={() => handleOpenProductEditor()}
        onDownloadHtml={handleDownloadHtml}
        isAdmin={isAdmin}
        onLockAdmin={handleLockAdmin}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Hero Banner Section (Fixed 5:2 Aspect Ratio) */}
        <HeroBanner
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          categories={categories}
          bannerImage={config.bannerImage}
          onEditBanner={isAdmin ? () => {
            setCustomBannerUrl(config.bannerImage || '');
            setIsBannerModalOpen(true);
          } : undefined}
        />

        {/* Store Catalog Header & Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {activeCategory === 'All' ? 'Trending Gadgets & Accessories' : activeCategory}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredProducts.length} authentic gadgets with bKash, Nagad, Rocket send money, WhatsApp &amp; Facebook Messenger checkout
            </p>
          </div>

          {/* Sort By Filter & Add Product Button (Store Owner only) */}
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => handleOpenProductEditor()}
                className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="Add a new gadget to the store"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            )}

            <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 outline-none cursor-pointer hover:border-slate-300 font-medium shadow-xs"
            >
              <option value="featured">Featured / Bestsellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Display Gallery Grid */}
        {isLoadingProducts ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-8 h-8 text-orange-600 animate-spin mb-3" />
            <p className="text-xs font-semibold text-slate-600">Loading TekoHub Gadget Catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No gadgets found</h3>
            <p className="text-xs text-slate-500 mb-4">
              Try adjusting your search query or select another category filter.
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-semibold hover:bg-orange-700 transition-colors cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(p) => handleAddToCart(p)}
                onQuickBuy={(p) => handleQuickBuy(p)}
                onOpenDetails={(p) => setSelectedProduct(p)}
                whatsappNumber={config.whatsappNumber}
                onEditProduct={isAdmin ? () => handleOpenProductEditor(product.id) : undefined}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        config={config}
        onOpenEmbedModal={() => setIsEmbedModalOpen(true)}
        isAdmin={isAdmin}
        onLockAdmin={handleLockAdmin}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, color) => handleAddToCart(p, color)}
        onBuyNow={(p, color) => handleQuickBuy(p, color)}
        whatsappNumber={config.whatsappNumber}
        isAdmin={isAdmin}
        onEditProduct={isAdmin ? (p) => handleOpenProductEditor(p.id) : undefined}
        onUpdateProduct={(updated) => {
          setSelectedProduct(updated);
          setProducts((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
          showToast('Updated gadget photo preview');
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        deliveryArea={deliveryArea}
        onDeliveryAreaChange={setDeliveryArea}
        deliveryDhaka={config.deliveryDhaka}
        deliveryOutside={config.deliveryOutside}
        whatsappNumber={config.whatsappNumber}
      />

      {/* Checkout Modal with bKash, Nagad, Rocket, WhatsApp & Facebook Inbox */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        deliveryArea={deliveryArea}
        onDeliveryAreaChange={setDeliveryArea}
        config={config}
        onOrderComplete={handleOrderComplete}
      />

      {/* Product Manager & Customizer Modal (Authenticated Store Owner Only) */}
      {isAdmin && (
        <ProductManagerModal
          isOpen={isProductManagerOpen}
          onClose={() => {
            setIsProductManagerOpen(false);
            setEditingProductId(null);
          }}
          products={products}
          onUpdateProducts={(newProducts) => {
            setProducts(newProducts);
          }}
          editingProductId={editingProductId}
          onClearEditingProductId={() => setEditingProductId(null)}
          config={config}
          onUpdateConfig={setConfig}
        />
      )}

      {/* Google Sites Custom Script & Embed Studio Modal */}
      <GoogleSitesEmbedModal
        isOpen={isEmbedModalOpen}
        onClose={() => setIsEmbedModalOpen(false)}
        products={products}
        onUpdateProducts={(newProducts) => {
          setProducts(newProducts);
          showToast(`Store gallery updated with ${newProducts.length} gadgets!`);
        }}
        config={config}
        onUpdateConfig={setConfig}
      />

      {/* Order Confirmation / Receipt Modal */}
      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
        config={config}
      />

      {/* Store Banner Manager Modal */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-lg">
                  🖼️
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Manage Store Banner</h3>
                  <p className="text-xs text-slate-500">Fixed 5:2 ratio (1983 × 793px) · Never cropped</p>
                </div>
              </div>
              <button
                onClick={() => setIsBannerModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Live Fixed Aspect Ratio Preview
                </label>
                <div className="w-full aspect-[5/2] rounded-xl overflow-hidden border border-slate-200 bg-[#faf9f6] flex items-center justify-center shadow-xs">
                  <img
                    src={customBannerUrl || config.bannerImage || '/assets/aistudio/Smart_Gadgets__Better_Life_3f9469e8.png'}
                    alt="Store Banner Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Or Custom Image URL / Upload
                </label>
                <input
                  type="text"
                  value={customBannerUrl}
                  onChange={(e) => setCustomBannerUrl(e.target.value)}
                  placeholder="https://example.com/banner.png or /assets/..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsBannerModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetBanner = customBannerUrl.trim() || '/assets/aistudio/Smart_Gadgets__Better_Life_3f9469e8.png';
                  setConfig((prev) => ({ ...prev, bannerImage: targetBanner }));
                  setIsBannerModalOpen(false);
                  showToast('Store banner updated successfully!');
                }}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Apply Fixed Banner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Store Owner / Admin Login Modal (Firebase Auth) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={(email) => {
          setIsAdmin(true);
          setAdminEmail(email);
          setIsAdminLoginOpen(false);
          showToast(`🔓 Authenticated as ${email}! Store management unlocked.`);
        }}
      />
    </div>
  );
}
