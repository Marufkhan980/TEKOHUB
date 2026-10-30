import React from 'react';
import { ShoppingCart, Zap, Star, MessageCircle, Check, Edit2 } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
  onOpenDetails: (product: Product) => void;
  whatsappNumber: string;
  onEditProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickBuy,
  onOpenDetails,
  whatsappNumber,
  onEditProduct
}) => {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const cleanWaNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const quickWaText = encodeURIComponent(
    `Hello TEKOHUB! I would like to order: *${product.title}* (৳${product.price}). Is it available?`
  );

  return (
    <div className="group relative bg-white rounded-xl border border-slate-200/80 hover:border-orange-300 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      {/* Product Image Area */}
      <div
        onClick={() => onOpenDetails(product)}
        className="relative aspect-square bg-slate-50 overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800';
          }}
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
            {product.badge}
          </div>
        )}

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 right-11 bg-orange-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs">
            -{discountPercent}%
          </div>
        )}

        {/* Quick Edit shortcut for store owner */}
        {onEditProduct && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEditProduct(product);
            }}
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/95 text-slate-700 hover:text-orange-600 hover:bg-white flex items-center justify-center shadow-md transition-all hover:scale-110 z-10 cursor-pointer border border-slate-200"
            title="Edit this product (Price, Stock, Image, Warranty, Specs)"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Quick WhatsApp Inquiry Floating Button */}
        <a
          href={`https://wa.me/${cleanWaNumber}?text=${quickWaText}`}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-md transition-transform hover:scale-110"
          title="Quick Order on WhatsApp (01572923121)"
        >
          <MessageCircle className="w-4 h-4 fill-white/20" />
        </a>
      </div>

      {/* Content Area */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1">
        {/* Unboxed Metadata (Zero-pill discipline) */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1.5">
          <span className="font-semibold text-orange-600 uppercase tracking-wider text-[10px]">
            {product.category}
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="flex items-center gap-0.5 text-slate-600 font-medium">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            {product.rating} ({product.reviewsCount})
          </span>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => onOpenDetails(product)}
          className="text-sm font-semibold text-slate-900 line-clamp-2 hover:text-orange-600 transition-colors cursor-pointer leading-snug mb-1 min-h-[36px]"
          title={product.title}
        >
          {product.title}
        </h3>

        {/* Warranty hint */}
        {product.warranty && (
          <div className="text-[10px] text-emerald-700 font-medium truncate mb-1">
            🛡️ {product.warranty}
          </div>
        )}

        {/* Key Specification Bullet (quiet) */}
        <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">
          {product.shortDesc}
        </p>

        {/* Price Row */}
        <div className="mt-auto pt-2 border-t border-slate-100 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-bold text-slate-900">
              ৳{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                ৳{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              product.inStock
                ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                : 'text-red-700 bg-red-50 border border-red-200'
            }`}
          >
            {product.inStock ? `In Stock (${product.stockQuantity || 30})` : 'Stock Out'}
          </span>
        </div>

        {/* Functional Buttons: Add to Cart & Buy Now */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            className={`flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-semibold transition-colors ${
              product.inStock
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>

          <button
            onClick={() => onQuickBuy(product)}
            disabled={!product.inStock}
            className={`flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-semibold transition-colors shadow-xs ${
              product.inStock
                ? 'bg-orange-600 hover:bg-orange-700 text-white cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-white/20" />
            <span>{product.inStock ? 'Buy Now' : 'Stock Out'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
