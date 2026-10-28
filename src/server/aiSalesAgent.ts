import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { db } from './db';
import { ChatMessage, CustomerType } from '../types';

let genAI: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// Function Declarations for Gemini Tool Calling
const lookupProductsDecl: FunctionDeclaration = {
  name: 'lookupProducts',
  description: 'Search and inspect liquid soap products currently available in the factory database.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      category: {
        type: Type.STRING,
        description: 'Optional category filter: "dishwashing", "handwashing", "laundry", "commercial", or "all"'
      },
      searchQuery: {
        type: Type.STRING,
        description: 'Search keywords like "grease", "restaurant", "hospital", "aloe", "jerrycan", "cold water"'
      }
    }
  }
};

const calculateQuoteDecl: FunctionDeclaration = {
  name: 'calculateOrderQuote',
  description: 'Calculate live pricing, wholesale volume discounts, delivery fees, and total in Rwandan Francs (RWF).',
  parameters: {
    type: Type.OBJECT,
    properties: {
      items: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            productId: { type: Type.STRING, description: 'Product ID or slug' },
            size: { type: Type.STRING, description: 'Packaging size e.g. "500 ml", "1 L", "5 L", "20 L"' },
            quantity: { type: Type.NUMBER, description: 'Number of units' }
          },
          required: ['productId', 'size', 'quantity']
        },
        description: 'List of items to calculate pricing for'
      },
      couponCode: {
        type: Type.STRING,
        description: 'Optional discount coupon code'
      },
      district: {
        type: Type.STRING,
        description: 'Delivery district e.g. Gasabo, Kicukiro, Nyarugenge, or Upcountry'
      }
    },
    required: ['items']
  }
};

const captureLeadDecl: FunctionDeclaration = {
  name: 'captureSalesLead',
  description: 'Save customer contact details and wholesale requirements as a qualified sales lead.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: 'Customer or contact full name' },
      phone: { type: Type.STRING, description: 'Phone number (e.g. +250 78...)' },
      organization: { type: Type.STRING, description: 'Business, restaurant, hotel, school, or clinic name' },
      customerType: {
        type: Type.STRING,
        description: 'Customer type: household, retailer, hotel, school, hospital, restaurant, cleaning_company, or wholesaler'
      },
      estimatedVolume: { type: Type.STRING, description: 'e.g. 5x 20L per month or 50 liters' },
      interestProduct: { type: Type.STRING, description: 'Product of interest' }
    },
    required: ['name', 'phone']
  }
};

const escalateToHumanDecl: FunctionDeclaration = {
  name: 'escalateToHumanSales',
  description: 'Escalate to a human sales representative and generate a WhatsApp contact link.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      reason: { type: Type.STRING, description: 'Reason for escalation or specific custom quote request' }
    },
    required: ['reason']
  }
};

// Execute tool logic server-side
function executeTool(name: string, args: any) {
  if (name === 'lookupProducts') {
    const products = db.getProducts();
    const query = (args.searchQuery || '').toLowerCase();
    const category = (args.category || '').toLowerCase();

    const filtered = products.filter(p => {
      const matchCat = !category || category === 'all' || p.category.toLowerCase().includes(category);
      const matchQuery = !query || 
        p.name.toLowerCase().includes(query) || 
        p.shortDescription.toLowerCase().includes(query) ||
        p.features.some(f => f.toLowerCase().includes(query));
      return matchCat && matchQuery;
    });

    return {
      count: filtered.length,
      products: filtered.map(p => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        category: p.category,
        shortDescription: p.shortDescription,
        variants: p.variants.map(v => ({
          size: v.size,
          priceRwf: v.priceRwf,
          wholesalePriceRwf: v.wholesalePriceRwf,
          wholesaleMinQty: v.wholesaleMinQty,
          inStock: v.inStock,
          stockQuantity: v.stockQuantity
        }))
      }))
    };
  }

  if (name === 'calculateOrderQuote') {
    const rawItems = (args.items || []).map((it: any) => {
      // Find product by id or slug
      const found = db.getProducts().find(p => p.id === it.productId || p.slug === it.productId);
      return {
        productId: found ? found.id : it.productId,
        size: it.size,
        quantity: Number(it.quantity) || 1
      };
    });

    const quote = db.calculateQuote(rawItems, args.couponCode, args.district);
    return {
      subtotalRwf: quote.subtotalRwf,
      discountRwf: quote.discountRwf,
      deliveryFeeRwf: quote.deliveryFeeRwf,
      totalRwf: quote.totalRwf,
      wholesaleSavingsRwf: quote.wholesaleSavingsRwf,
      stockErrors: quote.stockErrors,
      items: quote.items.map(i => ({
        name: i.name,
        size: i.size,
        qty: i.quantity,
        unitPrice: i.unitPriceRwf,
        subtotal: i.subtotalRwf
      }))
    };
  }

  if (name === 'captureSalesLead') {
    const lead = db.createLead({
      name: args.name,
      phone: args.phone,
      organization: args.organization,
      customerType: (args.customerType as CustomerType) || 'household',
      estimatedVolume: args.estimatedVolume,
      interestProduct: args.interestProduct,
      source: 'ai_chatbot',
      status: 'new',
      notes: [`Captured via AI sales conversation. Inquired about: ${args.interestProduct || 'general supply'}`]
    });
    return { success: true, leadId: lead.id, message: `Lead for ${lead.name} saved successfully.` };
  }

  if (name === 'escalateToHumanSales') {
    const content = db.getContent();
    const cleanPhone = content.whatsapp.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hello Isuku Pure Sales Team, I was chatting with your AI assistant regarding: ${args.reason || 'custom quote'}`);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${text}`;
    return {
      escalated: true,
      whatsappNumber: content.whatsapp,
      whatsappUrl,
      supportEmail: content.email
    };
  }

  return { error: `Tool ${name} not implemented.` };
}

