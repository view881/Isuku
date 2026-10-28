import { Product, Category, Coupon, WebsiteContent, Lead, Order } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-dishwashing',
    slug: 'dishwashing',
    name: 'Dishwashing Liquid',
    description: 'High-foaming grease-cutting formulas for sparkling plates, glassware, and commercial cookware.',
    iconName: 'Utensils'
  },
  {
    id: 'cat-handwashing',
    slug: 'handwashing',
    name: 'Handwashing Liquid Soap',
    description: 'Gentle antibacterial formulations with skin moisturizers for homes, schools, and healthcare.',
    iconName: 'Hand'
  },
  {
    id: 'cat-laundry',
    slug: 'laundry',
    name: 'Laundry Liquid Detergent',
    description: 'High-efficiency liquid detergents for bright whites, deep stain removal, and machine or hand wash.',
    iconName: 'Shirt'
  },
  {
    id: 'cat-multipurpose',
    slug: 'multipurpose',
    name: 'Multipurpose Cleaner',
    description: 'All-surface degreasers and cleaners for floors, tiles, countertops, and appliances.',
    iconName: 'Sparkles'
  },
  {
    id: 'cat-commercial',
    slug: 'commercial',
    name: 'Commercial & Institutional Cleaners',
    description: 'Concentrated industrial 20L jerrycans engineered for hotels, restaurants, schools, and hospitals.',
    iconName: 'Building2'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-dishwashing-sparkle',
    slug: 'isuku-lime-dishwashing-liquid',
    name: 'Isuku Lime Grease-Cutting Dishwashing Liquid',
    category: 'dishwashing',
    shortDescription: 'Ultra-concentrated grease-cutting formula with zesty citrus freshness. Cuts through tough oils with minimal foam residue.',
    fullDescription: 'Isuku Lime Dishwashing Liquid is manufactured in Kigali to give commercial kitchens and households superior degreasing power. Formulated with biodegradable surfactants, it effortlessly dissolves baked-on food, grease, and sauce residues while remaining gentle on hands.',
    usageInstructions: 'Dilute 1 teaspoon (5ml) in 5 liters of warm water for standard dishes. For stubborn burnt pots, apply a few concentrated drops directly, wait 3 minutes, and sponge clean.',
    ingredients: ['Purified Water', 'Sodium Laureth Sulfate (Plant-derived surfactant)', 'Cocamidopropyl Betaine', 'Natural Lime Extract & Fragrance', 'Sodium Chloride', 'Food-Grade Colorant'],
    safetyInstructions: 'For external washing use only. Keep out of reach of children. In case of direct eye contact, rinse thoroughly with fresh running water.',
    features: [
      'Cuts heavy animal fats and vegetable cooking oils effortlessly',
      'Gentle on skin with pH-balanced formula',
      'High-foaming long-lasting suds',
      'Readily biodegradable formula'
    ],
    images: [
      '/src/assets/images/product_dishwashing_liquid_1793189045056.jpg',
      '/src/assets/images/hero_liquid_soap_lineup_1793189044482.jpg'
    ],
    variants: [
      { size: '500 ml', sku: 'ISU-DISH-500', priceRwf: 1200, wholesalePriceRwf: 950, wholesaleMinQty: 24, stockQuantity: 340, inStock: true },
      { size: '1 L', sku: 'ISU-DISH-1L', priceRwf: 2200, wholesalePriceRwf: 1750, wholesaleMinQty: 12, stockQuantity: 210, inStock: true },
      { size: '5 L', sku: 'ISU-DISH-5L', priceRwf: 9500, wholesalePriceRwf: 7800, wholesaleMinQty: 4, stockQuantity: 85, inStock: true },
      { size: '20 L', sku: 'ISU-DISH-20L', priceRwf: 34000, wholesalePriceRwf: 28500, wholesaleMinQty: 2, stockQuantity: 42, inStock: true }
    ],
    featured: true,
    active: true,
    createdAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'prod-handwashing-aloe',
    slug: 'isuku-antibacterial-handwashing-liquid',
    name: 'Isuku Aloe & Eucalyptus Antibacterial Hand Soap',
    category: 'handwashing',
    shortDescription: 'Gentle foaming hand hygiene soap with natural aloe moisturizers and crisp eucalyptus freshness.',
    fullDescription: 'Manufactured for high-traffic washrooms, clinics, schools, and modern households. Isuku Antibacterial Hand Soap eliminates 99.9% of everyday bacteria without stripping natural skin moisture, leaving hands soft and refreshed.',
    usageInstructions: 'Wet hands thoroughly with clean water, dispense 1-2 pumps onto palms, rub vigorously for 20 seconds covering wrists and finger webs, then rinse cleanly.',
    ingredients: ['Water', 'Sodium Lauryl Ether Sulfate', 'Glycerin', 'Aloe Vera Leaf Extract', 'Eucalyptus Globulus Leaf Oil', 'Chloroxylenol (Antibacterial Agent)', 'Citric Acid'],
    safetyInstructions: 'Avoid contact with eyes. If irritation or redness develops, discontinue use.',
    features: [
      'Enriched with botanical aloe vera for skin hydration',
      'Subtle, fresh natural eucalyptus scent',
      'Suitable for frequent daily handwashing in food service & healthcare',
      'Compatible with all wall-mounted soap dispensers'
    ],
    images: [
      '/src/assets/images/product_handwashing_soap_1793189046243.jpg',
      '/src/assets/images/hero_liquid_soap_lineup_1793189044482.jpg'
    ],
    variants: [
      { size: '500 ml', sku: 'ISU-HAND-500', priceRwf: 1500, wholesalePriceRwf: 1150, wholesaleMinQty: 24, stockQuantity: 420, inStock: true },
      { size: '1 L', sku: 'ISU-HAND-1L', priceRwf: 2700, wholesalePriceRwf: 2100, wholesaleMinQty: 12, stockQuantity: 180, inStock: true },
      { size: '5 L', sku: 'ISU-HAND-5L', priceRwf: 11000, wholesalePriceRwf: 8900, wholesaleMinQty: 4, stockQuantity: 95, inStock: true },
      { size: '20 L', sku: 'ISU-HAND-20L', priceRwf: 38000, wholesalePriceRwf: 31000, wholesaleMinQty: 2, stockQuantity: 30, inStock: true }
    ],
    featured: true,
    active: true,
    createdAt: '2026-01-20T09:30:00Z'
  },
  {
    id: 'prod-laundry-fresh',
    slug: 'isuku-fresh-brew-laundry-liquid',
    name: 'Isuku High-Efficiency Liquid Laundry Detergent',
    category: 'laundry',
    shortDescription: 'Advanced enzyme stain-lift technology for bright whites and vibrant colors. Dissolves instantly in cold or warm water.',
    fullDescription: 'Designed specifically for both front-load and top-load washing machines as well as manual hand-washing. Isuku Liquid Laundry Detergent penetrates fabric fibers quickly to lift clay, red soil, sweat, and food stains without damaging garments or leaving powdery residue.',
    usageInstructions: 'Machine wash: Use 50ml cap for medium load (4-5kg) or 80ml for heavy soiled bedding. Hand wash: Dissolve 40ml in 10L bucket before submerging clothes.',
    ingredients: ['Water', 'Non-ionic Surfactants', 'Enzyme Blend (Protease, Amylase)', 'Optical Brightener', 'Fresh Cotton Fragrance', 'Color Protector'],
    safetyInstructions: 'Keep away from children. Store container upright in a cool, dry place. In case of ingestion, drink plenty of water and seek medical advice.',
    features: [
      'Cold-water active formula saves heating energy',
      'Leaves zero white chalky powder marks on dark clothes',
      'Color-safe and fabric-softening agents built-in',
      'Ideal for hotel linens, school uniforms, and family laundry'
    ],
    images: [
      '/src/assets/images/product_laundry_detergent_1793189046779.jpg',
      '/src/assets/images/hero_liquid_soap_lineup_1793189044482.jpg'
    ],
    variants: [
      { size: '1 L', sku: 'ISU-LAUN-1L', priceRwf: 3200, wholesalePriceRwf: 2500, wholesaleMinQty: 12, stockQuantity: 150, inStock: true },
      { size: '5 L', sku: 'ISU-LAUN-5L', priceRwf: 13500, wholesalePriceRwf: 11000, wholesaleMinQty: 4, stockQuantity: 64, inStock: true },
      { size: '20 L', sku: 'ISU-LAUN-20L', priceRwf: 48000, wholesalePriceRwf: 39500, wholesaleMinQty: 2, stockQuantity: 18, inStock: true }
    ],
    featured: true,
    active: true,
    createdAt: '2026-02-01T11:00:00Z'
  },
  {
    id: 'prod-commercial-multipurpose',
    slug: 'isuku-green-gleam-multipurpose-cleaner',
    name: 'Isuku Green Gleam Concentrated Multipurpose Cleaner',
    category: 'commercial',
    shortDescription: 'Heavy-duty industrial surface cleaner and degreaser for ceramic tiles, granite, terrazzo, and kitchen floors.',
    fullDescription: 'Engineered for commercial housekeeping, facility management, restaurants, and schools. Green Gleam cleans deeply without etching tile glaze or leaving slippery residue. Cuts through floor scuffs, grease spills, and dirt trails.',
    usageInstructions: 'Routine floor mopping: Dilute 1:100 (100ml per 10L bucket). Heavy kitchen degreasing: Dilute 1:20 (500ml per 10L water). Mop or scrub surface, then allow to air dry.',
    ingredients: ['Water', 'Sodium Metasilicate', 'Biodegradable Surfactants', 'Pine and Citrus Terpenes', 'Chelating Agents'],
    safetyInstructions: 'Wear rubber gloves during prolonged concentrated use. Ensure good ventilation in enclosed rooms.',
    features: [
      'Heavy-duty 20L commercial jerrycan with reinforced stacking handle',
      'Quick-drying anti-streak formula prevents slip hazards',
      'Economical dilution ratio: 1 jerrycan makes up to 2,000L of cleaning solution',
      'Preferred by leading Kigali hotels, convention centers, and hospitals'
    ],
    images: [
      '/src/assets/images/product_commercial_jerrycan_1793189048046.jpg',
      '/src/assets/images/hero_liquid_soap_lineup_1793189044482.jpg'
    ],
    variants: [
      { size: '5 L', sku: 'ISU-GLEAM-5L', priceRwf: 10500, wholesalePriceRwf: 8500, wholesaleMinQty: 4, stockQuantity: 75, inStock: true },
      { size: '20 L', sku: 'ISU-GLEAM-20L', priceRwf: 36000, wholesalePriceRwf: 29500, wholesaleMinQty: 2, stockQuantity: 52, inStock: true }
    ],
    featured: true,
    active: true,
    createdAt: '2026-02-10T14:20:00Z'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  { code: 'ISUKU10', discountPercent: 10, minOrderRwf: 10000, description: '10% discount on orders over 10,000 RWF', active: true },
  { code: 'BULKFRESH', discountPercent: 15, minOrderRwf: 50000, description: '15% discount for bulk hospitality & institutions over 50,000 RWF', active: true },
  { code: 'KIGALIWELCOME', discountPercent: 5, minOrderRwf: 5000, description: '5% welcome discount on first order', active: true }
];

