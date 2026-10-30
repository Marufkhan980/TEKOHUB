import React from 'react';
import { ShieldCheck, Truck, Headphones, MessageCircle, Code, MapPin, Phone, Mail, Heart, CheckCircle, Lock } from 'lucide-react';
import { StoreConfig } from '../types';

interface FooterProps {
  config: StoreConfig;
  onOpenEmbedModal?: () => void;
  isAdmin?: boolean;
  onLockAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  config,
  onOpenEmbedModal,
  isAdmin = false,
  onLockAdmin
}) => {
  const cleanWa = config.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-8 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Store Brand & Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img
                src="/assets/aistudio/TEKOHUB_Gadget_Store_Logo_37bf3389.png"
                alt="TEKOHUB"
                className="h-10 w-auto object-contain bg-white/90 p-1 rounded-md"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-xl font-black text-white tracking-tight">
                TEKO<span className="text-orange-500">HUB</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {config.tagline}. Bangladesh&apos;s trusted destination for authentic smartwatches, TWS earbuds, fast GaN chargers, and high-tech lifestyle accessories.
            </p>
            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
              <span>{config.address}</span>
            </div>

            {/* Social Media Links */}
            <div className="pt-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-2">
                Follow TEKOHUB
              </div>
              <div className="flex items-center gap-2">
                {/* Facebook */}
                {config.facebookUrl && (
                  <a
                    href={config.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1877F2]/20 hover:bg-[#1877F2] text-white border border-[#1877F2]/40 transition-all font-semibold text-[11px] group"
                    title="Visit TEKOHUB on Facebook"
                  >
                    <svg className="w-3.5 h-3.5 fill-current text-[#1877F2] group-hover:text-white" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </a>
                )}

                {/* Instagram */}
                {config.instagramUrl && (
                  <a
                    href={config.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#E1306C]/20 hover:bg-[#E1306C] text-white border border-[#E1306C]/40 transition-all font-semibold text-[11px] group"
                    title="Follow @teko_hub on Instagram"
                  >
                    <svg className="w-3.5 h-3.5 fill-current text-[#E1306C] group-hover:text-white" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>Instagram</span>
                  </a>
                )}

                {/* TikTok */}
                {config.tiktokUrl && (
                  <a
                    href={config.tiktokUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all font-semibold text-[11px] group"
                    title="Follow @teko_hub on TikTok"
                  >
                    <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.01 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                    <span>TikTok</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Col 2: Customer Care & WhatsApp */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">Customer Hotline</h4>
            <div className="space-y-2">
              <a
                href={`tel:${config.phone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-orange-400" />
                <span>{config.phone}</span>
              </a>

              <a
                href={`https://wa.me/${cleanWa}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp: +{config.whatsappNumber}</span>
              </a>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${cleanWa}?text=${encodeURIComponent('Hi TEKOHUB team, I have a question about delivery.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
                <span>Instant Chat with Support</span>
              </a>
            </div>
          </div>

          {/* Col 3: Payment Gateways Supported */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">Payment &amp; Delivery</h4>
            <p className="text-slate-400 text-[11px]">
              We accept direct Mobile Financial Services (MFS) Send Money with instant TrxID confirmation:
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 rounded bg-[#E2136E] text-white font-bold text-[10px] tracking-wide">
                bKash
              </span>
              <span className="px-2.5 py-1 rounded bg-[#EA580C] text-white font-bold text-[10px] tracking-wide">
                Nagad
              </span>
              <span className="px-2.5 py-1 rounded bg-[#9333EA] text-white font-bold text-[10px] tracking-wide">
                Rocket
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 font-semibold text-[10px] border border-slate-700">
                Cash On Delivery
              </span>
            </div>

            <div className="text-[11px] text-slate-400 pt-1 space-y-1">
              <div>• Inside Dhaka Delivery: ৳{config.deliveryDhaka} (24-48h)</div>
              <div>• Outside Dhaka Delivery: ৳{config.deliveryOutside} (Steadfast Courier)</div>
            </div>
          </div>

          {/* Col 4: Customer Warranty & Guarantee (or Google Sites Integration if Admin) */}
          <div className="space-y-3">
            {isAdmin ? (
              <>
                <h4 className="text-white font-bold uppercase tracking-wider text-xs">Google Sites Integration</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Designed specifically for Google Sites embedment. Update gadgets in custom script to dynamically refresh gallery!
                </p>

                {onOpenEmbedModal && (
                  <button
                    onClick={onOpenEmbedModal}
                    className="w-full py-2 px-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>Get Google Sites Script</span>
                  </button>
                )}
              </>
            ) : (
              <>
                <h4 className="text-white font-bold uppercase tracking-wider text-xs">Quality &amp; Guarantee</h4>
                <ul className="text-slate-400 text-[11px] space-y-2">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>7-Day Replacement Guarantee</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Official Brand Warranty on all gadgets</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Courier Parcel Check before full payment</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>24/7 Dedicated WhatsApp Helpline</span>
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Bottom copyright - completely free of public admin triggers */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} TEKOHUB Gadgets. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>100% Genuine Products Guaranteed</span>
            </span>

            {/* When Admin is actively logged in, show lock indicator; otherwise completely hidden */}
            {isAdmin && onLockAdmin && (
              <button
                onClick={onLockAdmin}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-950/80 text-orange-400 border border-orange-500/40 hover:bg-orange-900 transition-colors font-medium cursor-pointer"
                title="Lock Admin Mode (Return to Customer View)"
              >
                <Lock className="w-3 h-3 text-orange-400" />
                <span>Admin Active (Click to Lock)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
