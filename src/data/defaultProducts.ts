import { Product } from '../types';

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'th-01',
    title: 'Ultrapods Pro Transparent TWS Earbuds',
    slug: 'ultrapods-pro-transparent-tws',
    price: 850,
    originalPrice: 1250,
    category: 'Audio & TWS',
    rating: 4.8,
    reviewsCount: 142,
    inStock: true,
    stockQuantity: 45,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80'
    ],
    shortDesc: 'Cyberpunk crystal clear case with LED battery percentage display, ENC ambient noise cancellation, and punchy deep bass.',
    features: [
      'Digital LED power display on charging case',
      'Environmental Noise Cancellation (ENC) dual mics',
      'Bluetooth 5.3 instant auto-pairing',
      'Up to 24 hours total playtime with case',
      'Touch controls for music and call answering'
    ],
    specs: {
      'Bluetooth Version': '5.3 + EDR',
      'Playtime': '5-6 hours per charge (24h with case)',
      'Charging Time': '1 hour Type-C Fast Charge',
      'Water Resistance': 'IPX4 Splashproof',
      'Driver Size': '13mm Titanium Dynamic Driver',
      'Warranty': '3 Months Replacement Guarantee'
    },
    colors: [
      { name: 'Crystal Green', hex: '#10B981' },
      { name: 'Ice Blue', hex: '#38BDF8' },
      { name: 'Cyber Black', hex: '#1F2937' },
      { name: 'Pure White', hex: '#F3F4F6' }
    ],
    warranty: '3 Months Replacement Warranty'
  },
  {
    id: 'th-02',
    title: 'Hoco Y18 AMOLED Bluetooth Calling Smartwatch',
    slug: 'hoco-y18-amoled-smartwatch',
    price: 2450,
    originalPrice: 3200,
    category: 'Smartwatches',
    rating: 4.9,
    reviewsCount: 98,
    inStock: true,
    stockQuantity: 28,
    badge: 'Hot Deal',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
    ],
    shortDesc: 'Stunning 1.43-inch Always-on AMOLED display, zinc alloy metallic chassis, HD Bluetooth dial & call, and full health monitoring suite.',
    features: [
      '1.43" HD AMOLED display with 466x466 resolution',
      'Crystal clear HD Bluetooth phone calls with dialer',
      'Continuous Heart Rate, SpO2 & Sleep Tracker',
      '100+ Sports Modes with GPS trajectory sync',
      'Custom watch faces via companion app (Android & iOS)'
    ],
    specs: {
      'Display': '1.43" AMOLED 466*466 pixels',
      'Battery': '300mAh (5-7 days normal use)',
      'Waterproof': 'IP68 certified water resistant',
      'Material': 'Zinc alloy body with silicone strap',
      'Compatibility': 'Android 5.0+ and iOS 10.0+',
      'Warranty': '6 Months Official Warranty'
    },
    colors: [
      { name: 'Obsidian Black', hex: '#111827' },
      { name: 'Space Silver', hex: '#9CA3AF' },
      { name: 'Champagne Gold', hex: '#D97706' }
    ],
    warranty: '6 Months Official Warranty'
  },
  {
    id: 'th-03',
    title: 'Remax RPP-522 30000mAh 22.5W Fast Charging Power Bank',
    slug: 'remax-rpp-522-30000mah-powerbank',
    price: 1890,
    originalPrice: 2400,
    category: 'Chargers & Power',
    rating: 4.9,
    reviewsCount: 215,
    inStock: true,
    stockQuantity: 34,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=800&auto=format&fit=crop&q=80'
    ],
    shortDesc: 'Massive 30000mAh high-density polymer battery with 22.5W Super Charge, PD 20W two-way fast charging, and LED digital capacity indicator.',
    features: [
      'Charges iPhone 14/15 up to 6 times full',
      'PD 20W + QC 22.5W Huawei SuperCharge support',
      'Multi-port design: Charge 3 devices simultaneously',
      'Intelligent safety chip protection (Overheat, short-circuit)',
      'Flight-compliant fireproof ABS material'
    ],
    specs: {
      'Capacity': '30000mAh / 111Wh',
      'Output Ports': '2x USB-A (22.5W max) + 1x Type-C (20W PD)',
      'Input Ports': 'Type-C + Micro USB',
      'Display': 'LED digital power screen',
      'Weight': '580g',
      'Warranty': '6 Months Warranty'
    },
    colors: [
      { name: 'Matte Black', hex: '#18181B' },
      { name: 'Clean White', hex: '#F4F4F5' }
    ],
    warranty: '6 Months Replacement Warranty'
  },
  {
    id: 'th-04',
    title: 'Joyroom 65W GaN 3-Port Super Fast Wall Charger',
    slug: 'joyroom-65w-gan-fast-charger',
    price: 1450,
    originalPrice: 1850,
    category: 'Chargers & Power',
    rating: 4.8,
    reviewsCount: 84,
    inStock: true,
    stockQuantity: 19,
    badge: 'Trending',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
    shortDesc: 'Next-gen Gallium Nitride (GaN) fast charger capable of charging laptops, MacBooks, tablets, and phones at full 65W speed in ultra-compact size.',
    features: [
      'GaN III technology runs cooler and 50% smaller than standard blocks',
      'Dual Type-C (PD 65W) + 1 USB-A (QC 3.0)',
      'Supports Samsung Super Fast Charging 2.0 (45W)',
      'Smart power distribution when 2 or 3 ports connected',
      'Foldable plug pins for easy travel'
    ],
    specs: {
      'Total Output': '65W Max',
      'Input': 'AC 100-240V, 50/60Hz (Worldwide)',
      'Type-C1/C2': '5V/3A, 9V/3A, 12V/3A, 15V/3A, 20V/3.25A (65W)',
      'USB-A': '4.5V/5A, 5V/4.5A, 9V/3A, 12V/2.5A, 20V/1.5A (30W)',
      'Dimensions': '58 x 36 x 32 mm'
    },
    warranty: '6 Months Warranty'
  },
  {
    id: 'th-05',
    title: 'Awei T29 Pro RGB Gaming TWS Earbuds (Low Latency)',
    slug: 'awei-t29-pro-gaming-tws',
    price: 1190,
    originalPrice: 1650,
    category: 'Gaming & Desk',
    rating: 4.7,
    reviewsCount: 76,
    inStock: true,
    stockQuantity: 22,
    badge: 'Hot Deal',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    shortDesc: 'Designed for mobile gamers with 45ms ultra-low latency game mode, futuristic mechanical RGB breath lighting, and 3D positional audio.',
    features: [
      '45ms Ultra-low audio latency for PUBG & Free Fire',
      'Futuristic RGB breathing lights on case and buds',
      'Dual audio modes: Gaming Mode & Hi-Fi Music Mode',
      'HD noise-canceling mic for team voice chat',
      'Comfortable ergonomic in-ear grip for long sessions'
    ],
    specs: {
      'Bluetooth': 'v5.1 Gaming Chipset',
      'Latency': '45ms in Game Mode',
      'Battery Life': '6 hours playback, 300mAh case',
      'Driver': '10mm Neodymium stereo units',
      'Charging': 'Type-C fast port'
    },
    colors: [
      { name: 'Cyber Black', hex: '#0F172A' },
      { name: 'Neon White', hex: '#F1F5F9' }
    ],
    warranty: '3 Months Replacement Warranty'
  },
  {
    id: 'th-06',
    title: 'Baseus Magnetic 10000mAh 20W Wireless Power Bank',
    slug: 'baseus-magnetic-10000mah-powerbank',
    price: 2250,
    originalPrice: 2800,
    category: 'Chargers & Power',
    rating: 4.9,
    reviewsCount: 112,
    inStock: true,
    stockQuantity: 15,
    badge: 'Trending',
    image: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=800&auto=format&fit=crop&q=80',
    shortDesc: 'MagSafe compatible snap-on wireless power bank with strong neodymium magnets, LED battery percentage screen, and 20W PD wired fast charging.',
    features: [
      'Snap & charge: Strong magnetic alignment for iPhone 12/13/14/15/16',
      '15W Qi wireless charging + 20W Type-C wired fast charge',
      'Does not block phone camera lenses while attached',
      'Matte liquid silicone touch back prevents scratches',
      'Pass-through charging: charges itself and phone together'
    ],
    specs: {
      'Capacity': '10000mAh / 38.5Wh',
      'Wireless Output': '5W / 7.5W / 10W / 15W',
      'Type-C Output': '5V/3A, 9V/2.22A, 12V/1.5A (20W PD)',
      'Dimensions': '104.6 x 68.9 x 20 mm',
      'Weight': '208g'
    },
    colors: [
      { name: 'Space Black', hex: '#1E293B' },
      { name: 'Powder Blue', hex: '#93C5FD' },
      { name: 'Chalk White', hex: '#F8FAFC' }
    ],
    warranty: '6 Months Warranty'
  },
  {
    id: 'th-07',
    title: 'K9 Dual Wireless Lavalier Microphone (Type-C & Lightning)',
    slug: 'k9-dual-wireless-lavalier-microphone',
    price: 750,
    originalPrice: 1100,
    category: 'Accessories',
    rating: 4.6,
    reviewsCount: 164,
    inStock: true,
    stockQuantity: 50,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1590658006821-04f4008d5717?w=800&auto=format&fit=crop&q=80',
    shortDesc: 'Plug and play wireless collar mic for YouTube, TikTok, Facebook Live, vlogging, and interviews. No app or Bluetooth pairing needed.',
    features: [
      'Plug & Play: Just plug receiver into phone and power on mic',
      'Dual transmitters: 2 people can record at the same time',
      'Intelligent DSP active noise reduction chip',
      'Up to 20 meters barrier-free stable transmission',
      'Includes Type-C receiver + Lightning adapter for iPhone'
    ],
    specs: {
      'Frequency Range': '2.4GHz',
      'Battery Life': '5-6 hours recording time',
      'Transmission Range': '20 meters line-of-sight',
      'Microphone': '360° Omnidirectional pickup',
      'Package': '2x Mic, 1x Receiver, 1x Lightning Adapter, 1x Cable'
    },
    warranty: '1 Month Replacement Warranty'
  },
  {
    id: 'th-08',
    title: 'RGB Sound Reactive Rhythm Light Bar (32-Bit Music Lamp)',
    slug: 'rgb-sound-reactive-rhythm-light-bar',
    price: 650,
    originalPrice: 950,
    category: 'Gaming & Desk',
    rating: 4.8,
    reviewsCount: 89,
    inStock: true,
    stockQuantity: 30,
    badge: 'Trending',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    shortDesc: '32 colorful LED lamp beads, built-in highly sensitive mic that synchronizes dynamically with music, beats, and game audio on your desk or car.',
    features: [
      '32 independent RGB LED beads with vibrant colors',
      '8 display modes, 4 brightness levels, 5 speed levels',
      'Built-in AGC automatic gain control algorithm',
      'Rechargeable built-in battery or USB continuous power',
      'Stands vertically or lies horizontally with included base'
    ],
    specs: {
      'Input Voltage': 'DC 5V 1A Type-C',
      'LED Beads': '32 WS2812 SMD RGB',
      'Frequency Response': '100Hz - 16kHz',
      'Dimensions': '181 x 16 x 18.5 mm',
      'Weight': '86g'
    },
    colors: [
      { name: 'Silver Aluminum', hex: '#E2E8F0' },
      { name: 'Matte Black', hex: '#0F172A' }
    ],
    warranty: '1 Month Warranty'
  },
  {
    id: 'th-09',
    title: 'WiWU Cyberpunk Transparent 6-in-1 Fast Cable Hub Kit',
    slug: 'wiwu-cyberpunk-fast-cable-kit',
    price: 590,
    originalPrice: 850,
    category: 'Accessories',
    rating: 4.7,
    reviewsCount: 63,
    inStock: true,
    stockQuantity: 40,
    badge: 'New Arrival',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    shortDesc: 'Pocket survival travel kit with 60W Type-C cable, adapters for iPhone, Micro-USB, USB-A, SIM ejector pin, and built-in phone stand.',
    features: [
      'Converts Type-C to Lightning, Micro-USB, and Standard USB',
      'Supports up to 60W Power Delivery rapid charging',
      'Includes SIM ejector pin + nano SIM storage slots',
      'Case unfolds into a desktop mobile phone stand',
      'Transparent mechanical cyberpunk shell design'
    ],
    specs: {
      'Cable Power': '60W PD (Type-C to Type-C)',
      'Data Transfer': '480 Mbps',
      'Adapters': 'Type-C to Lightning, Type-C to Micro, Type-C to USB-A',
      'Case Size': 'Compact 82mm circular disc'
    },
    warranty: '1 Month Warranty'
  },
  {
    id: 'th-010',
    title: 'Lenovo Thinkplus LivePods LP40 Pro Wireless Earbuds',
    slug: 'lenovo-thinkplus-lp40-pro',
    price: 790,
    originalPrice: 1150,
    category: 'Audio & TWS',
    rating: 4.8,
    reviewsCount: 198,
    inStock: true,
    stockQuantity: 38,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    shortDesc: 'Upgraded semi-in-ear acoustic cavity, Bluetooth 5.1 high stability, low power consumption, and rich vocal clarity.',
    features: [
      'Upgraded Bluetooth 5.1 chip with stable connection',
      'Low latency sound & picture synchronization',
      '13mm composite diaphragm moving coil sound unit',
      'Lightweight ergonomic fit, only 3.6g per earbud',
      'Type-C rapid recharge with 250mAh charging case'
    ],
    specs: {
      'Battery Capacity': '250mAh (Case) / 30mAh (Earbuds)',
      'Charging Time': 'About 1.5 hours',
      'Music Time': 'About 5 hours',
      'Bluetooth Range': '10 meters',
      'Interface': 'Type-C'
    },
    colors: [
      { name: 'Matte Black', hex: '#18181B' },
      { name: 'Pure White', hex: '#F8FAFC' },
      { name: 'Soft Pink', hex: '#F472B6' },
      { name: 'Mint Green', hex: '#34D399' }
    ],
    warranty: '3 Months Replacement Guarantee'
  },
  {
    id: 'th-011',
    title: 'Smart Health Titanium Ring (Sleep, HRV & Fitness Tracker)',
    slug: 'smart-health-titanium-ring',
    price: 2850,
    originalPrice: 3800,
    category: 'Fashion',
    rating: 4.9,
    reviewsCount: 88,
    inStock: true,
    stockQuantity: 24,
    badge: 'Trending',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&auto=format&fit=crop&q=80'
    ],
    shortDesc: 'Ultra-lightweight aerospace titanium smart ring with continuous sleep analysis, body temperature, heart rate, and 5ATM waterproof.',
    features: [
      'High-grade titanium alloy and medical zirconia ceramic',
      'Accurate sleep stages (Deep, REM, Light) & body recovery',
      'Continuous 24/7 heart rate and blood oxygen monitoring',
      '5ATM 50-meter water resistance for swimming and shower',
      '7 days battery life on a single magnetic charge'
    ],
    specs: {
      'Material': 'Aviation Titanium & Epoxy Resin',
      'Battery': '7 Days Standby, Magnetic Quick Charger',
      'Waterproof': '5ATM (50 meters)',
      'Weight': 'Only 2.8 grams',
      'Sensors': 'Optical PPG, Skin Temperature, 3D Accelerometer',
      'Warranty': '6 Months Replacement Warranty'
    },
    colors: [
      { name: 'Space Black', hex: '#111827' },
      { name: 'Metallic Silver', hex: '#E2E8F0' },
      { name: 'Rose Gold', hex: '#FB7185' }
    ],
    warranty: '6 Months Replacement Warranty'
  },
  {
    id: 'th-012',
    title: 'Cyberpunk Mech Quick-Release Magnetic Tech Strap',
    slug: 'cyberpunk-magnetic-tech-strap',
    price: 850,
    originalPrice: 1250,
    category: 'Fashion',
    rating: 4.8,
    reviewsCount: 65,
    inStock: true,
    stockQuantity: 35,
    badge: 'Hot Deal',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
    shortDesc: 'Futuristic magnetic buckle nylon strap with reflective accents, water-resistant ballistic weave, and universal 20mm/22mm quick release.',
    features: [
      'Fidlock-style magnetic quick snap buckle',
      'Heavy-duty waterproof breathable ballistic nylon',
      'Night-reflective cyberpunk neon woven threads',
      'Compatible with Apple Watch, Samsung Galaxy, and standard smartwatches',
      'Sweat-proof and washable'
    ],
    specs: {
      'Compatibility': 'Universal 20mm, 22mm & Apple Watch (38-49mm)',
      'Buckle': 'Zinc alloy magnetic auto-lock',
      'Material': 'Ballistic high-density nylon weave',
      'Warranty': '3 Months Guarantee'
    },
    colors: [
      { name: 'Neon Orange', hex: '#EA580C' },
      { name: 'Stealth Black', hex: '#0F172A' },
      { name: 'Military Green', hex: '#15803D' }
    ],
    warranty: '3 Months Guarantee'
  },
  {
    id: 'th-013',
    title: 'Smart Health Titanium Ring (Sleep, HRV & Fitness Tracker)',
    slug: 'smart-health-titanium-ring-fashion',
    price: 3450,
    originalPrice: 4800,
    category: 'Fashion',
    rating: 4.9,
    reviewsCount: 78,
    inStock: true,
    stockQuantity: 24,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80'
    ],
    shortDesc: 'Aviation titanium alloy ultra-light fashion ring with medical-grade sleep phase analysis, 24/7 heart rate, skin temperature and 5ATM waterproof.',
    features: [
      'Aviation titanium outer shell with smooth medical resin interior',
      'Continuous 24/7 heart rate, blood oxygen and HRV monitoring',
      'Sleep stage tracking (Deep, REM, Light) with recovery score',
      'Up to 7 days continuous battery life on single magnetic charge',
      '5ATM 50m waterproof for swimming and showers'
    ],
    specs: {
      'Material': 'Titanium Alloy & Hypoallergenic Resin',
      'Weight': 'Only 2.8 grams',
      'Waterproof': '5ATM (50 meters)',
      'Battery': '7 Days Standby, Quick Magnetic Charger',
      'Warranty': '6 Months Replacement Warranty'
    },
    colors: [
      { name: 'Obsidian Black', hex: '#0F172A' },
      { name: 'Sterling Silver', hex: '#E2E8F0' },
      { name: 'Champagne Gold', hex: '#EAB308' }
    ],
    warranty: '6 Months Replacement Warranty'
  },
  {
    id: 'th-014',
    title: 'Ultrapods Audio Smart Sunglasses (Polarized UV400, Bluetooth 5.3)',
    slug: 'ultrapods-audio-smart-sunglasses-fashion',
    price: 2150,
    originalPrice: 2950,
    category: 'Fashion',
    rating: 4.8,
    reviewsCount: 52,
    inStock: true,
    stockQuantity: 18,
    badge: 'Trending',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80'
    ],
    shortDesc: 'Ultra-stylish polarized UV400 sunglasses with open-ear directional stereo speakers, dual noise-reducing call mics, and touch controls.',
    features: [
      'TAC Polarized UV400 anti-glare scratch-resistant lenses',
      'Open-ear directional acoustic audio so you stay ambiently aware',
      'Dual ENC microphones for crisp phone calls while walking or driving',
      'IPX5 sweat and rain resistant lightweight TR90 frame',
      '6 hours continuous music playback'
    ],
    specs: {
      'Lenses': 'Polarized TAC UV400 Protection',
      'Bluetooth': '5.3 Ultra-Low Latency',
      'Playtime': '6 Hours (160 Hours Standby)',
      'Frame': 'Ultra-light TR90 memory material',
      'Warranty': '3 Months Replacement Guarantee'
    },
    colors: [
      { name: 'Matte Black', hex: '#0F172A' },
      { name: 'Tortoise Brown', hex: '#78350F' }
    ],
    warranty: '3 Months Replacement Guarantee'
  }
];