export const INITIAL_CONTENT: WebsiteContent = {
  announcementText: '🌟 Free delivery in Kigali on all orders over 30,000 RWF! Wholesale bulk pricing available.',
  announcementActive: true,
  freeDeliveryThresholdRwf: 30000,
  heroHeadline: 'Powerful Cleaning. Lasting Freshness. Exceptional Value.',
  heroSubheadline: 'Discover premium Rwandan-manufactured liquid soap solutions for homes, commercial kitchens, hotels, schools, hospitals, and cleaning professionals.',
  companyName: 'Isuku Pure Cleaners Ltd',
  companyAddress: 'Kigali Special Economic Zone (KSEZ), Masoro, Gasabo District, Kigali, Rwanda',
  phone: '+250 788 123 456',
  whatsapp: '+250 788 123 456',
  email: 'sales@isukupure.rw',
  businessHours: 'Monday - Saturday: 8:00 AM - 6:00 PM CAT'
};

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Jean-Paul Mugisha',
    organization: 'Hôtel des Mille Collines Restaurant',
    phone: '+250 788 554 112',
    email: 'purchasing@hotelmillecollines.rw',
    customerType: 'hotel',
    estimatedVolume: '120 Liters / Month',
    interestProduct: 'Isuku Lime Dishwashing & Green Gleam Cleaner',
    source: 'ai_chatbot',
    status: 'qualified',
    assignedTo: 'Aline Uwase (Sales Manager)',
    followUpDate: '2026-11-02',
    notes: [
      'Contacted via AI chatbot requesting restaurant degreasing quote for 6x 20L jerrycans monthly.',
      'Sent wholesale rate card with 15% recurring supply discount.'
    ],
    createdAt: '2026-10-26T14:30:00Z'
  },
  {
    id: 'lead-2',
    name: 'Clarisse Mukamana',
    organization: 'Green Hills Academy Facilities',
    phone: '+250 783 992 014',
    email: 'admin@greenhills.edu.rw',
    customerType: 'school',
    estimatedVolume: '200 Liters / Term',
    interestProduct: 'Isuku Aloe Hand Soap 20L',
    source: 'wholesale_form',
    status: 'new',
    assignedTo: 'Eric Nshuti (Sales Agent)',
    followUpDate: '2026-10-29',
    notes: [
      'Inquired about 10x 20L jerrycans for 4 campus washroom blocks before new school term begins.'
    ],
    createdAt: '2026-10-27T09:15:00Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1041',
    orderNumber: 'ISP-2026-1041',
    customer: {
      fullName: 'Patrick Bizimana',
      phone: '+250 788 776 230',
      email: 'p.bizimana@gmail.com',
      customerType: 'household',
      district: 'Gasabo, Kimironko',
      deliveryAddress: 'Near Kimironko Market, KG 11 Ave No. 24'
    },
    items: [
      {
        productId: 'prod-dishwashing-sparkle',
        name: 'Isuku Lime Dishwashing Liquid',
        size: '1 L',
        sku: 'ISU-DISH-1L',
        unitPriceRwf: 2200,
        quantity: 2,
        subtotalRwf: 4400
      },
      {
        productId: 'prod-handwashing-aloe',
        name: 'Isuku Aloe & Eucalyptus Hand Soap',
        size: '500 ml',
        sku: 'ISU-HAND-500',
        unitPriceRwf: 1500,
        quantity: 2,
        subtotalRwf: 3000
      }
    ],
    subtotalRwf: 7400,
    discountRwf: 0,
    deliveryFeeRwf: 2000,
    taxRwf: 1128,
    totalRwf: 9400,
    paymentMethod: 'momo_mtn',
    paymentStatus: 'paid',
    fulfillmentStatus: 'delivered',
    customerNotes: 'Please call when arriving at the gate.',
    internalNotes: 'Delivered on time via Kigali dispatch rider.',
    createdAt: '2026-10-25T10:15:00Z',
    updatedAt: '2026-10-25T14:00:00Z',
    timeline: [
      { status: 'pending_confirmation', note: 'Order submitted by customer', timestamp: '2026-10-25T10:15:00Z' },
      { status: 'confirmed', note: 'MTN Mobile Money payment confirmed', timestamp: '2026-10-25T10:20:00Z' },
      { status: 'out_for_delivery', note: 'Dispatched with rider David', timestamp: '2026-10-25T13:00:00Z' },
      { status: 'delivered', note: 'Delivered to Patrick Bizimana', timestamp: '2026-10-25T14:00:00Z' }
    ]
  },
  {
    id: 'ord-1042',
    orderNumber: 'ISP-2026-1042',
    customer: {
      fullName: 'Sonia Umutoni',
      organizationName: 'Serene Kigali Guest House',
      phone: '+250 782 441 890',
      email: 'info@serenekigali.rw',
      customerType: 'hotel',
      district: 'Kicukiro, Niboye',
      deliveryAddress: 'KK 31 Ave, Plot 18, Niboye'
    },
    items: [
      {
        productId: 'prod-commercial-multipurpose',
        name: 'Isuku Green Gleam Concentrated Multipurpose Cleaner',
        size: '20 L',
        sku: 'ISU-GLEAM-20L',
        unitPriceRwf: 29500,
        quantity: 2,
        subtotalRwf: 59000
      },
      {
        productId: 'prod-handwashing-aloe',
        name: 'Isuku Aloe & Eucalyptus Hand Soap',
        size: '5 L',
        sku: 'ISU-HAND-5L',
        unitPriceRwf: 8900,
        quantity: 2,
        subtotalRwf: 17800
      }
    ],
    subtotalRwf: 76800,
    discountRwf: 7680,
    discountCodeApplied: 'BULKFRESH',
    deliveryFeeRwf: 0,
    taxRwf: 10543,
    totalRwf: 69120,
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'pending',
    fulfillmentStatus: 'processing',
    customerNotes: 'Deliver during morning housekeeping hours (8am - 11am).',
    internalNotes: 'Wholesale order with complimentary delivery applied.',
    createdAt: '2026-10-27T16:45:00Z',
    updatedAt: '2026-10-28T08:00:00Z',
    timeline: [
      { status: 'pending_confirmation', note: 'Order submitted with Cash on Delivery', timestamp: '2026-10-27T16:45:00Z' },
      { status: 'confirmed', note: 'Order verified by Sales Manager Aline', timestamp: '2026-10-28T07:45:00Z' },
      { status: 'processing', note: 'Jerrycans packaged at Masoro facility', timestamp: '2026-10-28T08:00:00Z' }
    ]
  }
];
