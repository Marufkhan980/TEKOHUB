import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Code,
  Plus,
  RefreshCw,
  Settings,
  Sparkles,
  HelpCircle,
  AlertCircle,
  Download,
  FileCode,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Product, StoreConfig } from '../types';
import { generateGoogleSitesEmbedHtml } from '../utils/embedGenerator';

interface GoogleSitesEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (newProducts: Product[]) => void;
  config: StoreConfig;
  onUpdateConfig: (newConfig: StoreConfig) => void;
}

export const GoogleSitesEmbedModal: React.FC<GoogleSitesEmbedModalProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProducts,
  config,
  onUpdateConfig
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'embed_code' | 'script_editor' | 'add_product' | 'guide' | 'settings'>('embed_code');
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [scriptSuccessMessage, setScriptSuccessMessage] = useState<string | null>(null);
  const [scriptErrorMessage, setScriptErrorMessage] = useState<string | null>(null);

  // Raw script JSON representation
  const initialJson = JSON.stringify(
    products.map(p => ({
      id: p.id,
      title: p.title,
      price: p.price,
      originalPrice: p.originalPrice || null,
      category: p.category,
      badge: p.badge || null,
      image: p.image,
      shortDesc: p.shortDesc,
      inStock: p.inStock
    })),
    null,
    2
  );

  const [scriptEditorContent, setScriptEditorContent] = useState<string>(initialJson);

  // New product form states
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newOriginalPrice, setNewOriginalPrice] = useState('');
  const [newCategory, setNewCategory] = useState<'Smartwatches' | 'Audio & TWS' | 'Chargers & Power' | 'Gaming & Desk' | 'Accessories'>('Audio & TWS');
  const [newBadge, setNewBadge] = useState<string>('New Arrival');
  const [newImage, setNewImage] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Generate full embed HTML with complete preview parity
  const embedCode = generateGoogleSitesEmbedHtml(products, config);

  // Live app URL for Option B (Embed by URL)
  const currentAppUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-6e5vv2pjjdc5rz6fu4wrv7-569700562999.asia-northeast1.run.app';

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // 1-Click Download tekohub-store.html
  const handleDownloadHtml = () => {
    const blob = new Blob([embedCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tekohub-store-embed.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess('tekohub-store-embed.html downloaded successfully!');
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  // 1-Click Download products JSON
  const handleDownloadJson = () => {
    const blob = new Blob([scriptEditorContent], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tekohub-products.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess('tekohub-products.json downloaded successfully!');
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  // Apply script JSON changes directly to store gallery
  const handleApplyScriptChanges = () => {
    setScriptErrorMessage(null);
    setScriptSuccessMessage(null);

    try {
      const parsed = JSON.parse(scriptEditorContent);
      if (!Array.isArray(parsed)) {
        throw new Error('Script data must be a valid JSON Array of products.');
      }

      const updatedList: Product[] = parsed.map((item, index) => ({
        id: item.id || `th-custom-${Date.now()}-${index}`,
        title: item.title || 'Untitled Gadget',
        slug: (item.title || 'gadget').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        price: Number(item.price) || 0,
        originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
        category: item.category || 'Accessories',
        rating: item.rating || 4.8,
        reviewsCount: item.reviewsCount || Math.floor(20 + Math.random() * 80),
        inStock: item.inStock !== false,
        stockQuantity: item.stockQuantity || 25,
        badge: item.badge || undefined,
        image: item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        gallery: [item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
        shortDesc: item.shortDesc || 'Premium authentic gadget with manufacturer guarantee.',
        features: item.features || [
          'Authentic quality guarantee',
          'Fast delivery inside and outside Dhaka',
          'bKash, Nagad, Rocket send money supported'
        ],
        specs: item.specs || {
          'Warranty': 'Official Store Warranty',
          'Condition': 'Brand New Factory Sealed'
        }
      }));

      onUpdateProducts(updatedList);
      setScriptSuccessMessage(`Success! Product display gallery updated with ${updatedList.length} products.`);
      setTimeout(() => setScriptSuccessMessage(null), 4000);
    } catch (err: any) {
      setScriptErrorMessage(err.message || 'Invalid JSON format in custom script.');
    }
  };

  // Add product form submit
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice.trim()) {
      alert('Please provide title and price.');
      return;
    }

    const priceNum = parseFloat(newPrice);
    const origPriceNum = newOriginalPrice ? parseFloat(newOriginalPrice) : undefined;
    const fallbackImage = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80';

    const newProd: Product = {
      id: `th-${Date.now()}`,
      title: newTitle.trim(),
      slug: newTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      price: priceNum,
      originalPrice: origPriceNum,
      category: newCategory,
      rating: 4.9,
      reviewsCount: 12,
      inStock: true,
      stockQuantity: 30,
      badge: (newBadge as any) || undefined,
      image: newImage.trim() || fallbackImage,
      gallery: [newImage.trim() || fallbackImage],
      shortDesc: newDesc.trim() || 'Latest high performance tech gadget with fast nationwide delivery.',
      features: [
        '100% Genuine and authentic product',
        'Direct bKash/Nagad/Rocket Send Money verification',
        'Official warranty included'
      ],
      specs: {
        'Condition': 'Brand New In Box',
        'Warranty': '3 Months Warranty'
      }
    };

    const updated = [newProd, ...products];
    onUpdateProducts(updated);

    setScriptEditorContent(
      JSON.stringify(
        updated.map(p => ({
          id: p.id,
          title: p.title,
          price: p.price,
          originalPrice: p.originalPrice || null,
          category: p.category,
          badge: p.badge || null,
          image: p.image,
          shortDesc: p.shortDesc,
          inStock: p.inStock
        })),
        null,
        2
      )
    );

    setNewTitle('');
    setNewPrice('');
    setNewOriginalPrice('');
    setNewImage('');
    setNewDesc('');
    setScriptSuccessMessage(`"${newProd.title}" added! Display gallery and embed code updated.`);
    setTimeout(() => setScriptSuccessMessage(null), 3500);
    setActiveTab('embed_code');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <span>Google Sites 100% Preview-Matching Embed</span>
                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Updated &amp; Fixed
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Full header, hero banner, trust cards, products, and rich dark footer included • No blank void
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadHtml}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
              title="Download HTML file directly"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .HTML</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('embed_code')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'embed_code'
                ? 'border-orange-600 text-orange-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Updated Embed Code &amp; Download</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'guide'
                ? 'border-orange-600 text-orange-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How to Fix Blank Space in Google Sites</span>
          </button>

          <button
            onClick={() => setActiveTab('script_editor')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'script_editor'
                ? 'border-orange-600 text-orange-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Custom Script &amp; Gallery Sync</span>
          </button>

          <button
            onClick={() => setActiveTab('add_product')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'add_product'
                ? 'border-orange-600 text-orange-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product (GUI)</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'border-orange-600 text-orange-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Payment &amp; Numbers</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {downloadSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{downloadSuccess}</span>
            </div>
          )}

          {/* TAB 1: Google Sites Embed Code & Downloads */}
          {activeTab === 'embed_code' && (
            <div className="space-y-5">
              {/* Solution Notice for Product Details, WhatsApp Order, and Fast Loading */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-950 flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-sm text-emerald-900">
                    Google Sites Embed: Product Details &amp; WhatsApp Order Fixed! (সমাধান করা হয়েছে)
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-emerald-900 leading-relaxed">
                    <li><b>Product Details Popup:</b> Google Sites-এ যেকোনো প্রোডাক্ট কার্ড বা ছবিতে ক্লিক করলেই বিস্তারিত (Gallery, Warranty, Specs, Color, Qty) পপআপ হিসেবে দেখতে পাবেন।</li>
                    <li><b>Full WhatsApp Order Details:</b> অর্ডার কনফার্ম করলে আগের মতো সম্পুর্ণ ডিটেইলস (Order ID, পণ্যের তালিকা, TrxID, ডেলিভারি ঠিকানা) সুন্দরভাবে হোয়াটসঅ্যাপে চলে যাবে। মাঝপথে কেটে যাওয়ার সমস্যা সমাধান করা হয়েছে।</li>
                    <li><b>Fast Loading &amp; Lightweight:</b> কোডের সাইজ ১০০ কিলোবাইট এর বেশি কমানো হয়েছে, যার ফলে Google Sites-এ খুব দ্রুত লোড হবে এবং হ্যাং হবে না।</li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons: Copy & Download */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Full Standalone Embed Script (HTML + JS + CSS)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Copy and paste into Google Sites: <b>Insert &gt; Embed &gt; Embed code</b>.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadHtml}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Download complete standalone HTML file"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .HTML</span>
                  </button>

                  <button
                    onClick={() => handleCopyCode(embedCode)}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" /> Copy Embed Script
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Code Box */}
              <div className="relative">
                <textarea
                  readOnly
                  rows={10}
                  value={embedCode}
                  className="w-full font-mono text-[11px] bg-slate-900 text-slate-200 p-3.5 rounded-xl border border-slate-800 focus:outline-none select-all"
                />
              </div>

              {/* Alternative: Embed by URL */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-orange-600" />
                      <span>Alternative Method: Embed by URL in Google Sites</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      In Google Sites, you can also click <b>Insert &gt; Embed &gt; By URL</b> and paste your live URL directly!
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopyCode(currentAppUrl)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy Store URL
                  </button>
                </div>

                <div className="bg-slate-100 p-2.5 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 break-all select-all">
                  {currentAppUrl}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Guide: How to Fix Blank Space in Google Sites */}
          {activeTab === 'guide' && (
            <div className="space-y-5">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-xs text-orange-950 space-y-2.5">
                <div className="font-bold text-sm text-orange-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <span>কেন শুধু পিসি/ডেস্কটপে (PC Desktop) নিচে সাদা ফাকা দেখা দেয়?</span>
                </div>
                <p className="leading-relaxed">
                  • <b>মোবাইলে ঠিক দেখায় কেন:</b> মোবাইল স্ক্রিন চিকন হওয়ায় পণ্যগুলো ১-২ কলামে একের নিচে এক সাজানো থাকে, ফলে পুরো পেজটি লম্বা হয়ে Google Sites-এর সম্পূর্ণ ফ্রেম ভরে যায়।
                </p>
                <p className="leading-relaxed">
                  • <b>পিসিতে সাদা ফাকা হওয়ার কারণ:</b> পিসি বা ল্যাপটপের ওয়াইড স্ক্রিনে পণ্যগুলো পাশাপাশি ৪ থেকে ৫ কলামে থাকে। ফলে সম্পূর্ণ স্টোরটি কম উচ্চতায় উপরেই শেষ হয়ে যায়। কিন্তু Google Sites এডিটরে যদি ফ্রেমের উচ্চতা মোবাইলের জন্য বেশি টেনে রাখা থাকে, তবে পিসিতে ফুটারের নিচে ফাকা সাদা জায়গা তৈরি হয়।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                    1
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">আপডেট করা Embed Code কপি করুন</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    নতুন কোডে ডার্ক ফুটারটিকে স্বয়ংক্রিয়ভাবে নিচের সাথে লক (Sticky Bottom Anchor) করে দেওয়া হয়েছে, যাতে নিচে কোনো বিচ্ছিন্ন সাদা ফাকা দেখা না যায়।
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="w-7 h-7 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center text-xs">
                    2
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">এডিটরে Blue Handle টি ওপরে টানুন</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Google Sites এডিটরে Embed বক্সের নিচে মাঝখানে যে <b>নীল গোল বৃত্ত (Blue Dot Handle)</b> রয়েছে, সেটি টেনে ঠিক ডার্ক ফুটারের নিচ পর্যন্ত এনে দিন।
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                    3
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Publish করে প্রিভিউ দেখুন</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    উপরে ডানের <b>&quot;Publish&quot;</b> বাটনে ক্লিক করুন। মোবাইল, ট্যাবলেট ও পিসি—সব ডিভাইসেই ব্যানার ও ফুটার কোনো ফাকা স্পেস ছাড়াই নিখুঁত দেখাবে!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Custom Script & Gallery Sync */}
          {activeTab === 'script_editor' && (
            <div className="space-y-4">
              <div className="bg-orange-50/80 border border-orange-200 rounded-xl p-3 text-xs text-orange-950 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Live Product Script Synchronizer</div>
                  <div>
                    Edit product prices, image URLs, or titles in the JSON script below.
                    Click <b>&quot;Apply Script Changes to Product Gallery&quot;</b> to update the display gallery and embed code instantly!
                  </div>
                </div>
              </div>

              {scriptSuccessMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{scriptSuccessMessage}</span>
                </div>
              )}

              {scriptErrorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>{scriptErrorMessage}</span>
                </div>
              )}

              <div className="relative">
                <div className="text-[11px] font-mono text-slate-500 mb-1 flex items-center justify-between">
                  <span>TEKOHUB_PRODUCTS (JSON Array):</span>
                  <span>{products.length} products loaded</span>
                </div>
                <textarea
                  value={scriptEditorContent}
                  onChange={(e) => setScriptEditorContent(e.target.value)}
                  rows={14}
                  spellCheck={false}
                  className="w-full font-mono text-xs bg-slate-900 text-emerald-400 p-3.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/30 leading-relaxed resize-y selection:bg-orange-500 selection:text-white"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleApplyScriptChanges}
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Apply Script Changes to Product Gallery</span>
                  </button>

                  <button
                    onClick={handleDownloadJson}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON</span>
                  </button>
                </div>

                <button
                  onClick={() => setActiveTab('embed_code')}
                  className="text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1"
                >
                  <span>View Updated Embed Script</span> &rarr;
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Add Product GUI */}
          {activeTab === 'add_product' && (
            <form onSubmit={handleAddProductSubmit} className="space-y-4 max-w-xl mx-auto">
              <div className="text-xs text-slate-500">
                Quickly add a new tech gadget to your store. It will automatically update the product display gallery and the embed script.
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Anker 20W Fast USB-C Nano Charger"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Sale Price (BDT ৳) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="1250"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Original / Regular Price (৳)
                    </label>
                    <input
                      type="number"
                      value={newOriginalPrice}
                      onChange={(e) => setNewOriginalPrice(e.target.value)}
                      placeholder="1650 (Optional)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="Fashion">Fashion</option>
                      <option value="Smartwatches">Smartwatches</option>
                      <option value="Audio & TWS">Audio & TWS</option>
                      <option value="Chargers & Power">Chargers & Power</option>
                      <option value="Gaming & Desk">Gaming & Desk</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Badge Label
                    </label>
                    <select
                      value={newBadge}
                      onChange={(e) => setNewBadge(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="New Arrival">New Arrival</option>
                      <option value="Bestseller">Bestseller</option>
                      <option value="Hot Deal">Hot Deal</option>
                      <option value="Trending">Trending</option>
                      <option value="">None</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Product Image URL
                  </label>
                  <input
                    type="url"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... or your gadget photo link"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Key specifications, battery life, fast charging power, etc."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product to Store Gallery</span>
              </button>
            </form>
          )}

          {/* TAB 5: Payment & Numbers Settings */}
          {activeTab === 'settings' && (
            <div className="space-y-4 max-w-xl mx-auto">
              <div className="text-xs text-slate-500">
                Configure your Bangladesh payment numbers and WhatsApp hotline. Changes immediately update the checkout flow and the Google Sites embed code!
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    WhatsApp Order Number (with Country Code 880)
                  </label>
                  <input
                    type="text"
                    value={config.whatsappNumber}
                    onChange={(e) => onUpdateConfig({ ...config, whatsappNumber: e.target.value })}
                    placeholder="8801712345678"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#E2136E] mb-1">
                      bKash Number
                    </label>
                    <input
                      type="text"
                      value={config.bkashNumber}
                      onChange={(e) => onUpdateConfig({ ...config, bkashNumber: e.target.value })}
                      placeholder="01712-345678"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#EA580C] mb-1">
                      Nagad Number
                    </label>
                    <input
                      type="text"
                      value={config.nagadNumber}
                      onChange={(e) => onUpdateConfig({ ...config, nagadNumber: e.target.value })}
                      placeholder="01812-345678"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#9333EA] mb-1">
                      Rocket Number
                    </label>
                    <input
                      type="text"
                      value={config.rocketNumber}
                      onChange={(e) => onUpdateConfig({ ...config, rocketNumber: e.target.value })}
                      placeholder="01912-345678-9"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Inside Dhaka Delivery (৳)
                    </label>
                    <input
                      type="number"
                      value={config.deliveryDhaka}
                      onChange={(e) => onUpdateConfig({ ...config, deliveryDhaka: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Outside Dhaka Delivery (৳)
                    </label>
                    <input
                      type="number"
                      value={config.deliveryOutside}
                      onChange={(e) => onUpdateConfig({ ...config, deliveryOutside: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-800">
                    Official Social Media Channels
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#1877F2] mb-0.5">
                      Facebook Page URL
                    </label>
                    <input
                      type="url"
                      value={config.facebookUrl || ''}
                      onChange={(e) => onUpdateConfig({ ...config, facebookUrl: e.target.value })}
                      placeholder="https://www.facebook.com/tekohub99/"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#E1306C] mb-0.5">
                      Instagram Profile URL
                    </label>
                    <input
                      type="url"
                      value={config.instagramUrl || ''}
                      onChange={(e) => onUpdateConfig({ ...config, instagramUrl: e.target.value })}
                      placeholder="https://www.instagram.com/teko_hub/?hl=en"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-800 mb-0.5">
                      TikTok Profile URL
                    </label>
                    <input
                      type="url"
                      value={config.tiktokUrl || ''}
                      onChange={(e) => onUpdateConfig({ ...config, tiktokUrl: e.target.value })}
                      placeholder="https://www.tiktok.com/@teko_hub"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-lg text-xs text-slate-600">
                ✅ Settings &amp; social media channels are automatically saved and updated in the embed script.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
