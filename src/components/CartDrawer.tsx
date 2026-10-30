import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Truck, MessageCircle, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  deliveryArea: 'dhaka' | 'outside';
  onDeliveryAreaChange: (area: 'dhaka' | 'outside') => void;
  deliveryDhaka: number;
  deliveryOutside: number;
  whatsappNumber: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  deliveryArea,
  onDeliveryAreaChange,
  deliveryDhaka,
  deliveryOutside,
  whatsappNumber
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryCharge = deliveryArea === 'dhaka' ? deliveryDhaka : deliveryOutside;
  const isFreeDelivery = subtotal >= 3500;
  const effectiveDelivery = isFreeDelivery ? 0 : deliveryCharge;
  const grandTotal = subtotal + effectiveDelivery;

  const totalItemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const cleanWa = whatsappNumber.replace(/[^0-9]/g, '');
  const itemsText = items
    .map(
      (item, i) =>
        `${i + 1}. ${item.product.title}${item.selectedColor ? ` (${item.selectedColor})` : ''} x ${item.quantity} = ৳${item.product.price * item.quantity}`
    )
    .join('%0A');
  const waCartMsg = `*🛒 TEKOHUB CART INQUIRY*%0A${itemsText}%0A%0A*Subtotal:* ৳${subtotal}%0A*Delivery Location:* ${
    deliveryArea === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'
  }%0AI would like to finalize this order!`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              <h2 className="text-base font-bold text-slate-900">
                Shopping Cart ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Your cart is empty</h3>
                <p className="text-xs text-slate-500 mb-5">
                  Explore our smartwatches, TWS earbuds, fast chargers and gadgets to add items.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-lg bg-orange-600 text-white font-semibold text-xs hover:bg-orange-700 transition-colors shadow-xs"
                >
                  Explore Trending Gadgets
                </button>
              </div>
            ) : (
              <>
                {/* Free Delivery Bar */}
                <div className="bg-orange-50 rounded-lg p-2.5 border border-orange-100 text-xs">
                  {isFreeDelivery ? (
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                      <Truck className="w-4 h-4" /> 🎉 You qualified for FREE Delivery!
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between text-slate-700 font-medium mb-1">
                        <span>Free Delivery Goal</span>
                        <span className="font-bold text-orange-700">
                          ৳{subtotal.toLocaleString()} / ৳3,500
                        </span>
                      </div>
                      <div className="w-full bg-orange-200/60 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-orange-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (subtotal / 3500) * 100)}%` }}
                        />
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Add ৳{(3500 - subtotal).toLocaleString()} more for free nationwide delivery.
                      </div>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="divide-y divide-slate-100">
                  {items.map((item, idx) => (
                    <div key={`${item.product.id}-${idx}`} className="py-3 flex gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-16 h-16 rounded-lg object-cover border border-slate-200 bg-slate-50 shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">
                            {item.product.title}
                          </h4>
                          {item.selectedColor && (
                            <span className="text-[11px] text-slate-500">
                              Color: {item.selectedColor}
                            </span>
                          )}
                          <div className="text-xs font-bold text-orange-600 mt-0.5">
                            ৳{item.product.price.toLocaleString()}
                          </div>
                        </div>

                        {/* Quantity and Remove */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-slate-200 rounded-md bg-white">
                            <button
                              onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-xs text-slate-600 hover:bg-slate-100 font-bold"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-xs text-slate-600 hover:bg-slate-100 font-bold"
                            >
                              +
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800">
                              ৳{(item.product.price * item.quantity).toLocaleString()}
                            </span>
                            <button
                              onClick={() => onRemoveItem(idx)}
                              className="text-slate-400 hover:text-red-500 p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={onClearCart}
                    className="text-[11px] text-slate-400 hover:text-red-600 underline"
                  >
                    Clear entire cart
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              {/* Delivery Area Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Delivery Location:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onDeliveryAreaChange('dhaka')}
                    className={`p-2 rounded-lg text-xs font-medium border text-left transition-all ${
                      deliveryArea === 'dhaka'
                        ? 'border-orange-500 bg-white text-orange-900 ring-1 ring-orange-500'
                        : 'border-slate-200 bg-white/70 text-slate-700'
                    }`}
                  >
                    <div className="font-bold">Inside Dhaka</div>
                    <div className="text-[11px] text-slate-500">৳{deliveryDhaka} · 24-48 Hours</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeliveryAreaChange('outside')}
                    className={`p-2 rounded-lg text-xs font-medium border text-left transition-all ${
                      deliveryArea === 'outside'
                        ? 'border-orange-500 bg-white text-orange-900 ring-1 ring-orange-500'
                        : 'border-slate-200 bg-white/70 text-slate-700'
                    }`}
                  >
                    <div className="font-bold">Outside Dhaka</div>
                    <div className="text-[11px] text-slate-500">৳{deliveryOutside} · 48-72 Hours</div>
                  </button>
                </div>
              </div>

              {/* Calculations */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span className="font-semibold text-slate-900">
                    {isFreeDelivery ? (
                      <span className="text-emerald-600 font-bold">FREE (Promo)</span>
                    ) : (
                      `৳${deliveryCharge}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Payable:</span>
                  <span className="text-orange-600">৳{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={onProceedToCheckout}
                  className="w-full py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://wa.me/${cleanWa}?text=${waCartMsg}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
                    <span>Order on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(decodeURIComponent(waCartMsg));
                      window.open('https://m.me/tekohub99', '_blank');
                    }}
                    className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.43 3.16 7.15V22l3.05-1.68c1.19.33 2.45.51 3.79.51 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1.05 13.04l-2.61-2.78-5.1 2.78 5.61-5.95 2.68 2.78 5.03-2.78-5.61 5.95z"/>
                    </svg>
                    <span>Order on Facebook</span>
                  </button>
                </div>

                <p className="text-center text-[10px] text-slate-500 font-medium">
                  If WhatsApp is unavailable, you can also order via our Facebook Page.
                </p>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>bKash · Nagad · Rocket · Cash on Delivery Supported</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
