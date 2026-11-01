import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  ShoppingCart,
  MessageCircle,
  Zap,
  Check,
  ArrowRight,
  Edit2,
  Camera,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Product } from '../types';
import {
  formatSingleProductOrderMessage,
  generateFacebookMessengerUrl,
  generateWhatsAppOrderUrl
} from '../utils/whatsapp';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedColor?: string) => void;
  onBuyNow: (product: Product, selectedColor?: string) => void;
  whatsappNumber: string;
  onEditProduct?: (product: Product) => void;
  onUpdateProduct?: (updated: Product) => void;
  isAdmin?: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  whatsappNumber,
  onEditProduct,
  onUpdateProduct,
  isAdmin = false
}) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors && product.colors.length > 0 ? product.colors[0].name : undefined
  );
  const [quantity, setQuantity] = useState<number>(1);

  // Quick photo editor state
  const [isPhotoEditorOpen, setIsPhotoEditorOpen] = useState(false);
  const [currentGallery, setCurrentGallery] = useState<string[]>(
    product.gallery && product.gallery.length > 0 ? product.gallery : [product.image]
  );
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Sync state when product prop changes
  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setCurrentGallery(
        product.gallery && product.gallery.length > 0 ? product.gallery : [product.image]
      );
      setSelectedColor(
        product.colors && product.colors.length > 0 ? product.colors[0].name : undefined
      );
    }
  }, [product]);

  const images = currentGallery.length > 0 ? currentGallery : [product.image];

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const [fbCopied, setFbCopied] = useState(false);

  const formattedProductMessage = formatSingleProductOrderMessage({
    product,
    quantity,
    selectedColor,
    storeName: 'TEKOHUB'
  });

  const waUrl = generateWhatsAppOrderUrl(whatsappNumber, formattedProductMessage);

  const handleFacebookOrder = () => {
    try {
      navigator.clipboard.writeText(formattedProductMessage);
      setFbCopied(true);
      setTimeout(() => setFbCopied(false), 4000);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
    const fbUrl = generateFacebookMessengerUrl();
    window.open(fbUrl, '_blank');
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setUploadError(null);
        const updated = [...currentGallery, dataUrl];
        setCurrentGallery(updated);
        setSelectedImage(dataUrl);

        // Auto save to product
        if (onUpdateProduct) {
          onUpdateProduct({
            ...product,
            image: currentGallery.length === 0 ? dataUrl : product.image,
            gallery: updated
          });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddPhotoUrl = () => {
    if (!newPhotoUrl.trim()) return;
    const url = newPhotoUrl.trim();
    const updated = [...currentGallery, url];
    setCurrentGallery(updated);
    setSelectedImage(url);
    setNewPhotoUrl('');

    if (onUpdateProduct) {
      onUpdateProduct({
        ...product,
        image: currentGallery.length === 0 ? url : product.image,
        gallery: updated
      });
    }
  };

  const handleSetPrimaryPhoto = (img: string) => {
    setSelectedImage(img);
    const updatedGallery = [img, ...currentGallery.filter((g) => g !== img)];
    setCurrentGallery(updatedGallery);

    if (onUpdateProduct) {
      onUpdateProduct({
        ...product,
        image: img,
        gallery: updatedGallery
      });
    }
  };

  const handleRemovePhoto = (imgToRemove: string) => {
    if (currentGallery.length <= 1) {
      setUploadError('You must keep at least 1 photo for this product.');
      return;
    }
    const updated = currentGallery.filter((img) => img !== imgToRemove);
    setCurrentGallery(updated);
    if (selectedImage === imgToRemove) {
      setSelectedImage(updated[0]);
    }
    if (onUpdateProduct) {
      onUpdateProduct({
        ...product,
        image: updated[0],
        gallery: updated
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          aria-label="Close details"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 sm:p-6">
          {/* Left Column: Image Gallery & Photo Edit Options */}
          <div className="flex flex-col gap-3">
            {/* Main Product Image */}
            <div className="relative aspect-square rounded-xl bg-slate-50 border border-slate-200 overflow-hidden group">
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-full object-cover object-center"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded shadow-xs">
                  {product.badge}
                </span>
              )}

              {/* Direct Edit / Change Photo Button Overlay (Store Owner / Admin only) */}
              {isAdmin && (
                <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
                  <button
                    type="button"
                    onClick={() => setIsPhotoEditorOpen(true)}
                    className="bg-slate-900/90 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 backdrop-blur-xs transition-all hover:scale-105 cursor-pointer"
                    title="Edit or change this product photo"
                  >
                    <Camera className="w-3.5 h-3.5 text-orange-400" />
                    <span>Edit / Change Photo</span>
                  </button>
                </div>
              )}
            </div>

            {/* Gallery Thumbnails & Edit Button */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold px-0.5">
                <span>Product Photos ({images.length})</span>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setIsPhotoEditorOpen(true)}
                    className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit / Add Photos</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
                {images.map((img, i) => (
                  <div key={i} className="relative group shrink-0">
                    <button
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all block relative ${
                        selectedImage === img
                          ? 'border-orange-500 ring-2 ring-orange-500/20'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                      title={`View photo ${i + 1}`}
                    >
                      <img src={img} alt={`view ${i}`} className="w-full h-full object-cover" />
                    </button>
                    {/* Hover Edit Pencil Icon on each Thumbnail (Admin only) */}
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsPhotoEditorOpen(true);
                        }}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-600 hover:bg-orange-700 text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110 cursor-pointer"
                        title="Edit this photo"
                      >
                        <Edit2 className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                ))}

                {/* + Add / Change Photo Button right on the thumbnail bar (Admin only) */}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setIsPhotoEditorOpen(true)}
                    className="w-16 h-16 rounded-lg border-2 border-dashed border-orange-300 hover:border-orange-500 bg-orange-50/70 hover:bg-orange-100 text-orange-700 text-xs font-bold flex flex-col items-center justify-center gap-1 shrink-0 transition-colors cursor-pointer"
                    title="Upload or change photos"
                  >
                    <Camera className="w-4 h-4 text-orange-600" />
                    <span className="text-[10px] leading-tight text-center">Edit Photo</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick In-Modal Photo Editor Panel (when opened) */}
            {isPhotoEditorOpen && (
              <div className="bg-orange-50/70 border border-orange-200 rounded-xl p-3.5 mt-1 space-y-3 shadow-xs animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-orange-600" />
                    Photo Editor for this Gadget
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsPhotoEditorOpen(false)}
                    className="text-slate-400 hover:text-slate-700 p-0.5 rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {uploadError && (
                  <p className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                    {uploadError}
                  </p>
                )}

                {/* 1. Upload from Computer/Phone */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Upload New Image from Device:
                  </label>
                  <label className="flex items-center justify-center gap-2 w-full py-2 px-3 border border-dashed border-orange-400 bg-white hover:bg-orange-50 rounded-lg text-xs font-bold text-orange-700 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-orange-600" />
                    <span>Choose Photo File (JPG / PNG / WebP)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* 2. Or Paste Image URL */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Or Paste Image URL (e.g. Unsplash, Facebook, Imgur):
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      className="flex-1 text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddPhotoUrl}
                      className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>
                </div>

                {/* 3. Manage Gallery Photos list */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    Manage Current Gallery ({currentGallery.length}):
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {currentGallery.map((img, i) => (
                      <div
                        key={i}
                        className={`relative rounded-lg overflow-hidden border bg-white ${
                          product.image === img ? 'ring-2 ring-emerald-500 border-emerald-500' : 'border-slate-200'
                        }`}
                      >
                        <img src={img} alt={`thumb ${i}`} className="w-full h-12 object-cover" />
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryPhoto(img)}
                            className="p-1 bg-emerald-600 text-white rounded text-[9px] font-bold"
                            title="Set as Main Cover"
                          >
                            Main
                          </button>
                          {currentGallery.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(img)}
                              className="p-1 bg-red-600 text-white rounded text-[9px]"
                              title="Delete this photo"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        {product.image === img && (
                          <span className="absolute bottom-0 inset-x-0 bg-emerald-600 text-white text-[8px] font-bold text-center py-0.5">
                            Cover
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Full Product Editor Link */}
                {onEditProduct && (
                  <div className="pt-2 border-t border-orange-200 flex items-center justify-between">
                    <span className="text-[11px] text-slate-600">Want to edit title, price, or specs too?</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsPhotoEditorOpen(false);
                        onEditProduct(product);
                      }}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 underline"
                    >
                      <span>Open Full Product Editor</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Trust Assurance Card */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 text-xs text-slate-600 space-y-1.5 mt-2">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{product.warranty || 'Official Warranty & 7 Days Replacement'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-orange-600" />
                <span>Inside Dhaka: ৳60 (24h) · Outside Dhaka: ৳120 (48-72h)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Order Controls */}
          <div className="flex flex-col">
            <div className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
              {product.category}
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {product.title}
            </h2>

            {/* Rating & Stock */}
            <div className="flex items-center gap-3 my-2 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                {product.rating} ({product.reviewsCount} customer reviews)
              </span>
              <span>·</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded ${
                  product.inStock
                    ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                    : 'text-red-700 bg-red-50 border border-red-200'
                }`}
              >
                {product.inStock ? `In Stock (${product.stockQuantity || 30} units left)` : 'Out of Stock'}
              </span>
            </div>

            {/* Price Box */}
            <div className="my-3 p-3 bg-orange-50/60 rounded-xl border border-orange-100 flex items-baseline gap-3">
              <span className="text-2xl font-black text-orange-600">
                ৳{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-sm text-slate-400 line-through">
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Save ৳{(product.originalPrice - product.price).toLocaleString()} ({discount}%)
                  </span>
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
              {product.shortDesc}
            </p>

            {/* Color Chooser */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Select Color: <span className="text-orange-600 font-normal">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        selectedColor === color.name
                          ? 'border-orange-500 bg-orange-50 text-orange-950 font-bold ring-1 ring-orange-500'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-slate-300"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Key Features List */}
            {product.features && product.features.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Key Features
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specs Table */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="mb-5 bg-slate-50 rounded-xl p-3 border border-slate-200/60">
                <h4 className="text-xs font-bold text-slate-800 mb-2">Technical Specs</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="py-0.5 border-b border-slate-200/40">
                      <span className="text-slate-500">{key}: </span>
                      <span className="font-semibold text-slate-800">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="mt-auto space-y-2 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-bold text-slate-800 min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      onAddToCart(product, selectedColor);
                    }
                    onClose();
                  }}
                  disabled={!product.inStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-colors ${
                    product.inStock
                      ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{product.inStock ? `Add ${quantity > 1 ? `${quantity} items` : ''} to Cart` : 'Out of Stock'}</span>
                </button>
              </div>

              {/* Direct WhatsApp & Facebook Orders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-white/20" />
                  <span>Order on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleFacebookOrder}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-white text-xs font-bold transition-all shadow-xs cursor-pointer ${
                    fbCopied ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {fbCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-200" />
                      <span>Copied! Opening Chat...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.43 3.16 7.15V22l3.05-1.68c1.19.33 2.45.51 3.79.51 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1.05 13.04l-2.61-2.78-5.1 2.78 5.61-5.95 2.68 2.78 5.03-2.78-5.61 5.95z"/>
                      </svg>
                      <span>Order on Facebook Inbox</span>
                    </>
                  )}
                </button>
              </div>

              {fbCopied && (
                <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-[11px] font-semibold text-center animate-fade-in">
                  📋 অর্ডারের সুন্দর মেসেজ কপি হয়েছে! ফেসবুক মেসেঞ্জারে গিয়ে চ্যাটে <b>Paste (Ctrl+V)</b> করে Send করুন।
                </div>
              )}

              <p className="text-center text-[10px] text-slate-500 font-medium">
                If WhatsApp is unavailable, you can also order via our Facebook Page.
              </p>

              {/* Instant Buy Now Button */}
              <button
                onClick={() => {
                  onBuyNow(product, selectedColor);
                  onClose();
                }}
                disabled={!product.inStock}
                className={`w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg text-xs sm:text-sm font-bold transition-colors ${
                  product.inStock
                    ? 'bg-orange-600 hover:bg-orange-700 text-white cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Zap className="w-4 h-4 fill-white/20" />
                <span>{product.inStock ? `Proceed to Instant Checkout (৳${(product.price * quantity).toLocaleString()})` : 'Out of Stock'}</span>
              </button>

              {/* Edit This Product (Store Owner action) */}
              {onEditProduct && (
                <button
                  type="button"
                  onClick={() => {
                    onEditProduct(product);
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 text-xs font-bold transition-colors cursor-pointer mt-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>✏️ Edit This Product (Photo, Price, Stock, Colors, Warranty, Specs)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
