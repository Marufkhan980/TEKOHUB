import { Product, StoreConfig } from '../types';
import { TEKOHUB_BANNER_DATA_URI, TEKOHUB_LOGO_DATA_URI } from '../data/bannerBase64';

export function generateGoogleSitesEmbedHtml(
  products: Product[],
  config: StoreConfig,
  baseUrl: string = ''
): string {
  const logoUrl = TEKOHUB_LOGO_DATA_URI;
  const bannerUrl = (config.bannerImage && (config.bannerImage.startsWith('http') || config.bannerImage.startsWith('data:')))
    ? config.bannerImage
    : TEKOHUB_BANNER_DATA_URI;

  const productList = Array.isArray(products) ? products : [];
  const productsJson = JSON.stringify(
    productList.map(p => ({
      id: p.id,
      title: p.title,
      price: p.price,
      originalPrice: p.originalPrice || null,
      category: p.category,
      badge: p.badge || null,
      image: p.image,
      gallery: (p.gallery && p.gallery.length > 0) ? p.gallery : [p.image],
      shortDesc: p.shortDesc || '',
      features: p.features || [],
      specs: p.specs || {},
      colors: p.colors || [],
      warranty: p.warranty || 'Official Warranty & 7 Days Replacement',
      inStock: p.inStock !== false,
      stockQuantity: p.stockQuantity || 35,
      rating: p.rating || 4.8,
      reviewsCount: p.reviewsCount || 45
    }))
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.storeName} - Gadget Store</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { 
      scroll-behavior: smooth; 
      height: 100%; 
      background-color: #020617; 
    }
    body { 
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      background-color: #fcfcfc; 
      color: #0f172a; 
      width: 100%; 
      min-height: 100vh;
      min-height: 100%;
      display: flex;
      flex-direction: column;
      overflow-x: clip; 
    }
    .th-page-wrapper {
      flex: 1 0 auto;
      width: 100%;
      background-color: #fcfcfc;
    }
    .th-container { max-width: 1200px; margin: 0 auto; padding: 0 16px; }
    
    /* Top Announcement Bar */
    .th-topbar { background: #0f172a; color: #f1f5f9; font-size: 11px; padding: 6px 16px; }
    .th-topbar-inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
    .th-topbar-left { display: flex; align-items: center; gap: 16px; }
    .th-topbar-left span { display: inline-flex; align-items: center; gap: 5px; }
    .th-topbar-right { display: flex; align-items: center; gap: 12px; }
    .th-topbar-right a { color: #34d399; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
    
    /* Navigation Header */
    .th-header { background: rgba(255,255,255,0.96); border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 100; backdrop-filter: blur(8px); }
    .th-header-inner { max-width: 1200px; margin: 0 auto; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
    .th-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; color: inherit; }
    .th-logo img { height: 42px; width: auto; object-fit: contain; }
    .th-logo-text { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; color: #0f172a; line-height: 1; }
    .th-logo-sub { font-size: 10px; font-weight: 700; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase; margin-top: 2px; }
    
    .th-search-box { flex: 1; max-width: 440px; position: relative; }
    .th-search-box input { width: 100%; padding: 10px 14px 10px 36px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; outline: none; background: #f8fafc; }
    .th-search-box input:focus { border-color: #ea580c; background: #fff; box-shadow: 0 0 0 2px rgba(234,88,12,0.15); }
    .th-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 13px; color: #94a3b8; }
    
    .th-header-actions { display: flex; items: center; gap: 10px; }
    .th-btn-wa { display: inline-flex; align-items: center; gap: 6px; background: #25d366; color: white; text-decoration: none; padding: 9px 15px; border-radius: 8px; font-weight: 700; font-size: 13px; transition: background 0.2s; }
    .th-btn-wa:hover { background: #1eb857; }
    .th-btn-cart { position: relative; background: #fff; color: #1e293b; border: 1px solid #cbd5e1; padding: 9px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
    .th-btn-cart:hover { border-color: #ea580c; color: #ea580c; }
    .th-cart-badge { background: #ea580c; color: white; font-size: 11px; font-weight: 800; min-width: 20px; height: 20px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; padding: 0 5px; }

    /* Hero Banner - Compact Fixed 5:2 Aspect Ratio (Loads in 0ms) */
    .th-hero-wrap { margin-top: 12px; margin-bottom: 16px; }
    .th-hero { position: relative; border-radius: 12px; overflow: hidden; background: #faf9f6; box-shadow: 0 2px 10px -2px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; aspect-ratio: 5 / 2; max-height: 260px; display: flex; align-items: center; justify-content: center; }
    .th-hero img { width: 100%; height: 100%; object-fit: contain; object-position: center; display: block; }
    .th-hero-float { position: absolute; bottom: 10px; left: 10px; background: rgba(255,255,255,0.96); backdrop-filter: blur(4px); padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; color: #0f172a; box-shadow: 0 4px 10px rgba(0,0,0,0.08); display: flex; align-items: center; gap: 5px; }
    .th-hero-dot { width: 7px; height: 7px; background: #ea580c; border-radius: 50%; }

    /* Trust highlights */
    .th-trust-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 24px; }
    .th-trust-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 14px; display: flex; align-items: center; gap: 10px; }
    .th-trust-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; shrink: 0; }
    .th-trust-title { font-size: 12px; font-weight: 700; color: #0f172a; }
    .th-trust-desc { font-size: 11px; color: #64748b; }

    /* Category bar */
    .th-cat-bar { display: flex; align-items: center; justify-content: space-between; gap: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 20px; overflow-x: auto; }
    .th-cat-list { display: flex; align-items: center; gap: 8px; }
    .th-cat-btn { padding: 6px 14px; font-size: 13px; font-weight: 600; border-radius: 8px; border: 1px solid #e2e8f0; background: #f1f5f9; color: #334155; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
    .th-cat-btn.active { background: #0f172a; color: #fff; border-color: #0f172a; }

    /* Products Grid */
    .th-products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; margin-bottom: 40px; }
    .th-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; cursor: pointer; }
    .th-card:hover { transform: translateY(-3px); border-color: #ea580c; box-shadow: 0 12px 24px -6px rgba(0,0,0,0.08); }
    .th-card-img-wrap { position: relative; padding-top: 80%; background: #f8fafc; overflow: hidden; }
    .th-card-img-wrap img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .th-card-badge { position: absolute; top: 8px; left: 8px; background: #0f172a; color: white; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; }
    .th-card-discount { position: absolute; top: 8px; right: 8px; background: #ea580c; color: white; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
    .th-card-body { padding: 12px; display: flex; flex-direction: column; flex: 1; }
    .th-card-meta { font-size: 10px; font-weight: 700; color: #ea580c; text-transform: uppercase; margin-bottom: 4px; }
    .th-card-title { font-size: 13px; font-weight: 600; color: #0f172a; line-height: 1.35; height: 36px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; margin-bottom: 6px; }
    .th-card-price-row { margin-top: auto; display: flex; align-items: baseline; gap: 8px; padding-top: 8px; border-top: 1px solid #f1f5f9; }
    .th-card-price { font-size: 17px; font-weight: 800; color: #ea580c; }
    .th-card-old-price { font-size: 12px; color: #94a3b8; text-decoration: line-through; }
    .th-card-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 10px; }
    .th-btn-add { background: #f1f5f9; color: #1e293b; border: 1px solid #cbd5e1; padding: 7px 4px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; text-align: center; }
    .th-btn-add:hover { background: #e2e8f0; }
    .th-btn-buy { background: #ea580c; color: #fff; border: none; padding: 7px 4px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; text-align: center; }
    .th-btn-buy:hover { background: #c2410c; }

    /* Rich Dark Footer */
    .th-footer { background: #020617; color: #94a3b8; padding: 36px 16px 20px 16px; margin-top: auto; border-top: 1px solid #1e293b; width: 100%; }
    .th-footer-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; border-bottom: 1px solid #1e293b; padding-bottom: 24px; }
    .th-footer-col h4 { color: #fff; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
    .th-footer-col p { font-size: 12px; line-height: 1.6; margin-bottom: 8px; }
    .th-footer-badges { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
    .th-badge-mfs { font-size: 11px; font-weight: 700; color: #fff; padding: 3px 8px; border-radius: 4px; }
    .th-badge-bkash { background: #e2136e; }
    .th-badge-nagad { background: #ea580c; }
    .th-badge-rocket { background: #9333ea; }
    .th-badge-cod { background: #334155; }
    .th-footer-bottom { max-width: 1200px; margin: 16px auto 0 auto; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #64748b; flex-wrap: wrap; gap: 10px; }

    /* Floating WhatsApp Button */
    .th-float-wa { position: fixed; bottom: 20px; right: 20px; background: #25d366; color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 26px; box-shadow: 0 10px 25px rgba(37,211,102,0.4); text-decoration: none; z-index: 9999; transition: transform 0.2s; }
    .th-float-wa:hover { transform: scale(1.08); }

    /* Modals - Ultra-reliable for Google Sites Iframes */
    .th-modal-overlay { 
      display: none; 
      position: fixed; 
      inset: 0; 
      background: rgba(15,23,42,0.75); 
      z-index: 10000; 
      justify-content: center; 
      align-items: flex-start; 
      padding: 24px 14px; 
      backdrop-filter: blur(4px); 
      overflow-y: auto; 
      -webkit-overflow-scrolling: touch; 
    }
    .th-modal-box { 
      background: white; 
      border-radius: 16px; 
      max-width: 640px; 
      width: 100%; 
      margin: auto; 
      padding: 20px; 
      position: relative; 
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); 
    }

    @media (max-width: 768px) {
      .th-header-inner { flex-wrap: wrap; }
      .th-search-box { order: 3; max-width: 100%; width: 100%; }
      .th-topbar-left span:nth-child(2), .th-topbar-left span:nth-child(3) { display: none; }
      .th-hero img { min-height: 150px; }
      .th-products-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
      .th-modal-box { padding: 16px; border-radius: 12px; }
    }
  </style>
</head>
<body>
  <div class="th-page-wrapper">
  <!-- Top Announcement Bar -->
  <div class="th-topbar">
    <div class="th-topbar-inner">
      <div class="th-topbar-left">
        <span style="color: #fbbf24; font-weight: 600;">🛡️ 100% Authentic Gadgets</span>
        <span>🚚 Fast Delivery Across Bangladesh (Dhaka 24-48h)</span>
        <span>💬 WhatsApp Support Active</span>
      </div>
      <div class="th-topbar-right" style="display: flex; align-items: center; gap: 14px;">
        <div style="display: flex; items-center; gap: 10px; border-right: 1px solid #334155; padding-right: 12px;">
          <a href="${config.facebookUrl || 'https://www.facebook.com/tekohub99/'}" target="_blank" style="color: #94a3b8; text-decoration: none;" title="Facebook">
            <svg style="width: 14px; height: 14px; fill: currentColor;" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="${config.instagramUrl || 'https://www.instagram.com/teko_hub/?hl=en'}" target="_blank" style="color: #94a3b8; text-decoration: none;" title="Instagram">
            <svg style="width: 14px; height: 14px; fill: currentColor;" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a href="${config.tiktokUrl || 'https://www.tiktok.com/@teko_hub'}" target="_blank" style="color: #94a3b8; text-decoration: none;" title="TikTok">
            <svg style="width: 14px; height: 14px; fill: currentColor;" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.01 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
          </a>
        </div>
        <a href="https://wa.me/${config.whatsappNumber}?text=Hello%20TEKOHUB" target="_blank">
          <span>💬 Hotline: +${config.whatsappNumber}</span>
        </a>
      </div>
    </div>
  </div>

  <!-- Navigation Header -->
  <header class="th-header">
    <div class="th-header-inner">
      <a href="#" class="th-logo">
        <img src="${logoUrl}" alt="TEKOHUB" onerror="this.style.display='none'; document.getElementById('th-logo-fallback').style.display='block';" />
        <div id="th-logo-fallback" style="display: none;">
          <div class="th-logo-text">TEKO<span style="color: #ea580c;">HUB</span></div>
          <div class="th-logo-sub">Gadgets &amp; Accessories</div>
        </div>
      </a>

      <div class="th-search-box">
        <span class="th-search-icon">🔍</span>
        <input type="text" id="th-search-input" placeholder="Search gadgets, TWS, smartwatches, chargers..." oninput="TekohubStore.onSearch(this.value)" />
      </div>

      <div class="th-header-actions">
        <a href="https://wa.me/${config.whatsappNumber}?text=Hello%20TEKOHUB!%20I%20would%20like%20to%20order%20gadgets." target="_blank" class="th-btn-wa">
          <span>💬 WhatsApp</span>
        </a>
        <button class="th-btn-cart" onclick="TekohubStore.openCart()">
          <span>🛒 Cart</span>
          <span class="th-cart-badge" id="th-cart-count">0</span>
        </button>
      </div>
    </div>
  </header>

  <div class="th-container">
    <!-- Hero Banner (Fixed 5:2 Aspect Ratio) -->
    <div class="th-hero-wrap">
      <div class="th-hero">
        <img src="${bannerUrl}" alt="TEKOHUB - Smart Gadgets Better Life" onerror="this.src='${TEKOHUB_BANNER_DATA_URI}'" />
        <div class="th-hero-float">
          <span class="th-hero-dot"></span>
          <span>⚡ bKash &amp; Nagad Instant Send Money Verified</span>
        </div>
      </div>
    </div>

    <!-- Trust Highlights -->
    <div class="th-trust-grid">
      <div class="th-trust-card">
        <div class="th-trust-icon" style="background: #fff7ed; color: #ea580c;">🛡️</div>
        <div>
          <div class="th-trust-title">100% Genuine Gadgets</div>
          <div class="th-trust-desc">Original brand warranty</div>
        </div>
      </div>
      <div class="th-trust-card">
        <div class="th-trust-icon" style="background: #ecfdf5; color: #059669;">🚚</div>
        <div>
          <div class="th-trust-title">Fast Nationwide Delivery</div>
          <div class="th-trust-desc">Dhaka 24-48h · Outside 2-3 days</div>
        </div>
      </div>
      <div class="th-trust-card">
        <div class="th-trust-icon" style="background: #fdf2f8; color: #db2777;">💳</div>
        <div>
          <div class="th-trust-title">bKash, Nagad, Rocket</div>
          <div class="th-trust-desc">Instant Send Money &amp; COD</div>
        </div>
      </div>
      <div class="th-trust-card">
        <div class="th-trust-icon" style="background: #f0f9ff; color: #0284c7;">💬</div>
        <div>
          <div class="th-trust-title">WhatsApp Order Line</div>
          <div class="th-trust-desc">Instant 1-Click checkout</div>
        </div>
      </div>
    </div>

    <!-- Category Filters -->
    <div class="th-cat-bar">
      <div class="th-cat-list" id="th-category-container"></div>
    </div>

    <!-- Products Grid -->
    <div class="th-products-grid" id="th-products-container"></div>
  </div>
  </div> <!-- end th-page-wrapper -->

  <!-- Rich Dark Footer -->
  <footer class="th-footer">
    <div class="th-footer-inner">
      <div class="th-footer-col">
        <h4>TEKOHUB GADGETS</h4>
        <p>Premium curated smart gadgets, audio, wearables &amp; power essentials for Bangladesh tech enthusiasts.</p>
        <p style="color: #64748b; font-size: 11px;">📍 Aftabnogor, Dhaka, Bangladesh</p>
        <p style="color: #64748b; font-size: 11px;">📞 Hotline / WhatsApp: +${config.whatsappNumber}</p>
      </div>
      <div class="th-footer-col">
        <h4>Payment Methods</h4>
        <p>Instant Send-Money verification with Transaction ID &amp; Cash on Delivery available nationwide.</p>
        <div class="th-footer-badges">
          <span class="th-badge-mfs th-badge-bkash">bKash (${config.bkashNumber})</span>
          <span class="th-badge-mfs th-badge-nagad">Nagad (${config.nagadNumber})</span>
          <span class="th-badge-mfs th-badge-rocket">Rocket (${config.rocketNumber})</span>
          <span class="th-badge-mfs th-badge-cod">Cash on Delivery</span>
        </div>
      </div>
      <div class="th-footer-col">
        <h4>Delivery &amp; Warranty</h4>
        <p>• Inside Dhaka: ৳${config.deliveryDhaka} (24-48 Hours Express)</p>
        <p>• Outside Dhaka: ৳${config.deliveryOutside} (Steadfast Courier 48-72h)</p>
        <p>• 7-Day Replacement Guarantee &amp; Brand Warranty</p>
      </div>
    </div>
    <div class="th-footer-bottom">
      <div>© ${new Date().getFullYear()} TEKOHUB. All rights reserved.</div>
      <div>Smart Gadgets · Better Life</div>
    </div>
  </footer>

  <!-- Floating WhatsApp Quick Button -->
  <a href="https://wa.me/${config.whatsappNumber}?text=Hello%20TEKOHUB!%20I%20would%20like%20to%20order%20gadgets." target="_blank" class="th-float-wa" title="Order via WhatsApp">
    💬
  </a>

  <!-- Global Modal Overlay (for Cart, Product Details & Checkout) -->
  <div class="th-modal-overlay" id="th-modal-overlay" onclick="if(event.target===this)TekohubStore.closeModal()">
    <div class="th-modal-box" id="th-modal-box"></div>
  </div>

  <script>
  const TEKOHUB_CONFIG = {
    storeName: "${config.storeName}",
    whatsappNumber: "${config.whatsappNumber}",
    bkashNumber: "${config.bkashNumber}",
    nagadNumber: "${config.nagadNumber}",
    rocketNumber: "${config.rocketNumber}",
    deliveryDhaka: ${config.deliveryDhaka},
    deliveryOutside: ${config.deliveryOutside}
  };

  let TEKOHUB_PRODUCTS = ${productsJson};

  const TekohubStore = {
    cart: [],
    activeCategory: 'All',
    searchQuery: '',
    currentDetailProduct: null,
    currentDetailQty: 1,
    currentDetailColor: '',
    selectedMethod: 'bkash',

    init() {
      try {
        this.renderCategories();
        this.renderProducts();
        this.updateCartCount();
        this.notifyParentHeight();
      } catch (err) {
        console.error('TekohubStore init error:', err);
      }
    },

    notifyParentHeight() {
      try {
        const height = document.body.scrollHeight;
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ frameHeight: height, type: 'TEKOHUB_RESIZE' }, '*');
        }
      } catch (e) {}
    },

    renderCategories() {
      const standard = ['All', 'Audio & TWS', 'Smartwatches', 'Chargers & Power', 'Gaming & Desk', 'Accessories', 'Fashion'];
      const rawCats = Array.from(new Set(TEKOHUB_PRODUCTS.map(p => p.category)));
      const cats = [...standard];
      rawCats.forEach(c => {
        if (!cats.includes(c)) cats.push(c);
      });

      const container = document.getElementById('th-category-container');
      if (!container) return;
      container.innerHTML = cats.map(c => 
        \`<button class="th-cat-btn \${this.activeCategory === c ? 'active' : ''}" onclick="TekohubStore.setCategory('\${c}')">\${c}</button>\`
      ).join('');
    },

    setCategory(cat) {
      this.activeCategory = cat;
      this.renderCategories();
      this.renderProducts();
    },

    onSearch(val) {
      this.searchQuery = (val || '').toLowerCase().trim();
      this.renderProducts();
    },

    renderProducts() {
      const container = document.getElementById('th-products-container');
      if (!container) return;

      const filtered = TEKOHUB_PRODUCTS.filter(p => {
        const matchCat = this.activeCategory === 'All' || p.category === this.activeCategory;
        const matchSearch = !this.searchQuery || 
          p.title.toLowerCase().includes(this.searchQuery) || 
          p.shortDesc.toLowerCase().includes(this.searchQuery) ||
          p.category.toLowerCase().includes(this.searchQuery);
        return matchCat && matchSearch;
      });

      if (filtered.length === 0) {
        container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 50px 20px; color: #64748b; font-size: 14px;">No gadgets found matching your search.</div>';
        return;
      }

      container.innerHTML = filtered.map(p => {
        const discount = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
        return \`
          <div class="th-card" onclick="TekohubStore.openProductDetail('\${p.id}')">
            <div class="th-card-img-wrap">
              <img src="\${p.image}" alt="\${p.title}" onerror="this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'" loading="lazy" />
              \${p.badge ? \`<span class="th-card-badge">\${p.badge}</span>\` : ''}
              \${discount > 0 ? \`<span class="th-card-discount">-\${discount}%</span>\` : ''}
            </div>
            <div class="th-card-body">
              <div class="th-card-meta">\${p.category}</div>
              <h3 class="th-card-title" title="\${p.title}">\${p.title}</h3>
              <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">★ \${p.rating || 4.8} (\${p.reviewsCount || 45})</div>
              <div class="th-card-price-row">
                <span class="th-card-price">৳\${p.price.toLocaleString()}</span>
                \${p.originalPrice ? \`<span class="th-card-old-price">৳\${p.originalPrice.toLocaleString()}</span>\` : ''}
              </div>
              <div class="th-card-actions" onclick="event.stopPropagation()">
                <button class="th-btn-add" onclick="TekohubStore.addToCart('\${p.id}')">Add to Cart</button>
                <button class="th-btn-buy" onclick="TekohubStore.quickBuy('\${p.id}')">Buy Now</button>
              </div>
            </div>
          </div>
        \`;
      }).join('');

      this.notifyParentHeight();
    },

    openProductDetail(id) {
      const p = TEKOHUB_PRODUCTS.find(item => item.id === id);
      if (!p) return;
      const overlay = document.getElementById('th-modal-overlay');
      const box = document.getElementById('th-modal-box');
      if (!overlay || !box) return;

      this.currentDetailProduct = p;
      this.currentDetailQty = 1;
      this.currentDetailColor = (p.colors && p.colors.length > 0) ? p.colors[0].name : '';

      const images = (p.gallery && p.gallery.length > 0) ? p.gallery : [p.image];
      const discount = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
      const colors = p.colors || [];
      const features = p.features || [];
      const cleanWa = String(TEKOHUB_CONFIG.whatsappNumber).replace(/[^0-9]/g, '');

      const waInquiryMsg = encodeURIComponent(
        \`Hello TEKOHUB! 👋\\nI want to order / inquire about:\\n*\${p.title}*\\n\${this.currentDetailColor ? \`Color: \${this.currentDetailColor}\\n\` : ''}Price: ৳\${p.price.toLocaleString()}\\n\\nIs this in stock for delivery?\`
      );

      box.innerHTML = \`
        <div style="position: relative;">
          <button onclick="TekohubStore.closeModal()" style="position: absolute; top: -4px; right: -4px; background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 50%; font-size: 16px; font-weight: bold; cursor: pointer; color: #475569; display: flex; align-items: center; justify-content: center; z-index: 20;">✕</button>

          <div style="display: grid; grid-template-columns: 1fr; gap: 16px; padding-top: 4px;">
            <!-- Main Photo Gallery -->
            <div>
              <div style="position: relative; width: 100%; aspect-ratio: 1/1; max-height: 290px; border-radius: 12px; overflow: hidden; background: #f8fafc; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center;">
                <img id="th-detail-main-img" src="\${p.image}" alt="\${p.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'" />
                \${p.badge ? \`<span style="position: absolute; top: 10px; left: 10px; background: #0f172a; color: white; font-size: 10px; font-weight: bold; padding: 3px 8px; border-radius: 4px;">\${p.badge}</span>\` : ''}
              </div>

              \${images.length > 1 ? \`
                <div style="display: flex; gap: 8px; margin-top: 10px; overflow-x: auto; padding-bottom: 4px;">
                  \${images.map((img, idx) => \`
                    <button type="button" onclick="document.getElementById('th-detail-main-img').src='\${img}'" style="width: 54px; height: 54px; padding: 0; border-radius: 8px; overflow: hidden; border: 2px solid \${idx === 0 ? '#ea580c' : '#cbd5e1'}; cursor: pointer; flex-shrink: 0; background: none;">
                      <img src="\${img}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'" />
                    </button>
                  \`).join('')}
                </div>
              \` : ''}
            </div>

            <!-- Product Info -->
            <div>
              <div style="font-size: 11px; font-weight: 700; color: #ea580c; text-transform: uppercase;">\${p.category}</div>
              <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 4px 0 8px 0; line-height: 1.3;">\${p.title}</h2>
              
              <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: #64748b; margin-bottom: 12px; flex-wrap: wrap;">
                <span style="color: #f59e0b; font-weight: 700;">★ \${p.rating || 4.8}</span>
                <span>(\${p.reviewsCount || 45} reviews)</span>
                <span>·</span>
                <span style="color: \${p.inStock ? '#059669' : '#dc2626'}; font-weight: 700; background: \${p.inStock ? '#ecfdf5' : '#fef2f2'}; padding: 2px 8px; border-radius: 4px;">
                  \${p.inStock ? \`In Stock (\${p.stockQuantity || 35} units left)\` : 'Out of Stock'}
                </span>
              </div>

              <!-- Price Box -->
              <div style="display: flex; align-items: baseline; gap: 10px; margin-bottom: 12px; padding: 10px 14px; background: #fff7ed; border-radius: 8px; border: 1px solid #ffedd5;">
                <span style="font-size: 24px; font-weight: 800; color: #ea580c;">৳\${p.price.toLocaleString()}</span>
                \${p.originalPrice ? \`
                  <span style="font-size: 14px; color: #94a3b8; text-decoration: line-through;">৳\${p.originalPrice.toLocaleString()}</span>
                  <span style="font-size: 11px; font-weight: 800; color: #ea580c; background: #fed7aa; padding: 2px 6px; border-radius: 4px;">-\${discount}% OFF</span>
                \` : ''}
              </div>

              <!-- Warranty & Delivery -->
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; margin-bottom: 12px; font-size: 12px; color: #334155; display: flex; flex-direction: column; gap: 6px;">
                <div style="display: flex; align-items: center; gap: 6px; font-weight: 600;">
                  <span>🛡️</span>
                  <span>\${p.warranty || 'Official Warranty & 7 Days Replacement'}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px; color: #64748b;">
                  <span>🚚</span>
                  <span>Inside Dhaka: ৳\${TEKOHUB_CONFIG.deliveryDhaka} (24-48h) · Outside Dhaka: ৳\${TEKOHUB_CONFIG.deliveryOutside} (48-72h)</span>
                </div>
              </div>

              <!-- Short Description -->
              \${p.shortDesc ? \`<p style="font-size: 13px; color: #475569; line-height: 1.5; margin-bottom: 12px;">\${p.shortDesc}</p>\` : ''}

              <!-- Features -->
              \${features.length > 0 ? \`
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 11px; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 4px;">Key Features:</div>
                  <ul style="font-size: 12px; color: #475569; padding-left: 18px; margin: 0; line-height: 1.6;">
                    \${features.map(f => \`<li>\${f}</li>\`).join('')}
                  </ul>
                </div>
              \` : ''}

              <!-- Color Picker -->
              \${colors.length > 0 ? \`
                <div style="margin-bottom: 14px;">
                  <div style="font-size: 11px; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 6px;">
                    Select Color: <span id="th-selected-color-label" style="color: #ea580c; font-weight: 800;">\${colors[0].name}</span>
                  </div>
                  <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    \${colors.map((c, idx) => \`
                      <button type="button" onclick="TekohubStore.selectDetailColor('\${c.name}')" id="th-color-opt-\${idx}" style="display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; border: 2px solid \${idx === 0 ? '#ea580c' : '#cbd5e1'}; background: white; font-size: 12px; font-weight: 600; cursor: pointer;">
                        <span style="width: 12px; height: 12px; border-radius: 50%; background: \${c.hex}; display: inline-block; border: 1px solid #94a3b8;"></span>
                        <span>\${c.name}</span>
                      </button>
                    \`).join('')}
                  </div>
                </div>
              \` : ''}

              <!-- Quantity Selector & Actions -->
              <div style="display: flex; gap: 8px; align-items: center; margin-top: 14px; flex-wrap: wrap;">
                <div style="display: flex; align-items: center; border: 1px solid #cbd5e1; border-radius: 8px; background: white; overflow: hidden;">
                  <button type="button" onclick="TekohubStore.changeDetailQty(-1)" style="padding: 10px 14px; border: none; background: none; font-size: 16px; cursor: pointer; font-weight: bold;">-</button>
                  <span id="th-detail-qty-display" style="min-width: 28px; text-align: center; font-size: 14px; font-weight: 700;">1</span>
                  <button type="button" onclick="TekohubStore.changeDetailQty(1)" style="padding: 10px 14px; border: none; background: none; font-size: 16px; cursor: pointer; font-weight: bold;">+</button>
                </div>

                <button type="button" onclick="TekohubStore.addDetailToCart()" style="flex: 1; min-width: 110px; padding: 12px 8px; background: #0f172a; color: white; border: none; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                  🛒 Add to Cart
                </button>

                <button type="button" onclick="TekohubStore.buyDetailNow()" style="flex: 1; min-width: 110px; padding: 12px 8px; background: #ea580c; color: white; border: none; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                  ⚡ Buy Now
                </button>
              </div>

              <!-- Direct WhatsApp button -->
              <a href="https://wa.me/\${cleanWa}?text=\${waInquiryMsg}" target="_blank" style="display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; margin-top: 10px; padding: 11px; background: #25d366; color: white; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 13px;">
                💬 Inquire / Order on WhatsApp
              </a>
            </div>
          </div>
        </div>
      \`;

      overlay.style.display = 'flex';
      overlay.scrollTop = 0;
    },

    selectDetailColor(name) {
      this.currentDetailColor = name;
      const lbl = document.getElementById('th-selected-color-label');
      if (lbl) lbl.innerText = name;
      if (this.currentDetailProduct && this.currentDetailProduct.colors) {
        this.currentDetailProduct.colors.forEach((c, idx) => {
          const btn = document.getElementById('th-color-opt-' + idx);
          if (btn) {
            btn.style.borderColor = (c.name === name) ? '#ea580c' : '#cbd5e1';
          }
        });
      }
    },

    changeDetailQty(delta) {
      this.currentDetailQty = Math.max(1, (this.currentDetailQty || 1) + delta);
      const disp = document.getElementById('th-detail-qty-display');
      if (disp) disp.innerText = this.currentDetailQty;
    },

    addDetailToCart() {
      if (!this.currentDetailProduct) return;
      const p = this.currentDetailProduct;
      const qty = this.currentDetailQty || 1;
      const color = this.currentDetailColor;
      const existing = this.cart.find(c => c.product.id === p.id && c.selectedColor === color);
      if (existing) {
        existing.quantity += qty;
      } else {
        this.cart.push({ product: p, quantity: qty, selectedColor: color });
      }
      this.updateCartCount();
      this.openCart();
    },

    buyDetailNow() {
      if (!this.currentDetailProduct) return;
      const p = this.currentDetailProduct;
      const qty = this.currentDetailQty || 1;
      const color = this.currentDetailColor;
      this.cart = [{ product: p, quantity: qty, selectedColor: color }];
      this.updateCartCount();
      this.openCheckout();
    },

    addToCart(id) {
      const p = TEKOHUB_PRODUCTS.find(item => item.id === id);
      if (!p) return;
      const existing = this.cart.find(c => c.product.id === id);
      if (existing) {
        existing.quantity += 1;
      } else {
        this.cart.push({ product: p, quantity: 1, selectedColor: (p.colors && p.colors.length > 0) ? p.colors[0].name : '' });
      }
      this.updateCartCount();
      this.openCart();
    },

    quickBuy(id) {
      const p = TEKOHUB_PRODUCTS.find(item => item.id === id);
      if (!p) return;
      this.cart = [{ product: p, quantity: 1, selectedColor: (p.colors && p.colors.length > 0) ? p.colors[0].name : '' }];
      this.updateCartCount();
      this.openCheckout();
    },

    updateCartCount() {
      const total = this.cart.reduce((sum, item) => sum + item.quantity, 0);
      const badge = document.getElementById('th-cart-count');
      if (badge) badge.innerText = total;
    },

    openCart() {
      const overlay = document.getElementById('th-modal-overlay');
      const box = document.getElementById('th-modal-box');
      if (!overlay || !box) return;

      if (this.cart.length === 0) {
        box.innerHTML = \`
          <div style="text-align: center; padding: 30px 10px;">
            <div style="font-size: 40px; margin-bottom: 10px;">🛒</div>
            <h3 style="font-size: 18px; margin-bottom: 6px;">Your Cart is Empty</h3>
            <p style="color: #64748b; font-size: 13px; margin-bottom: 20px;">Explore trending gadgets and add your favorites!</p>
            <button onclick="TekohubStore.closeModal()" style="background: #ea580c; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer;">Continue Shopping</button>
          </div>
        \`;
        overlay.style.display = 'flex';
        overlay.scrollTop = 0;
        return;
      }

      const subtotal = this.cart.reduce((s, i) => s + (i.product.price * i.quantity), 0);

      box.innerHTML = \`
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 14px;">
          <h3 style="font-size: 17px; font-weight: 700;">Shopping Cart (\${this.cart.reduce((s, i) => s + i.quantity, 0)} items)</h3>
          <button onclick="TekohubStore.closeModal()" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #64748b;">✕</button>
        </div>

        <div style="max-height: 280px; overflow-y: auto; margin-bottom: 16px;">
          \${this.cart.map((item, idx) => \`
            <div style="display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
              <img src="\${item.product.image}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 6px; border: 1px solid #e2e8f0;" onerror="this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'" />
              <div style="flex: 1;">
                <div style="font-size: 13px; font-weight: 600; color: #0f172a;">\${item.product.title} \${item.selectedColor ? \`<span style="color: #64748b; font-size: 11px;">(\${item.selectedColor})</span>\` : ''}</div>
                <div style="font-size: 12px; color: #ea580c; font-weight: 700;">৳\${item.product.price.toLocaleString()} x \${item.quantity}</div>
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <button onclick="TekohubStore.changeQty(\${idx}, -1)" style="width: 24px; height: 24px; border: 1px solid #cbd5e1; background: white; border-radius: 4px; cursor: pointer;">-</button>
                <span style="font-size: 13px; font-weight: 700; min-width: 16px; text-align: center;">\${item.quantity}</span>
                <button onclick="TekohubStore.changeQty(\${idx}, 1)" style="width: 24px; height: 24px; border: 1px solid #cbd5e1; background: white; border-radius: 4px; cursor: pointer;">+</button>
              </div>
            </div>
          \`).join('')}
        </div>

        <div style="background: #f8fafc; border-radius: 8px; padding: 12px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 700;">
            <span>Subtotal:</span>
            <span style="color: #ea580c;">৳\${subtotal.toLocaleString()}</span>
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Delivery: Inside Dhaka ৳\${TEKOHUB_CONFIG.deliveryDhaka} / Outside ৳\${TEKOHUB_CONFIG.deliveryOutside}</div>
        </div>

        <div style="display: flex; gap: 10px;">
          <button onclick="TekohubStore.closeModal()" style="flex: 1; padding: 12px; border: 1px solid #cbd5e1; background: white; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer;">Keep Shopping</button>
          <button onclick="TekohubStore.openCheckout()" style="flex: 1; padding: 12px; border: none; background: #ea580c; color: white; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer;">Proceed to Checkout</button>
        </div>
      \`;
      overlay.style.display = 'flex';
      overlay.scrollTop = 0;
    },

    changeQty(idx, delta) {
      if (!this.cart[idx]) return;
      this.cart[idx].quantity += delta;
      if (this.cart[idx].quantity <= 0) {
        this.cart.splice(idx, 1);
      }
      this.updateCartCount();
      this.openCart();
    },

    openCheckout() {
      const overlay = document.getElementById('th-modal-overlay');
      const box = document.getElementById('th-modal-box');
      if (!overlay || !box || this.cart.length === 0) return;

      const subtotal = this.cart.reduce((s, i) => s + (i.product.price * i.quantity), 0);

      box.innerHTML = \`
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 14px;">
          <h3 style="font-size: 17px; font-weight: 700;">Secure Purchase</h3>
          <button onclick="TekohubStore.closeModal()" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #64748b;">✕</button>
        </div>

        <form onsubmit="TekohubStore.submitOrder(event)" style="display: flex; flex-direction: column; gap: 12px;">
          <div>
            <label style="display: block; font-size: 12px; font-weight: 700; margin-bottom: 4px;">Full Name *</label>
            <input required id="th-cname" type="text" placeholder="e.g. Tanvir Ahmed" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;" />
          </div>

          <div>
            <label style="display: block; font-size: 12px; font-weight: 700; margin-bottom: 4px;">Active Phone Number *</label>
            <input required id="th-cphone" type="tel" placeholder="017XXXXXXXX" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;" />
          </div>

          <div>
            <label style="display: block; font-size: 12px; font-weight: 700; margin-bottom: 4px;">Delivery Location *</label>
            <select id="th-cdeliv" onchange="TekohubStore.recalcTotal()" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
              <option value="dhaka">Inside Dhaka (৳\${TEKOHUB_CONFIG.deliveryDhaka} - 24-48h)</option>
              <option value="outside">Outside Dhaka (৳\${TEKOHUB_CONFIG.deliveryOutside} - 48-72h)</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-size: 12px; font-weight: 700; margin-bottom: 4px;">Full Delivery Address *</label>
            <textarea required id="th-caddress" rows="2" placeholder="House/Road, Area/Thana, District" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;"></textarea>
          </div>

          <div>
            <label style="display: block; font-size: 12px; font-weight: 700; margin-bottom: 6px;">Payment Method *</label>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;">
              <button type="button" onclick="TekohubStore.setMethod('bkash')" id="btn-bkash" style="border: 2px solid #e2136e; background: #fdf2f8; color: #e2136e; padding: 8px 4px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">bKash</button>
              <button type="button" onclick="TekohubStore.setMethod('nagad')" id="btn-nagad" style="border: 1px solid #cbd5e1; background: white; color: #ea580c; padding: 8px 4px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">Nagad</button>
              <button type="button" onclick="TekohubStore.setMethod('rocket')" id="btn-rocket" style="border: 1px solid #cbd5e1; background: white; color: #9333ea; padding: 8px 4px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">Rocket</button>
              <button type="button" onclick="TekohubStore.setMethod('cod')" id="btn-cod" style="border: 1px solid #cbd5e1; background: white; color: #334155; padding: 8px 4px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">Cash On</button>
            </div>
          </div>

          <div id="th-mfs-box" style="background: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 8px; padding: 12px; font-size: 12px; color: #831843;">
            <div style="font-weight: 700; margin-bottom: 4px;">bKash Send Money Guide:</div>
            <div>1. Send Money to Personal: <b id="th-mfs-num">\${TEKOHUB_CONFIG.bkashNumber}</b></div>
            <div>2. Enter your Sender Number &amp; TrxID below:</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px;">
              <input id="th-msender" type="text" placeholder="Sender bKash No." style="padding: 7px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px;" />
              <input id="th-mtrx" type="text" placeholder="Transaction ID (TrxID)" style="padding: 7px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; text-transform: uppercase;" />
            </div>
          </div>

          <div style="background: #f8fafc; border-radius: 8px; padding: 12px;">
            <div style="display: flex; justify-content: space-between; font-size: 13px; color: #475569;">
              <span>Subtotal:</span>
              <span>৳\${subtotal.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 13px; color: #475569; margin-top: 2px;">
              <span>Delivery:</span>
              <span id="th-deliv-lbl">৳\${TEKOHUB_CONFIG.deliveryDhaka}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 800; color: #0f172a; border-top: 1px dashed #cbd5e1; padding-top: 6px; margin-top: 6px;">
              <span>Total Payable:</span>
              <span id="th-total-lbl" style="color: #ea580c;">৳\${(subtotal + TEKOHUB_CONFIG.deliveryDhaka).toLocaleString()}</span>
            </div>
          </div>

          <button type="submit" style="background: #25d366; color: white; border: none; padding: 13px; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
            💬 Confirm Order &amp; Send to WhatsApp
          </button>
        </form>
      \`;
      this.selectedMethod = 'bkash';
      overlay.style.display = 'flex';
      overlay.scrollTop = 0;
    },

    setMethod(m) {
      this.selectedMethod = m;
      const box = document.getElementById('th-mfs-box');
      const bBkash = document.getElementById('btn-bkash');
      const bNagad = document.getElementById('btn-nagad');
      const bRocket = document.getElementById('btn-rocket');
      const bCod = document.getElementById('btn-cod');
      
      [bBkash, bNagad, bRocket, bCod].forEach(b => {
        if (b) { b.style.border = '1px solid #cbd5e1'; b.style.background = '#fff'; }
      });

      if (!box) return;

      if (m === 'bkash') {
        if (bBkash) { bBkash.style.border = '2px solid #e2136e'; bBkash.style.background = '#fdf2f8'; }
        box.style.display = 'block';
        box.style.background = '#fdf2f8';
        box.style.borderColor = '#fbcfe8';
        box.style.color = '#831843';
        box.innerHTML = \`
          <div style="font-weight: 700; margin-bottom: 4px;">bKash Send Money Guide:</div>
          <div>1. Send Money to Personal: <b>\${TEKOHUB_CONFIG.bkashNumber}</b></div>
          <div>2. Enter your Sender Number &amp; TrxID below:</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px;">
            <input id="th-msender" type="text" placeholder="Sender bKash No." style="padding: 7px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px;" />
            <input id="th-mtrx" type="text" placeholder="Transaction ID (TrxID)" style="padding: 7px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; text-transform: uppercase;" />
          </div>
        \`;
      } else if (m === 'nagad') {
        if (bNagad) { bNagad.style.border = '2px solid #ea580c'; bNagad.style.background = '#fff7ed'; }
        box.style.display = 'block';
        box.style.background = '#fff7ed';
        box.style.borderColor = '#fed7aa';
        box.style.color = '#9a3412';
        box.innerHTML = \`
          <div style="font-weight: 700; margin-bottom: 4px;">Nagad Send Money Guide:</div>
          <div>1. Send Money to Personal: <b>\${TEKOHUB_CONFIG.nagadNumber}</b></div>
          <div>2. Enter your Sender Number &amp; TrxID below:</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px;">
            <input id="th-msender" type="text" placeholder="Sender Nagad No." style="padding: 7px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px;" />
            <input id="th-mtrx" type="text" placeholder="Transaction ID (TrxID)" style="padding: 7px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; text-transform: uppercase;" />
          </div>
        \`;
      } else if (m === 'rocket') {
        if (bRocket) { bRocket.style.border = '2px solid #9333ea'; bRocket.style.background = '#faf5ff'; }
        box.style.display = 'block';
        box.style.background = '#faf5ff';
        box.style.borderColor = '#e9d5ff';
        box.style.color = '#6b21a8';
        box.innerHTML = \`
          <div style="font-weight: 700; margin-bottom: 4px;">Rocket Send Money Guide:</div>
          <div>1. Send Money to Personal: <b>\${TEKOHUB_CONFIG.rocketNumber}</b></div>
          <div>2. Enter your Sender Number &amp; TrxID below:</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px;">
            <input id="th-msender" type="text" placeholder="Sender Rocket No." style="padding: 7px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px;" />
            <input id="th-mtrx" type="text" placeholder="Transaction ID (TrxID)" style="padding: 7px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; text-transform: uppercase;" />
          </div>
        \`;
      } else {
        if (bCod) { bCod.style.border = '2px solid #334155'; bCod.style.background = '#f1f5f9'; }
        box.style.display = 'block';
        box.style.background = '#f1f5f9';
        box.style.borderColor = '#cbd5e1';
        box.style.color = '#334155';
        box.innerHTML = '<div style="font-size: 12px;">Cash on Delivery selected. You can pay cash when receiving the parcel. Our team may verify via phone before dispatch.</div>';
      }
    },

    recalcTotal() {
      const area = document.getElementById('th-cdeliv').value;
      const subtotal = this.cart.reduce((s, i) => s + (i.product.price * i.quantity), 0);
      const charge = area === 'dhaka' ? TEKOHUB_CONFIG.deliveryDhaka : TEKOHUB_CONFIG.deliveryOutside;
      const delLbl = document.getElementById('th-deliv-lbl');
      const totLbl = document.getElementById('th-total-lbl');
      if (delLbl) delLbl.innerText = '৳' + charge;
      if (totLbl) totLbl.innerText = '৳' + (subtotal + charge).toLocaleString();
    },

    submitOrder(e) {
      e.preventDefault();
      const name = (document.getElementById('th-cname').value || '').trim();
      const phone = (document.getElementById('th-cphone').value || '').trim();
      const area = document.getElementById('th-cdeliv').value;
      const address = (document.getElementById('th-caddress').value || '').trim();
      const method = this.selectedMethod || 'bkash';
      const sender = document.getElementById('th-msender') ? document.getElementById('th-msender').value.trim() : '';
      const trxid = document.getElementById('th-mtrx') ? document.getElementById('th-mtrx').value.trim() : '';

      const subtotal = this.cart.reduce((s, i) => s + (i.product.price * i.quantity), 0);
      const delCharge = area === 'dhaka' ? TEKOHUB_CONFIG.deliveryDhaka : TEKOHUB_CONFIG.deliveryOutside;
      const total = subtotal + delCharge;
      const orderId = 'TH' + Math.floor(100000 + Math.random() * 900000);

      const itemsSummary = this.cart.map((c, i) => 
        \`\${i + 1}. *\${c.product.title}*\${c.selectedColor ? \` [Color: \${c.selectedColor}]\` : ''} x \${c.quantity} = ৳\${(c.product.price * c.quantity).toLocaleString()}\`
      ).join('\\n');

      const paymentLabel = method === 'bkash' ? 'bKash (Send Money)'
        : method === 'nagad' ? 'Nagad (Send Money)'
        : method === 'rocket' ? 'Rocket (Send Money)'
        : 'Cash on Delivery (COD)';

      const paymentExtra = method !== 'cod'
        ? \`\\n*TrxID:* \${trxid || 'N/A'}\\n*Sender No:* \${sender || 'N/A'}\`
        : '\\n*Note:* Pay cash upon delivery';

      const orderMsg = 
        \`*🛒 NEW ORDER - \${TEKOHUB_CONFIG.storeName}*\\n\` +
        \`----------------------------------------\\n\` +
        \`*Order ID:* \${orderId}\\n\` +
        \`*Date:* \${new Date().toLocaleDateString('en-GB')}\\n\\n\` +
        \`*📦 Items Ordered:*\\n\` +
        \`\${itemsSummary}\\n\\n\` +
        \`----------------------------------------\\n\` +
        \`*Subtotal:* ৳\${subtotal.toLocaleString()}\\n\` +
        \`*Delivery Charge (\${area === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}):* ৳\${delCharge}\\n\` +
        \`*Total Payable:* ৳\${total.toLocaleString()}\\n\\n\` +
        \`*💳 Payment Details:*\\n\` +
        \`*Method:* \${paymentLabel}\${paymentExtra}\\n\\n\` +
        \`*👤 Customer Info:*\\n\` +
        \`*Name:* \${name}\\n\` +
        \`*Phone:* \${phone}\\n\` +
        \`*Address:* \${address}\\n\` +
        \`----------------------------------------\\n\` +
        \`Please confirm my order and send the delivery tracking details. Thank you!\`;

      const cleanNumber = String(TEKOHUB_CONFIG.whatsappNumber).replace(/[^0-9]/g, '');
      const waUrl = \`https://wa.me/\${cleanNumber}?text=\${encodeURIComponent(orderMsg)}\`;

      const box = document.getElementById('th-modal-box');
      if (box) {
        box.innerHTML = \`
          <div style="text-align: center; padding: 20px 10px;">
            <div style="font-size: 46px; color: #10b981; margin-bottom: 8px;">✅</div>
            <h3 style="font-size: 20px; font-weight: 800; margin-bottom: 6px; color: #0f172a;">Order Placed Successfully!</h3>
            <p style="color: #475569; font-size: 13px; margin-bottom: 6px;">Order ID: <b style="color: #0f172a; font-family: monospace;">#\${orderId}</b></p>
            <p style="color: #64748b; font-size: 12px; margin-bottom: 20px;">We sent your order to WhatsApp. If it didn't open automatically, click below:</p>
            
            <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px;">
              <a href="\${waUrl}" target="_blank" style="display: flex; align-items: center; justify-content: center; gap: 8px; background: #16a34a; color: white; text-decoration: none; padding: 13px; border-radius: 10px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 14px rgba(22,163,74,0.3);">
                💬 Order on WhatsApp
              </a>
              <a href="https://m.me/tekohub99" target="_blank" style="display: flex; align-items: center; justify-content: center; gap: 8px; background: #2563eb; color: white; text-decoration: none; padding: 13px; border-radius: 10px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 14px rgba(37,99,235,0.3);">
                📘 Order on Facebook Inbox
              </a>
            </div>

            <p style="color: #64748b; font-size: 11px; margin-bottom: 16px; line-height: 1.4;">
              If WhatsApp is unavailable, you can also order via our Facebook Page.
            </p>
            
            <button onclick="TekohubStore.closeModal(); TekohubStore.cart = []; TekohubStore.updateCartCount();" style="background: none; border: 1px solid #cbd5e1; padding: 8px 18px; border-radius: 6px; font-size: 12px; color: #64748b; cursor: pointer;">
              Close &amp; Back to Store
            </button>
          </div>
        \`;
      }

      try {
        window.open(waUrl, '_blank');
      } catch (err) {}
    },

    closeModal() {
      const overlay = document.getElementById('th-modal-overlay');
      if (overlay) overlay.style.display = 'none';
    }
  };

  // Immediate and DOM ready initialization for maximum compatibility
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => TekohubStore.init());
  } else {
    TekohubStore.init();
  }
  </script>
</body>
</html>`;
}
