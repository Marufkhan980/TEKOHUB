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
  AlertCircle,
  Palette,
  ListChecks,
  Sliders,
  Layers,
  CheckCircle
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

  const [newFeatureText, setNewFeatureText] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#0f172a');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // Presets for fast 1-click addition
  const COLOR_PRESETS = [
    { name: 'Space Black', hex: '#0f172a' },
    { name: 'Pure White', hex: '#ffffff' },
    { name: 'Crystal Green', hex: '#10b981' },
    { name: 'Ice Blue', hex: '#38bdf8' },
    { name: 'Deep Purple', hex: '#6366f1' },
    { name: 'Sunset Orange', hex: '#f97316' },
    { name: 'Metallic Silver', hex: '#94a3b8' },
    { name: 'Rose Gold', hex: '#fb7185' },
    { name: 'Midnight Blue', hex: '#1e3a8a' },
    { name: 'Crimson Red', hex: '#ef4444' }
  ];

  const FEATURE_SUGGESTIONS = [
    'Active Noise Cancellation (ENC) dual mics',
    'Bluetooth 5.3 instant auto-pairing',
    'Up to 24 hours total playtime with case',
    'Touch controls for music and call answering',
    'Digital LED power display on charging case',
    'IPX4 splashproof & sweat resistant',
    'Fast Type-C charging support (10 min charge = 2h play)',
    'Deep bass acoustic dynamic driver',
    'Ergonomic comfortable lightweight in-ear fit',
    'Voice assistant (Siri & Google Assistant) support'
  ];

  const SPEC_SUGGESTIONS = [
    { key: 'Driver Size', value: '13mm Titanium Dynamic' },
    { key: 'Water Resistance', value: 'IPX4 Splashproof' },
    { key: 'Bluetooth Version', value: '5.3 + EDR' },
    { key: 'Charging Time', value: '1 hour Type-C Fast Charge' },
    { key: 'Playtime', value: '5-6 hours per charge (24h with case)' },
    { key: 'Battery Capacity', value: '300mAh Case / 35mAh Earbuds' },
    { key: 'Transmission Range', value: '10 Meters' },
    { key: 'Weight', value: '38g (Ultra Lightweight)' }
  ];

  // Handlers for Colors
  const handleAddColor = (name = newColorName, hex = newColorHex) => {
    if (!name.trim()) return;
    setFormColors((prev) => [...prev, { name: name.trim(), hex }]);
    setNewColorName('');
  };

  const handleRemoveColor = (index: number) => {
    setFormColors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateColor = (index: number, field: 'name' | 'hex', val: string) => {
    setFormColors((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: val } : c))
    );
  };

  // Handlers for Features
  const handleAddFeature = (text = newFeatureText) => {
    if (!text.trim()) return;
    setFormFeatures((prev) => [...prev, text.trim()]);
    setNewFeatureText('');
  };

  const handleRemoveFeature = (index: number) => {
    setFormFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateFeature = (index: number, val: string) => {
    setFormFeatures((prev) =>
      prev.map((f, i) => (i === index ? val : f))
    );
  };

  // Handlers for Specs
  const handleAddSpec = (key = newSpecKey, value = newSpecVal) => {
    if (!key.trim() || !value.trim()) return;
    setFormSpecs((prev) => [...prev, { key: key.trim(), value: value.trim() }]);
    setNewSpecKey('');
    setNewSpecVal('');
  };

  const handleRemoveSpec = (index: number) => {
    setFormSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateSpec = (index: number, field: 'key' | 'value', val: string) => {
    setFormSpecs((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: val } : s))
    );
  };

  // Handlers for Gallery
  const handleAddGalleryPhoto = () => {
    if (!newGalleryUrl.trim()) return;
    const formatted = convertGoogleDriveUrl(newGalleryUrl.trim());
    setFormGallery((prev) => [...prev, formatted]);
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryPhoto = (index: number) => {
    setFormGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetPrimaryGalleryPhoto = (url: string) => {
    setFormImage(url);
    setFormGallery((prev) => [url, ...prev.filter((u) => u !== url)]);
  };

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

              {/* 1. Colors & Variants Manager */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
                      <Palette className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Available Colors & Swatches ({formColors.length})
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        গ্রাহকদের জন্য বিভিন্ন রঙের অপশন যোগ করুন।
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Color Presets */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Quick 1-Click Color Presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleAddColor(preset.name, preset.hex)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-lg text-xs font-medium text-slate-700 transition-colors cursor-pointer"
                        title={`Click to add ${preset.name}`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-slate-300 shrink-0"
                          style={{ backgroundColor: preset.hex }}
                        />
                        <span>{preset.name}</span>
                        <Plus className="w-2.5 h-2.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Color Input Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 border-t border-slate-200/60">
                  <input
                    type="text"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddColor();
                      }
                    }}
                    placeholder="Custom Color Name (e.g. Crystal Green, Space Black)"
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-white px-2 py-1 border border-slate-200 rounded-lg">
                      <input
                        type="color"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
                        title="Pick Color"
                      />
                      <input
                        type="text"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        className="w-20 text-[11px] font-mono font-semibold text-slate-700 bg-transparent focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddColor()}
                      className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Color</span>
                    </button>
                  </div>
                </div>

                {/* Current Colors List */}
                {formColors.length === 0 ? (
                  <p className="text-xs text-slate-400 italic bg-white p-2.5 rounded-lg border border-dashed border-slate-200 text-center">
                    No color variants added yet. Click one of the quick presets above or enter a color name to add.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {formColors.map((color, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg border border-slate-200 shadow-2xs"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <input
                            type="color"
                            value={color.hex}
                            onChange={(e) => handleUpdateColor(idx, 'hex', e.target.value)}
                            className="w-6 h-6 rounded cursor-pointer border-0 p-0 shrink-0"
                            title="Change hex color"
                          />
                          <input
                            type="text"
                            value={color.name}
                            onChange={(e) => handleUpdateColor(idx, 'name', e.target.value)}
                            className="flex-1 text-xs font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-orange-500 focus:outline-none"
                            placeholder="Color Name"
                          />
                          <span className="text-[10px] font-mono text-slate-400">
                            {color.hex}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(idx)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Remove color"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Key Features Bullet Points Manager */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <ListChecks className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Key Features Bullet Points ({formFeatures.length})
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        প্রোডাক্টের মূল আকর্ষণ ও ফিচারসমূহ যা চেকমার্কে দেখা যাবে।
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Feature Suggestions */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Quick 1-Click Feature Suggestions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {FEATURE_SUGGESTIONS.map((featText) => (
                      <button
                        key={featText}
                        type="button"
                        onClick={() => handleAddFeature(featText)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-[11px] font-medium text-slate-700 transition-colors cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5 text-emerald-600" />
                        <span>{featText}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Feature Input Bar */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                  <input
                    type="text"
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="Enter custom key feature (e.g. Active Noise Cancellation dual mics)"
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddFeature()}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Feature</span>
                  </button>
                </div>

                {/* Current Features List */}
                {formFeatures.length === 0 ? (
                  <p className="text-xs text-slate-400 italic bg-white p-2.5 rounded-lg border border-dashed border-slate-200 text-center">
                    No features added yet. Click one of the quick suggestions above or write your own.
                  </p>
                ) : (
                  <div className="space-y-1.5 pt-1">
                    {formFeatures.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 shadow-2xs"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => handleUpdateFeature(idx, e.target.value)}
                          className="flex-1 text-xs font-medium text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-none"
                          placeholder="Feature description"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Remove feature"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Technical Specifications Manager */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Technical Specifications ({formSpecs.length})
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        টেকনিক্যাল স্পেসিফিকেশন টেবিল (Driver Size, Water Resistance, Charging Time ইত্যাদি)।
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Spec Suggestions */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Quick 1-Click Spec Suggestions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SPEC_SUGGESTIONS.map((specPreset) => (
                      <button
                        key={specPreset.key}
                        type="button"
                        onClick={() => handleAddSpec(specPreset.key, specPreset.value)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-[11px] font-medium text-slate-700 transition-colors cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5 text-blue-600" />
                        <span>
                          {specPreset.key}: <b className="text-slate-900">{specPreset.value}</b>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Spec Input Row */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1 border-t border-slate-200/60">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={newSpecKey}
                      onChange={(e) => setNewSpecKey(e.target.value)}
                      placeholder="Spec Name (e.g. Driver Size)"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={newSpecVal}
                      onChange={(e) => setNewSpecVal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSpec();
                        }
                      }}
                      placeholder="Spec Value (e.g. 13mm Titanium Dynamic)"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => handleAddSpec()}
                      className="w-full h-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Spec</span>
                    </button>
                  </div>
                </div>

                {/* Current Specs List */}
                {formSpecs.length === 0 ? (
                  <p className="text-xs text-slate-400 italic bg-white p-2.5 rounded-lg border border-dashed border-slate-200 text-center">
                    No technical specs added yet. Click a suggestion above or enter your own key and value.
                  </p>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden bg-white">
                    {formSpecs.map((spec, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 hover:bg-slate-50 transition-colors"
                      >
                        <input
                          type="text"
                          value={spec.key}
                          onChange={(e) => handleUpdateSpec(idx, 'key', e.target.value)}
                          className="w-1/3 text-xs font-bold text-slate-700 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none px-1"
                          placeholder="Spec Name"
                        />
                        <span className="text-slate-400 font-bold">:</span>
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => handleUpdateSpec(idx, 'value', e.target.value)}
                          className="flex-1 text-xs font-medium text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none px-1"
                          placeholder="Spec Value"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(idx)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Remove spec"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Additional Gallery Photos Manager */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Product Photo Gallery ({formGallery.length} Images)
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        একাধিক ছবি, বিভিন্ন অ্যাঙ্গেল বা বক্স আনবক্সিং ফটো যুক্ত করুন। Google Drive বা ডিরেক্ট লিংক দিন।
                      </p>
                    </div>
                  </div>
                </div>

                {/* Add Photo Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddGalleryPhoto();
                      }
                    }}
                    placeholder="Paste Google Drive share link or image URL for additional angle"
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryPhoto}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Photo</span>
                  </button>
                </div>

                {/* Gallery Thumbnails List */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                  {formGallery.map((imgUrl, idx) => {
                    const isCover = formImage === imgUrl || (idx === 0 && !formImage);
                    return (
                      <div
                        key={idx}
                        className={`relative group rounded-lg overflow-hidden border bg-white ${
                          isCover ? 'ring-2 ring-orange-500 border-orange-500' : 'border-slate-200'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`photo ${idx}`}
                          className="w-full h-16 object-cover bg-slate-100"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800';
                          }}
                        />

                        {isCover && (
                          <span className="absolute top-1 left-1 bg-orange-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-2xs">
                            Cover
                          </span>
                        )}

                        <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                          {!isCover && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryGalleryPhoto(imgUrl)}
                              className="px-1.5 py-0.5 bg-orange-600 hover:bg-orange-700 text-white text-[9px] font-bold rounded cursor-pointer"
                              title="Set as Main Cover Photo"
                            >
                              Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryPhoto(idx)}
                            className="p-1 bg-red-600 hover:bg-red-700 text-white rounded cursor-pointer"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
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
