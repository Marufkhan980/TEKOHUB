import React from 'react';
import { ShieldCheck, Truck, Headphones, BadgePercent, Zap, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
  bannerImage?: string;
  onEditBanner?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  activeCategory,
  onSelectCategory,
  categories,
  bannerImage,
  onEditBanner
}) => {
  return (
    <div className="w-full">
      {/* Visual Hero Banner with fixed 5:2 aspect ratio matching official TEKOHUB banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-xs bg-white border border-slate-200/90 group">
        <div className="relative w-full aspect-[5/2] max-h-[280px] sm:max-h-[340px] bg-[#faf9f6] flex items-center justify-center">
          <img
            src={bannerImage || "/assets/aistudio/tekohub_banner_fast.webp"}
            alt="TEKOHUB - Smart Gadgets, Better Life"
            className="w-full h-full object-contain object-center"
            loading="eager"
            decoding="async"
            onError={(e) => {
              // Graceful fallback to optimized jpg
              const img = e.currentTarget;
              if (img.src !== window.location.origin + "/assets/aistudio/tekohub_banner_opt.jpg") {
                img.src = "/assets/aistudio/tekohub_banner_opt.jpg";
              }
            }}
          />

          {/* Clean Floating Promotional Badge placed non-obtrusively at bottom-left */}
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md border border-slate-200/80 hidden sm:flex items-center gap-2 pointer-events-none">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              <span>bKash &amp; Nagad Instant Send Money Verified</span>
            </span>
          </div>

          {/* Quick Edit Banner Button (Store Owner Management) */}
          {onEditBanner && (
            <button
              onClick={onEditBanner}
              className="absolute top-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm flex items-center gap-1.5"
              title="Change banner image URL"
            >
              <span>Change Banner</span>
            </button>
          )}
        </div>
      </div>

      {/* Trust & Guarantee Highlights Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-orange-600" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">100% Genuine Gadgets</div>
            <div className="text-[11px] text-slate-500 truncate">Original brand guarantee</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">Fast Delivery</div>
            <div className="text-[11px] text-slate-500 truncate">Dhaka 24h · Outside 2-3 days</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-pink-50 flex items-center justify-center shrink-0">
            <BadgePercent className="w-5 h-5 text-pink-600" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">bKash, Nagad, Rocket</div>
            <div className="text-[11px] text-slate-500 truncate">Instant Send Money or COD</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
            <Headphones className="w-5 h-5 text-sky-600" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">WhatsApp Order Line</div>
            <div className="text-[11px] text-slate-500 truncate">Instant 1-Click checkout</div>
          </div>
        </div>
      </div>

      {/* Category Tabs (Anti-slop compliant: functional button elements with active/inactive states) */}
      <div className="mt-6 flex items-center justify-between border-b border-slate-200 pb-3 gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>Curated Tech</span>
        </div>
      </div>
    </div>
  );
};
