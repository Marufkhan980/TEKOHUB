import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, ShieldCheck, ArrowLeft, Send, AlertCircle, Sparkles } from 'lucide-react';
import { CartItem, CustomerInfo, Order, PaymentDetails, PaymentMethod, StoreConfig } from '../types';
import { formatWhatsAppOrderMessage, generateWhatsAppOrderUrl } from '../utils/whatsapp';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  deliveryArea: 'dhaka' | 'outside';
  onDeliveryAreaChange: (area: 'dhaka' | 'outside') => void;
  config: StoreConfig;
  onOrderComplete: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  deliveryArea,
  onDeliveryAreaChange,
  config,
  onOrderComplete
}) => {
  if (!isOpen || items.length === 0) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bkash');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryCharge = subtotal >= config.freeDeliveryThreshold ? 0 : (deliveryArea === 'dhaka' ? config.deliveryDhaka : config.deliveryOutside);
  const total = subtotal + deliveryCharge;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getTargetPaymentNumber = () => {
    if (paymentMethod === 'bkash') return config.bkashNumber;
    if (paymentMethod === 'nagad') return config.nagadNumber;
    if (paymentMethod === 'rocket') return config.rocketNumber;
    return '';
  };

  const handleSubmit = (channel: 'whatsapp' | 'facebook' = 'whatsapp') => {
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 11) {
      setErrorMsg('Please enter a valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX).');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Please enter your complete delivery address with area and city.');
      return;
    }

    if (paymentMethod !== 'cod') {
      if (!senderNumber.trim()) {
        setErrorMsg(`Please enter your sender ${paymentMethod.toUpperCase()} number.`);
        return;
      }
      if (!transactionId.trim()) {
        setErrorMsg('Please enter the Transaction ID (TrxID) from your payment confirmation SMS/App.');
        return;
      }
    }

    const orderId = 'TH' + Math.floor(100000 + Math.random() * 900000);

    const customer: CustomerInfo = {
      name,
      phone,
      email,
      address,
      deliveryArea,
      notes
    };

    const payment: PaymentDetails = {
      method: paymentMethod,
      senderNumber,
      transactionId,
      notes
    };

    const order: Order = {
      id: orderId,
      items,
      customer,
      payment,
      deliveryCharge,
      subtotal,
      total,
      createdAt: new Date().toISOString(),
      status: 'pending_verification'
    };

    // Generate prefilled order message
    const msg = formatWhatsAppOrderMessage({
      orderId,
      items,
      customer,
      payment,
      deliveryCharge,
      subtotal,
      total,
      storeName: config.storeName
    });

    if (channel === 'facebook') {
      try {
        navigator.clipboard.writeText(msg);
      } catch (e) {}
      const fbUrl = config.facebookUrl && config.facebookUrl.includes('facebook.com')
        ? `https://m.me/${config.facebookUrl.replace(/\/+$/, '').split('facebook.com/')[1]?.split('/')[0] || 'tekohub99'}`
        : 'https://m.me/tekohub99';
      window.open(fbUrl, '_blank');
    } else {
      const waUrl = generateWhatsAppOrderUrl(config.whatsappNumber, msg);
      window.open(waUrl, '_blank');
    }

    onOrderComplete(order);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Finalize Secure Purchase
            </h2>
            <p className="text-xs text-slate-500">
              bKash / Nagad / Rocket Send Money & Direct WhatsApp Confirmation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Customer Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">1</span>
              Customer & Delivery Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Active Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivery Location <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onDeliveryAreaChange('dhaka')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      deliveryArea === 'dhaka'
                        ? 'border-orange-500 bg-orange-50/50 text-orange-950 font-bold ring-1 ring-orange-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs">Inside Dhaka</div>
                    <div className="text-[11px] text-slate-500 font-normal">
                      ৳{config.deliveryDhaka} · 24-48 Hours Fast Delivery
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeliveryAreaChange('outside')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      deliveryArea === 'outside'
                        ? 'border-orange-500 bg-orange-50/50 text-orange-950 font-bold ring-1 ring-orange-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs">Outside Dhaka</div>
                    <div className="text-[11px] text-slate-500 font-normal">
                      ৳{config.deliveryOutside} · Steadfast Courier (48-72 Hours)
                    </div>
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detailed Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House #, Road #, Sector/Area, Thana, District"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Special Instructions or Delivery Note (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Call before delivery, leave with guard if absent"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
              Payment Method (bKash / Nagad / Rocket / Cash On Delivery)
            </h3>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {/* bKash */}
              <button
                type="button"
                onClick={() => setPaymentMethod('bkash')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'bkash'
                    ? 'border-pink-600 bg-pink-50/70 text-pink-700 ring-2 ring-pink-500/30 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="text-sm font-extrabold text-[#E2136E]">bKash</div>
                <div className="text-[10px] text-slate-500">Send Money</div>
              </button>

              {/* Nagad */}
              <button
                type="button"
                onClick={() => setPaymentMethod('nagad')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'nagad'
                    ? 'border-orange-600 bg-orange-50/70 text-orange-700 ring-2 ring-orange-500/30 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="text-sm font-extrabold text-[#EA580C]">Nagad</div>
                <div className="text-[10px] text-slate-500">Send Money</div>
              </button>

              {/* Rocket */}
              <button
                type="button"
                onClick={() => setPaymentMethod('rocket')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'rocket'
                    ? 'border-purple-600 bg-purple-50/70 text-purple-700 ring-2 ring-purple-500/30 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="text-sm font-extrabold text-[#9333EA]">Rocket</div>
                <div className="text-[10px] text-slate-500">Send Money</div>
              </button>

              {/* Cash on Delivery */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-slate-800 bg-slate-100 text-slate-900 ring-2 ring-slate-400/40 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="text-sm font-extrabold text-slate-800">Cash On</div>
                <div className="text-[10px] text-slate-500">Delivery (COD)</div>
              </button>
            </div>

            {/* MFS Send Money Instructions Box */}
            {paymentMethod !== 'cod' ? (
              <div
                className={`p-4 rounded-xl border text-xs space-y-3 ${
                  paymentMethod === 'bkash'
                    ? 'bg-pink-50/50 border-pink-200 text-pink-950'
                    : paymentMethod === 'nagad'
                    ? 'bg-orange-50/50 border-orange-200 text-orange-950'
                    : 'bg-purple-50/50 border-purple-200 text-purple-950'
                }`}
              >
                <div className="font-bold text-sm flex items-center justify-between">
                  <span>How to Send Money via {paymentMethod.toUpperCase()}:</span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white border border-slate-200">
                    {paymentMethod === 'bkash'
                      ? config.bkashType
                      : paymentMethod === 'nagad'
                      ? config.nagadType
                      : config.rocketType}{' '}
                    Account
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {/* Account Number with Copy */}
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">
                        {paymentMethod.toUpperCase()} Receiver Number:
                      </span>
                      <span className="font-mono text-sm font-bold text-slate-900">
                        {getTargetPaymentNumber()}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(getTargetPaymentNumber(), 'num')}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedField === 'num' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </>
                      )}
                    </button>
                  </div>

                  {/* Exact Amount with Copy */}
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">
                        Exact Amount to Send:
                      </span>
                      <span className="font-mono text-sm font-bold text-orange-600">
                        ৳{total.toLocaleString()}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(total.toString(), 'amount')}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedField === 'amount' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <ol className="list-decimal list-inside space-y-1 text-slate-700 text-[11px]">
                  <li>
                    Open your {paymentMethod.toUpperCase()} App or dial USSD code (*247# for bKash, *167# for Nagad).
                  </li>
                  <li>
                    Select <b>Send Money</b> and enter receiver number:{' '}
                    <code className="font-mono font-bold bg-white px-1 py-0.5 rounded">
                      {getTargetPaymentNumber()}
                    </code>
                  </li>
                  <li>
                    Enter amount: <b>৳{total.toLocaleString()}</b> and reference: <b>TEKOHUB</b>
                  </li>
                  <li>Enter your PIN to finalize transfer.</li>
                  <li>Copy the <b>Transaction ID (TrxID)</b> and enter it below:</li>
                </ol>

                {/* Sender & TrxID Input Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1">
                      Your Sender {paymentMethod.toUpperCase()} Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1">
                      Transaction ID (TrxID) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                      placeholder="e.g. 9K8L2M3P"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-semibold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-2">
                <div className="font-bold text-slate-900">Cash on Delivery (COD) Policy:</div>
                <p className="text-[11px] leading-relaxed">
                  You can pay the full amount of <b>৳{total.toLocaleString()}</b> in cash when the delivery agent delivers your package.
                  For parcel booking verification, our team may call your mobile or request delivery charge (৳{deliveryCharge}) via bKash/Nagad before dispatch.
                </p>
              </div>
            )}
          </div>

          {/* Section 3: Order Breakdown */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 mb-2">Order Summary</h4>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 divide-y divide-slate-100">
              {items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center py-1 text-slate-700">
                  <span className="line-clamp-1 pr-2">
                    {it.product.title} {it.selectedColor ? `(${it.selectedColor})` : ''} x {it.quantity}
                  </span>
                  <span className="font-semibold shrink-0">
                    ৳{(it.product.price * it.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 space-y-1 text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-900">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery ({deliveryArea === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}):</span>
                <span className="font-semibold text-slate-900">
                  {deliveryCharge === 0 ? 'FREE' : `৳${deliveryCharge}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-1.5 border-t border-slate-200">
                <span>Total Payable:</span>
                <span className="text-orange-600">৳{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            {/* Primary: Order on WhatsApp */}
            <button
              type="button"
              onClick={() => handleSubmit('whatsapp')}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              <MessageCircle className="w-5 h-5 fill-white/20" />
              <span>Order on WhatsApp</span>
            </button>

            {/* Alternative: Order on Facebook Inbox */}
            <button
              type="button"
              onClick={() => handleSubmit('facebook')}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.43 3.16 7.15V22l3.05-1.68c1.19.33 2.45.51 3.79.51 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1.05 13.04l-2.61-2.78-5.1 2.78 5.61-5.95 2.68 2.78 5.03-2.78-5.61 5.95z"/>
              </svg>
              <span>Order on Facebook Inbox</span>
            </button>

            {/* Helper notice */}
            <p className="text-center text-[11px] text-slate-500 font-medium">
              If WhatsApp is unavailable, you can also order via our Facebook Page.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secure 256-bit checkout • Your info is protected</span>
          </div>
        </div>
      </div>
    </div>
  );
};
