import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Check,
  Sparkles,
  Save,
  Image as ImageIcon,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  CloudUpload,
  Code2,
  Copy,
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Product, StoreConfig } from '../types';
import { convertGoogleDriveUrl, isValidImageUrl } from '../utils/imageUrl';
import { saveProductToFirestore, deleteProductFromFirestore, seedProductsToFirestore } from '../lib/productsService';
import { generateGoogleSitesEmbedHtml } from '../utils/embedGenerator';

interface ProductManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  editingProductId?: string | null;
  onClearEditingProductId?: () => void;
  config: StoreConfig;
}

export const ProductManagerModal: React.FC<ProductManagerModalProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProducts,
  editingProductId,
  onClearEditingProductId,
  config
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'products' | 'embed'>('products');
  const [activeView, setActiveView] = useState<'list' | 'editor'>('list');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  // Form states for creating / editing
  const [formId, setFormId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | undefined>(undefined);
  const [formCategory, setFormCategory] = useState<string>('Fashion');
  const [formBadge, setFormBadge] = useState<string>('New Arrival');
  const [formInStock, setFormInStock] = useState<boolean>(true);
  const [formStockQuantity, setFormStockQuantity] = useState<number>(45);
  const [formWarranty, setFormWarranty] = useState<string>('6 Months Replacement Warranty');
  const [formImage, setFormImage] = useState<string>('');
  const [formGallery, setFormGallery] = useState<string[]>([]);
  const [formShortDesc, setFormShortDesc] = useState<string>('');
  const [formFeatures, setFormFeatures] = useState<string[]>([]);
  const [formSpecs, setFormSpecs] = useState<{ key: string; value: string }[]>([]);
  const [formColors, setFormColors] = useState<{ name: string; hex: string }[]>([]);

  // New item helpers for arrays
  const [newFeatureText, setNewFeatureText] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#0f172a');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // If opened with a specific product to edit
  React.useEffect(() => {
    if (editingProductId) {
      const target = products.find((p) => p.id === editingProductId);
      if (target) {
        startEditingProduct(target);
      }
    }
  }, [editingProductId, products]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const startEditingProduct = (p: Product) => {
    setSelectedProduct(p);
    setFormError(null);
    setFormId(p.id);
    setFormTitle(p.title);
    setFormPrice(p.price);
    setFormOriginalPrice(p.originalPrice);
    setFormCategory(p.category);
    setFormBadge(p.badge || '');
    setFormInStock(p.inStock);
    setFormStockQuantity(p.stockQuantity || 30);
    setFormWarranty(p.warranty || '3 Months Replacement Warranty');
    setFormImage(p.image);
    setFormGallery(p.gallery || [p.image]);
    setFormShortDesc(p.shortDesc);
    setFormFeatures(p.features ? [...p.features] : []);
    setFormSpecs(
      p.specs
        ? Object.entries(p.specs).map(([key, value]) => ({ key, value }))
        : []
    );
    setFormColors(p.colors ? [...p.colors] : []);
    setActiveView('editor');
  };

  const startAddNewProduct = () => {
    setSelectedProduct(null);
    setFormError(null);
    setFormId(`th-${Date.now()}`);
    setFormTitle('');
    setFormPrice(990);
    setFormOriginalPrice(1450);
    setFormCategory('Smartwatches');
    setFormBadge('New Arrival');
    setFormInStock(true);
    setFormStockQuantity(50);
    setFormWarranty('6 Months Replacement Warranty');
    setFormImage('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80');
    setFormGallery([
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
    ]);
    setFormShortDesc('Premium authentic smart gadget with official warranty and nationwide fast delivery.');
    setFormFeatures([
      'Authentic quality guarantee with fast shipping',
      'Long battery endurance & high durability',
      'Direct bKash/Nagad/Rocket Send Money verification'
    ]);
    setFormSpecs([
      { key: 'Condition', value: 'Brand New Factory Sealed' },
      { key: 'Warranty', value: '6 Months Replacement Warranty' },
      { key: 'Delivery Area', value: 'Nationwide Bangladesh' }
    ]);
    setFormColors([
      { name: 'Space Black', hex: '#0f172a' },
      { name: 'Metallic Silver', hex: '#e2e8f0' }
    ]);
    setActiveView('editor');
  };

  const handleImageUrlChange = (url: string) => {
    const formatted = convertGoogleDriveUrl(url);
    setFormImage(formatted);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!formTitle.trim()) {
      setFormError('Please enter a product title');
      return;
    }
    if (!formPrice || formPrice <= 0) {
      setFormError('Please enter a valid price in BDT');
      return;
    }

    const specsRecord: Record<string, string> = {};
    formSpecs.forEach((s) => {
      if (s.key.trim() && s.value.trim()) {
        specsRecord[s.key.trim()] = s.value.trim();
      }
    });

    const finalImage = convertGoogleDriveUrl(formImage.trim()) || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800';

    const updatedProduct: Product = {
      id: formId,
      title: formTitle.trim(),
      slug: formTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      price: Number(formPrice),
      originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
      category: formCategory as any,
      rating: selectedProduct?.rating || 4.9,
      reviewsCount: selectedProduct?.reviewsCount || 42,
      inStock: formInStock,
      stockQuantity: Number(formStockQuantity),
      badge: (formBadge as any) || undefined,
      image: finalImage,
      gallery: formGallery.length > 0 ? formGallery.map(convertGoogleDriveUrl) : [finalImage],
      shortDesc: formShortDesc.trim() || 'Smart authentic gadget with high build quality.',
      features: formFeatures.filter((f) => f.trim().length > 0),
      specs: specsRecord,
      colors: formColors.length > 0 ? formColors : undefined,
      warranty: formWarranty.trim()
    };

    setIsSaving(true);
    try {
      // 1. Save to Firebase Firestore
      await saveProductToFirestore(updatedProduct);

      // 2. Update local state
      let updatedList: Product[];
      if (selectedProduct) {
        updatedList = products.map((p) => (p.id === formId ? updatedProduct : p));
        showToast(`Saved to Firebase Cloud: "${updatedProduct.title}"!`);
      } else {
        updatedList = [updatedProduct, ...products];
        showToast(`Added to Firebase Cloud: "${updatedProduct.title}"!`);
      }
      onUpdateProducts(updatedList);

      setIsSaving(false);
      setActiveView('list');
      if (onClearEditingProductId) onClearEditingProductId();
    } catch (err: any) {
      setIsSaving(false);
      console.error('Save to Firestore error:', err);
      setFormError(`Failed to save to Firebase: ${err.message || 'Permission denied'}`);
    }
  };

  const confirmDeleteProduct = async (id: string, title: string) => {
    try {
      await deleteProductFromFirestore(id);
      const updated = products.filter((p) => p.id !== id);
      onUpdateProducts(updated);
      setDeletingProductId(null);
      showToast(`Deleted from Firestore: "${title}"`);
    } catch (err: any) {
      console.error('Delete error:', err);
      showToast(`Error deleting: ${err.message}`);
    }
  };

  const handleSeedAllToFirestore = async () => {
    if (!window.confirm('Sync all 14 default TekoHub gadgets into Firebase Firestore database now?')) {
      return;
    }
    setIsSeeding(true);
    try {
      const count = await seedProductsToFirestore();
      setIsSeeding(false);
      showToast(`Successfully synced ${count} gadgets into Firebase Firestore!`);
    } catch (err: any) {
      setIsSeeding(false);
      showToast(`Sync error: ${err.message || 'Check connection'}`);
    }
  };

  const handleCopyEmbedCode = () => {
    const htmlCode = generateGoogleSitesEmbedHtml(products, config);
    navigator.clipboard.writeText(htmlCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2500);
    showToast('Clean Google Sites embed code copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold shadow-md shadow-orange-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Store Management Console
                </h2>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Firebase Firestore Connected
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Live Cloud Catalog • Google Drive Image Support • Embed Generator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-4 sm:px-6 pt-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Manage Products ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('embed')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'embed'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Google Sites Embed Code (Clean Client-Only)</span>
          </button>
        </div>

        {/* Toast alert */}
        {toast && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 text-center animate-in fade-in duration-200">
            {toast}
          </div>
        )}

        {/* Body Content */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          {activeTab === 'embed' ? (
            /* Tab: Google Sites Embed Generator */
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl space-y-2">
                <h3 className="text-sm font-bold text-orange-950 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-orange-600" />
                  Google Sites Embed Code Generator (Client-Safe Backup)
                </h3>
                <p className="text-xs text-orange-900 leading-relaxed">
                  এই বাটনে ক্লিক করলে আপনার সাইটের সমস্ত প্রোডাক্ট, কার্ট, এবং অর্ডার সিস্টেম সম্বলিত একটি সম্পূর্ণ HTML কোড কপি হবে। এই কোডটি Google Sites-এ <b>Insert &gt; Embed &gt; Embed code</b> বক্সে পেস্ট করলে কাস্টমাররা ওয়েবসাইটটি ব্যবহার করতে পারবে, তবে কোনো <b>অ্যাডমিন কন্ট্রোল, পিন বা এডিট বাটন থাকবে না</b>।
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Clean Embed Snippet Preview:</span>
                  <button
                    onClick={handleCopyEmbedCode}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedEmbed ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedEmbed ? 'Embed Code Copied!' : 'Copy Embed Code for Google Sites'}</span>
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    readOnly
                    value={generateGoogleSitesEmbedHtml(products, config)}
                    rows={12}
                    className="w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-700 focus:outline-none select-all"
                  />
                </div>
              </div>
            </div>
          ) : activeView === 'list' ? (
            /* Tab: Product List View */
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-800">
                    Cloud Products ({products.length} Items Live)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Any additions or edits are automatically saved to Firebase Firestore in real-time.
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSeedAllToFirestore}
                    disabled={isSeeding}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Seed default 14 gadgets into Firebase Firestore"
                  >
                    {isSeeding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CloudUpload className="w-3.5 h-3.5" />}
                    <span>Sync 14 Gadgets to Firestore</span>
                  </button>

                  <button
                    type="button"
                    onClick={startAddNewProduct}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add New Product</span>
                  </button>
                </div>
              </div>

              {/* Product Grid / Rows */}
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 flex items-center gap-3.5 hover:bg-slate-50 transition-colors"
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-14 h-14 object-cover rounded-lg border border-slate-200 shrink-0 bg-slate-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800';
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {p.title}
                        </span>
                        {p.badge && (
                          <span className="text-[10px] bg-slate-900 text-white font-bold px-1.5 py-0.5 rounded">
                            {p.badge}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 font-medium">
                          ({p.category})
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mt-1 text-xs">
                        <span className="font-bold text-orange-600">
                          ৳{p.price.toLocaleString()}
                        </span>
                        {p.originalPrice && (
                          <span className="text-slate-400 line-through text-[11px]">
                            ৳{p.originalPrice.toLocaleString()}
                          </span>
                        )}
                        <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${p.inStock ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
                          {p.inStock ? `In Stock (${p.stockQuantity || 30})` : 'Stock Out'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => startEditingProduct(p)}
                        className="p-2 rounded-lg text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {deletingProductId === p.id ? (
                        <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg border border-red-200">
                          <button
                            onClick={() => confirmDeleteProduct(p.id, p.title)}
                            className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded cursor-pointer"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeletingProductId(null)}
                            className="px-2 py-1 bg-slate-200 text-slate-700 text-[10px] font-bold rounded cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeletingProductId(p.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Product Editor Form */
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-900">
                  {selectedProduct ? `Edit Product: ${selectedProduct.title}` : 'Add New Product to Store'}
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveView('list')}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  ← Back to List
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. UltraPods Pro Transparent TWS Earbuds"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Selling Price (৳ BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                {/* Original Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Original Price (৳ BDT)
                  </label>
                  <input
                    type="number"
                    value={formOriginalPrice || ''}
                    onChange={(e) => setFormOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Leave blank if no discount"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    <option value="Smartwatches">Smartwatches</option>
                    <option value="Audio & TWS">Audio & TWS</option>
                    <option value="Chargers & Power">Chargers & Power</option>
                    <option value="Gaming & Desk">Gaming & Desk</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Fashion">Fashion</option>
                  </select>
                </div>

                {/* Badge */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Promotional Badge
                  </label>
                  <select
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    <option value="">None</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="Hot Deal">Hot Deal</option>
                    <option value="New Arrival">New Arrival</option>
                    <option value="Trending">Trending</option>
                    <option value="50% OFF">50% OFF</option>
                  </select>
                </div>

                {/* Image URL & Google Drive Link Support */}
                <div className="sm:col-span-2 bg-orange-50/50 p-3.5 rounded-xl border border-orange-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800">
                      Product Image Link (Google Drive / Direct URL / Unsplash) *
                    </label>
                    <span className="text-[10px] text-orange-700 font-bold bg-orange-100 px-2 py-0.5 rounded">
                      Google Drive Auto-Converted
                    </span>
                  </div>

                  <input
                    type="text"
                    required
                    value={formImage}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    placeholder="Paste Google Drive link (e.g. drive.google.com/file/d/...) or image URL"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />

                  <div className="flex items-center gap-3">
                    {formImage && (
                      <div className="flex items-center gap-2">
                        <img
                          src={formImage}
                          alt="Preview"
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 bg-white"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800';
                          }}
                        />
                        <span className="text-[11px] text-slate-500 font-medium">Image Live Preview</span>
                      </div>
                    )}
                    <p className="text-[10.5px] text-slate-500 leading-tight">
                      💡 <b>Pro Tip:</b> Firebase Storage এর বদলে সরাসরি Google Drive Share লিংক ব্যবহার করুন। লিংকটি অটোমেটিক হাই-রেজুলেশন ইমেজ ভিউতে কনভার্ট হয়ে যাবে!
                    </p>
                  </div>
                </div>

                {/* Short Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={formShortDesc}
                    onChange={(e) => setFormShortDesc(e.target.value)}
                    placeholder="Short highlight for gadget listing card"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                {/* Stock & Warranty */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Stock Availability
                  </label>
                  <div className="flex items-center gap-4 py-2">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 cursor-pointer">
                      <input
                        type="radio"
                        name="stock"
                        checked={formInStock}
                        onChange={() => setFormInStock(true)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span>In Stock</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 cursor-pointer">
                      <input
                        type="radio"
                        name="stock"
                        checked={!formInStock}
                        onChange={() => setFormInStock(false)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span>Stock Out</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Warranty Policy
                  </label>
                  <input
                    type="text"
                    value={formWarranty}
                    onChange={(e) => setFormWarranty(e.target.value)}
                    placeholder="e.g. 6 Months Replacement Warranty"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveView('list')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-600/20 flex items-center gap-1.5 cursor-pointer"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save to Firebase Firestore</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