export async function processAIChat(
  visitorId: string,
  userMessage: string,
  language: 'en' | 'rw' | 'fr' = 'en'
): Promise<ChatMessage> {
  const conv = db.getConversation(visitorId);

  // Add user message to conversation history
  const userMsg: ChatMessage = {
    id: `msg-${Date.now()}-u`,
    role: 'user',
    content: userMessage,
    timestamp: new Date().toISOString()
  };
  conv.messages.push(userMsg);

  // System instructions grounded in realistic Rwandan manufacturing context
  const systemPrompt = `You are the official AI Sales Agent for "Isuku Pure Cleaners Ltd", a top liquid soap manufacturer based in the Kigali Special Economic Zone (KSEZ), Masoro, Rwanda.
Your mission is to welcome visitors, understand what they need to clean, recommend the ideal liquid soap, calculate exact quotes in Rwandan Francs (RWF), explain wholesale discounts, and guide them to order.

CORE RULES:
1. CURRENCY: Always state prices and quotes in Rwandan Francs (RWF). Example: "2,200 RWF", "28,500 RWF".
2. PACKAGING: We offer 500 ml, 1 L, 5 L, and 20 L heavy-duty jerrycans.
3. CUSTOMERS: We serve households, restaurants, hotels, schools, hospitals, commercial cleaning companies, and wholesale distributors.
4. ACCURACY: Never invent product specifications, false certifications, or non-existent discounts. Always use your lookupProducts and calculateOrderQuote tools.
5. BULK DISCOUNTS: For commercial clients (restaurants, hotels, schools), 20L jerrycans have wholesale discount pricing starting at 2+ units.
6. DELIVERIES: Free delivery in Kigali (Gasabo, Kicukiro, Nyarugenge) on orders of 30,000 RWF or more. Standard Kigali delivery is 2,000 RWF. Upcountry delivery is 5,000 RWF.
7. LEAD CAPTURE: When a customer expresses interest in bulk supply or regular weekly/monthly deliveries, ask for their name and phone number with consent, then use captureSalesLead tool.
8. LANGUAGE: Respond in the language used by the user: English, Kinyarwanda, or French.
   - English: Polite, professional, helpful sales tone.
   - Kinyarwanda: Murakaza neza! Twishimiye kubafasha kubona isabune y'amazi meza cyane...
   - French: Bienvenue chez Isuku Pure...`;

  // Fallback intelligent agent if Gemini API key is not configured or in case of rate limits
  if (!genAI) {
    return generateSmartFallbackResponse(conv, userMessage, language);
  }

  try {
    const formattedHistory = conv.messages.slice(-8).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await genAI.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: systemPrompt,
        tools: [{
          functionDeclarations: [lookupProductsDecl, calculateQuoteDecl, captureLeadDecl, escalateToHumanDecl]
        }]
      }
    });

    let assistantText = response.text || '';
    let recommendedProducts: any[] = [];
    let quoteDetails: any = undefined;
    let isEscalated = false;

    // Check if Gemini invoked tool calls
    if (response.functionCalls && response.functionCalls.length > 0) {
      for (const fc of response.functionCalls) {
        const toolResult: any = executeTool(fc.name || '', fc.args);
        
        if (fc.name === 'lookupProducts' && toolResult.products) {
          const prods = db.getProducts().filter(p => toolResult.products.some((tp: any) => tp.id === p.id));
          recommendedProducts = prods.slice(0, 3).map(p => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            size: p.variants[0]?.size || '1 L',
            priceRwf: p.variants[0]?.priceRwf || 2200,
            image: p.images[0]
          }));
        }

        if (fc.name === 'calculateOrderQuote') {
          quoteDetails = {
            items: toolResult.items || [],
            subtotal: toolResult.subtotalRwf || 0,
            savings: (toolResult.wholesaleSavingsRwf || 0) + (toolResult.discountRwf || 0),
            finalTotal: toolResult.totalRwf || 0
          };
        }

        if (fc.name === 'captureSalesLead') {
          conv.leadCaptured = true;
        }

        if (fc.name === 'escalateToHumanSales') {
          isEscalated = true;
        }

        // If the model didn't return text alongside tool call, provide a contextual response
        if (!assistantText) {
          if (fc.name === 'lookupProducts') {
            assistantText = `Here are our top liquid soap recommendations from our Kigali factory. Each product is formulated for maximum efficiency and biodegradable safety:`;
          } else if (fc.name === 'calculateOrderQuote') {
            const tot = toolResult.totalRwf ? Number(toolResult.totalRwf).toLocaleString() : '0';
            assistantText = `Here is your customized quotation: Total comes to ${tot} RWF (including applicable bulk discounts and delivery).`;
          } else if (fc.name === 'captureSalesLead') {
            assistantText = `Thank you! I have saved your details for our commercial sales team. A sales representative will contact you shortly to arrange your delivery.`;
          } else if (fc.name === 'escalateToHumanSales') {
            assistantText = `I have connected you with our human sales team. You can chat with us directly on WhatsApp or call our office at +250 788 123 456.`;
          }
        }
      }
    }

    if (!assistantText) {
      assistantText = `I am here to help you select the ideal liquid soap products for your needs. What specific cleaning task can I assist you with today?`;
    }

    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now()}-a`,
      role: 'assistant',
      content: assistantText,
      timestamp: new Date().toISOString(),
      recommendedProducts: recommendedProducts.length > 0 ? recommendedProducts : undefined,
      quoteDetails,
      isEscalated
    };

    conv.messages.push(assistantMsg);
    db.saveConversation(conv);
    return assistantMsg;
  } catch (err) {
    console.warn('Gemini API call failed or timed out, executing local sales assistant fallback:', err);
    return generateSmartFallbackResponse(conv, userMessage, language);
  }
}

// Intelligent fallback logic when Gemini is offline or without API key
function generateSmartFallbackResponse(conv: any, userMessage: string, language: string): ChatMessage {
  const msgLower = userMessage.toLowerCase();
  const allProducts = db.getProducts();
  let content = '';
  let recommendedProducts: any[] = [];
  let quoteDetails: any = undefined;
  let isEscalated = false;

  if (msgLower.includes('dish') || msgLower.includes('plate') || msgLower.includes('grease') || msgLower.includes('sauce') || msgLower.includes('amasahani')) {
    const dish = allProducts.find(p => p.category === 'dishwashing');
    if (dish) {
      recommendedProducts = [{
        id: dish.id,
        name: dish.name,
        slug: dish.slug,
        size: '1 L',
        priceRwf: 2200,
        image: dish.images[0]
      }];
    }
    content = language === 'rw' 
      ? `Isuku Lime Dishwashing Liquid niyo yabugenewe! Ikura amavuta ku masahani mu buryo bwihuse kandi ntangire intoki. Ifite ingano zitandukanye: 500ml (1,200 RWF), 1L (2,200 RWF), 5L (9,500 RWF), na 20L (34,000 RWF).`
      : `For sparkling dishes and heavy cooking oils, I highly recommend our Isuku Lime Grease-Cutting Dishwashing Liquid. Available in 500ml (1,200 RWF), 1L (2,200 RWF), 5L (9,500 RWF), and 20L commercial jerrycan (34,000 RWF).`;
  } else if (msgLower.includes('hand') || msgLower.includes('washroom') || msgLower.includes('intoki') || msgLower.includes('mains')) {
    const hand = allProducts.find(p => p.category === 'handwashing');
    if (hand) {
      recommendedProducts = [{
        id: hand.id,
        name: hand.name,
        slug: hand.slug,
        size: '500 ml',
        priceRwf: 1500,
        image: hand.images[0]
      }];
    }
    content = language === 'rw'
      ? `Isuku Aloe & Eucalyptus Antibacterial Hand Soap irinda mikorobe 99.9% kandi igatuma intoki zohehereye. Ibika neza muri za washrooms z'amashuri, amahoteli, n'ingo.`
      : `Our Isuku Aloe & Eucalyptus Antibacterial Hand Soap provides 99.9% protection against bacteria while moisturizing skin with natural aloe vera. Ideal for homes, offices, schools, and medical facilities.`;
  } else if (msgLower.includes('laundry') || msgLower.includes('clothes') || msgLower.includes('detergent') || msgLower.includes('imyenda')) {
    const laun = allProducts.find(p => p.category === 'laundry');
    if (laun) {
      recommendedProducts = [{
        id: laun.id,
        name: laun.name,
        slug: laun.slug,
        size: '5 L',
        priceRwf: 13500,
        image: laun.images[0]
      }];
    }
    content = `For vibrant clothes and tough red soil stains, Isuku Liquid Laundry Detergent works in both machine and hand wash without leaving white powder residue. 1L is 3,200 RWF and 5L is 13,500 RWF.`;
  } else if (msgLower.includes('restaurant') || msgLower.includes('hotel') || msgLower.includes('commercial') || msgLower.includes('20') || msgLower.includes('bulk') || msgLower.includes('wholesale')) {
    const comm = allProducts.find(p => p.category === 'commercial');
    const dish = allProducts.find(p => p.category === 'dishwashing');
    recommendedProducts = [comm, dish].filter(Boolean).map(p => ({
      id: p!.id,
      name: p!.name,
      slug: p!.slug,
      size: '20 L',
      priceRwf: p!.variants.find(v => v.size === '20 L')?.wholesalePriceRwf || 29500,
      image: p!.images[0]
    }));

    quoteDetails = {
      items: [
        { name: 'Isuku Green Gleam Multipurpose Cleaner 20L', size: '20 L', qty: 2, unitPrice: 29500, total: 59000 },
        { name: 'Isuku Lime Dishwashing Liquid 20L', size: '20 L', qty: 1, unitPrice: 28500, total: 28500 }
      ],
      subtotal: 96000,
      savings: 8500,
      finalTotal: 87500
    };

    content = `We offer specialized wholesale pricing for hotels, restaurants, schools, and cleaning contractors! For example, ordering two 20L jerrycans drops unit pricing from 36,000 RWF to 29,500 RWF with complimentary Kigali delivery. What monthly volume does your facility require?`;
  } else if (msgLower.includes('deliver') || msgLower.includes('kigali') || msgLower.includes('cost') || msgLower.includes('aho mukorera')) {
    content = `We are based in the Kigali Special Economic Zone (KSEZ), Masoro. We deliver across all Kigali districts (Gasabo, Kicukiro, Nyarugenge) with free delivery on orders of 30,000 RWF or more (standard fee 2,000 RWF for smaller orders). Upcountry delivery is also available!`;
  } else if (msgLower.includes('human') || msgLower.includes('whatsapp') || msgLower.includes('call') || msgLower.includes('agent')) {
    isEscalated = true;
    content = `You can reach our human sales team directly via WhatsApp at +250 788 123 456 or email sales@isukupure.rw. We are active Monday through Saturday 8:00 AM - 6:00 PM CAT.`;
  } else {
    recommendedProducts = allProducts.slice(0, 3).map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      size: p.variants[0]?.size || '1 L',
      priceRwf: p.variants[0]?.priceRwf || 2200,
      image: p.images[0]
    }));
    content = `Welcome! We manufacture premium liquid soap products right here in Rwanda: Dishwashing Liquid, Antibacterial Hand Soap, Laundry Detergent, and Heavy-Duty Commercial Cleaners. Would you like a household recommendation or wholesale bulk pricing for your business?`;
  }

  const assistantMsg: ChatMessage = {
    id: `msg-${Date.now()}-a`,
    role: 'assistant',
    content,
    timestamp: new Date().toISOString(),
    recommendedProducts: recommendedProducts.length > 0 ? recommendedProducts : undefined,
    quoteDetails,
    isEscalated
  };

  conv.messages.push(assistantMsg);
  db.saveConversation(conv);
  return assistantMsg;
}
