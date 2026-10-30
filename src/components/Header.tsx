import React, { useState } from 'react';
import { ShoppingCart, MessageCircle, Code, ShieldCheck, Truck, Headphones, Search, SlidersHorizontal, Sun, Moon, Download, Lock, Unlock } from 'lucide-react';
import { GoogleSitesTheme } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenEmbedModal: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  whatsappNumber: string;
  currentTheme: GoogleSitesTheme;
  onThemeChange: (theme: GoogleSitesTheme) => void;
  onOpenProductManager: () => void;
  onDownloadHtml: () => void;
  isAdmin?: boolean;
  onLockAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenEmbedModal,
  searchQuery,
  onSearchChange,
  whatsappNumber,
  currentTheme,
  onThemeChange,
  onOpenProductManager,
  onDownloadHtml,
  isAdmin = false,
  onLockAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cleanWaNumber = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-slate-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Authentic Gadgets
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-slate-300">
              <Truck className="w-3.5 h-3.5 text-orange-400" /> Fast Delivery Across Bangladesh (Dhaka 24-48h)
            </span>
            <span className="hidden lg:inline-flex items-center gap-1.5 text-slate-300">
              <Headphones className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Support Active
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            {/* Google Sites Theme Switcher - only for Admin */}
            {isAdmin && (
              <div className="flex items-center gap-1 text-slate-300">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Sites Theme:</span>
                <select
                  value={currentTheme}
                  onChange={(e) => onThemeChange(e.target.value as GoogleSitesTheme)}
                  className="bg-slate-800 text-slate-200 text-xs rounded px-2 py-0.5 border border-slate-700 outline-none cursor-pointer hover:bg-slate-700"
                  title="Choose Google Sites Style Theme"
                >
                  <option value="aristotle">Aristotle (Google Sites)</option>
                  <option value="vision">Vision (Modern Blue)</option>
                  <option value="level">Level (Tech Amber)</option>
                  <option value="impression">Impression (High Contrast)</option>
                  <option value="darkCyber">Dark Cyber Mode</option>
                </select>
              </div>
            )}

            {/* Social Media Links */}
            <div className="flex items-center gap-2 border-l border-slate-700 pl-3">
              <a
                href="https://www.facebook.com/tekohub99/"
                target="_blank"
                rel="noreferrer"
                className="text-slate-300 hover:text-[#1877F2] transition-colors"
                title="Follow TEKOHUB on Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              <a
                href="https://www.instagram.com/teko_hub/?hl=en"
                target="_blank"
                rel="noreferrer"
                className="text-slate-300 hover:text-[#E1306C] transition-colors"
                title="Follow @teko_hub on Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              <a
                href="https://www.tiktok.com/@teko_hub"
                target="_blank"
                rel="noreferrer"
                className="text-slate-300 hover:text-white transition-colors"
                title="Follow @teko_hub on TikTok"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.01 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
            </div>

            <a
              href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent('Hi TEKOHUB, I need help with an order.')}`}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors flex items-center gap-1"
            >
              <MessageCircle className="w-3 h-3" /> Help Line
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2 group">
              <img
                src="/assets/aistudio/TEKOHUB_Gadget_Store_Logo_37bf3389.png"
                alt="TEKOHUB Gadgets"
                className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
                onError={(e) => {
                  // Fallback in case path fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none">
                  TEKO<span className="text-orange-500">HUB</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase mt-0.5">
                  Gadgets & Accessories
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search smartwatches, TWS earbuds, fast chargers..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Actions: Google Sites Embed Script, Download HTML, Manage Products (ADMIN ONLY), WhatsApp, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAdmin && (
              <>
                {/* Google Sites Custom Script / Embed Generator */}
                <button
                  onClick={onOpenEmbedModal}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 transition-colors cursor-pointer"
                  title="Get Embed Script for Google Sites"
                >
                  <Code className="w-4 h-4 text-orange-600" />
                  <span className="hidden sm:inline">Google Sites Embed Script</span>
                  <span className="sm:hidden">Script</span>
                </button>

                {/* Direct Download .HTML button */}
                <button
                  onClick={onDownloadHtml}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                  title="Download standalone HTML file for Google Sites or offline use"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download .HTML</span>
                  <span className="sm:hidden">.HTML</span>
                </button>

                {/* Quick Product Manager / Custom Script Live Updater */}
                <button
                  onClick={onOpenProductManager}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-bold rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition-colors shadow-xs cursor-pointer"
                  title="Add new gadget or edit/delete existing products live"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Manage Products</span>
                  <span className="sm:hidden">Edit</span>
                </button>

                {/* Lock Admin Mode Button */}
                {onLockAdmin && (
                  <button
                    onClick={onLockAdmin}
                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-bold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors shadow-xs cursor-pointer"
                    title="Lock Admin Mode & View as Customer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Lock Admin</span>
                  </button>
                )}
              </>
            )}

            {/* Direct WhatsApp Order Link */}
            <a
              href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent('Hello TEKOHUB! I would like to order gadgets.')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
              title="Order directly on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span className="hidden sm:inline">WhatsApp Order</span>
            </a>

            {/* Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors border border-slate-200"
              aria-label="View Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-scale">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-3 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search gadgets, TWS, chargers..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
