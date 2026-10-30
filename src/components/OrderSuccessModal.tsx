import React from 'react';
import { CheckCircle2, MessageCircle, Printer, ShoppingBag, ArrowRight, ShieldCheck, Copy, Check } from 'lucide-react';
import { Order, StoreConfig } from '../types';
import { formatWhatsAppOrderMessage, generateWhatsAppOrderUrl } from '../utils/whatsapp';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  config: StoreConfig;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  config
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!order) return null;

  const waMsg = formatWhatsAppOrderMessage({
    orderId: order.id,
    items: order.items,
    customer: order.customer,
    payment: order.payment,
    deliveryCharge: order.deliveryCharge,
    subtotal: order.subtotal,
    total: order.total,
    storeName: config.storeName
  });

  const waUrl = generateWhatsAppOrderUrl(config.whatsappNumber, waMsg);

  const handlePrint = () => {
    window.print();
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon & Heading */}
        <div className="text-center pb-4 border-b border-slate-200">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">
            Order Placed Successfully!
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Thank you for shopping with TEKOHUB Gadgets
          </p>

          <div className="mt-3 inline-flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold text-slate-800">
            <span>Order ID: #{order.id}</span>
            <button
              onClick={copyOrderId}
              className="text-slate-500 hover:text-slate-800 cursor-pointer"
              title="Copy Order ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="py-4 space-y-3 text-xs">
          {/* Customer & Address */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
            <div className="font-bold text-slate-900">Delivery Information:</div>
            <div className="text-slate-700"><b>Name:</b> {order.customer.name}</div>
            <div className="text-slate-700"><b>Phone:</b> {order.customer.phone}</div>
            <div className="text-slate-700">
              <b>Address:</b> {order.customer.address} (
              {order.customer.deliveryArea === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})
            </div>
            {order.customer.notes && (
              <div className="text-slate-500 italic"><b>Note:</b> {order.customer.notes}</div>
            )}
          </div>

          {/* Payment Info */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
            <div className="font-bold text-slate-900">Payment Status:</div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">
                Method: <b>{order.payment.method.toUpperCase()}</b>
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">
                Pending Verification
              </span>
            </div>
            {order.payment.method !== 'cod' && (
              <>
                <div className="text-slate-700 font-mono">
                  Sender: <b>{order.payment.senderNumber}</b>
                </div>
                <div className="text-slate-700 font-mono">
                  TrxID: <b>{order.payment.transactionId}</b>
                </div>
              </>
            )}
          </div>

          {/* Items Table */}
          <div className="space-y-1.5 pt-1">
            <div className="font-bold text-slate-900 mb-1">Purchased Gadgets:</div>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-700 truncate pr-2">
                  {item.product.title} {item.selectedColor ? `(${item.selectedColor})` : ''} x {item.quantity}
                </span>
                <span className="font-mono font-semibold text-slate-900 shrink-0">
                  ৳{(item.product.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="pt-2 border-t border-slate-200 space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono font-medium">৳{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Charge:</span>
              <span className="font-mono font-medium">৳{order.deliveryCharge}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
              <span>Total Amount:</span>
              <span className="text-orange-600 font-mono">৳{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Priority Action: Send WhatsApp Confirmation */}
        <div className="space-y-3 pt-3 border-t border-slate-200">
          <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-emerald-950 text-xs">
            <div className="font-bold flex items-center gap-1.5 text-emerald-800">
              <span className="text-sm">🔔</span>
              <span>দোকানদারকে TrxID ও অর্ডার কনফার্ম করতে WhatsApp এ পাঠান:</span>
            </div>
            <p className="text-[11px] text-emerald-900 mt-1 leading-relaxed">
              পেমেন্ট যাচাই করে দ্রুত পার্সেল পাঠানো হবে। নিচের বাটনে ক্লিক করলে সমস্ত বিবরণ স্বয়ংক্রিয়ভাবে TEKOHUB-এর WhatsApp (<b>01572923121</b>)-এ চলে যাবে।
            </p>
          </div>

          <div className="space-y-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <MessageCircle className="w-5 h-5 fill-white/20" />
              <span>Order on WhatsApp</span>
            </a>

            <button
              onClick={() => {
                navigator.clipboard.writeText(waMsg);
                window.open('https://m.me/tekohub99', '_blank');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.43 3.16 7.15V22l3.05-1.68c1.19.33 2.45.51 3.79.51 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1.05 13.04l-2.61-2.78-5.1 2.78 5.61-5.95 2.68 2.78 5.03-2.78-5.61 5.95z"/>
              </svg>
              <span>Order on Facebook Inbox</span>
            </button>

            <p className="text-center text-[11px] text-slate-500 font-medium">
              If WhatsApp is unavailable, you can also order via our Facebook Page.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePrint}
              className="py-2 px-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={onClose}
              className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>

        <div className="mt-4 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Our support team will verify your payment and contact you shortly.</span>
        </div>
      </div>
    </div>
  );
};
