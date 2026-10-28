import { 
  Product, 
  Category, 
  Order, 
  Lead, 
  Coupon, 
  WebsiteContent, 
  AuditLog, 
  Conversation,
  OrderItem,
  FulfillmentStatus,
  UserRole
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_COUPONS, 
  INITIAL_CONTENT, 
  INITIAL_LEADS, 
  INITIAL_ORDERS 
} from '../data/seedData';

class Store {
  private products: Product[] = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
  private categories: Category[] = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
  private coupons: Coupon[] = JSON.parse(JSON.stringify(INITIAL_COUPONS));
  private content: WebsiteContent = JSON.parse(JSON.stringify(INITIAL_CONTENT));
  private leads: Lead[] = JSON.parse(JSON.stringify(INITIAL_LEADS));
  private orders: Order[] = JSON.parse(JSON.stringify(INITIAL_ORDERS));
  private conversations: Map<string, Conversation> = new Map();
  private auditLogs: AuditLog[] = [
    {
      id: 'log-1',
      userName: 'System Administrator',
      userRole: 'owner',
      action: 'SYSTEM_INITIALIZATION',
      details: 'Isuku Pure platform loaded with factory inventory catalogs and pricing.',
      timestamp: '2026-10-25T00:00:00Z'
    }
  ];

  // ================= PRODUCTS =================
  public getProducts(includeInactive = false): Product[] {
    if (includeInactive) return this.products;
    return this.products.filter(p => p.active);
  }

  public getProductBySlug(slug: string): Product | undefined {
    return this.products.find(p => p.slug === slug);
  }

  public getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  public createProduct(data: Omit<Product, 'id' | 'createdAt'>): Product {
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.products.unshift(newProduct);
    this.addAuditLog('Admin', 'admin', 'PRODUCT_CREATED', `Added new product: ${newProduct.name}`);
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.products[idx] = { ...this.products[idx], ...updates };
    this.addAuditLog('Admin', 'admin', 'PRODUCT_UPDATED', `Updated product: ${this.products[idx].name}`);
    return this.products[idx];
  }

  public deleteProduct(id: string): boolean {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx === -1) return false;
    const removed = this.products.splice(idx, 1)[0];
    this.addAuditLog('Admin', 'admin', 'PRODUCT_DELETED', `Deleted product: ${removed.name}`);
    return true;
  }

  // ================= CATEGORIES =================
  public getCategories(): Category[] {
    return this.categories;
  }

  // ================= PRICING & INVENTORY RULES =================
  /**
   * Server-side calculation of pricing, volume/wholesale discounts, delivery fee, and taxes.
   * Prevents client tampering.
   */
  public calculateQuote(
    rawItems: { productId: string; size: string; quantity: number }[],
    couponCode?: string,
    district?: string
  ): {
    items: OrderItem[];
    subtotalRwf: number;
    discountRwf: number;
    discountCodeApplied?: string;
    deliveryFeeRwf: number;
    taxRwf: number;
    totalRwf: number;
    stockErrors: string[];
    wholesaleSavingsRwf: number;
  } {
    const items: OrderItem[] = [];
    const stockErrors: string[] = [];
    let subtotalRwf = 0;
    let wholesaleSavingsRwf = 0;

    for (const item of rawItems) {
      if (item.quantity <= 0) continue;
      const product = this.getProductById(item.productId);
      if (!product) {
        stockErrors.push(`Product with ID ${item.productId} was not found.`);
        continue;
      }
      const variant = product.variants.find(v => v.size === item.size);
      if (!variant) {
        stockErrors.push(`Size ${item.size} not available for ${product.name}.`);
        continue;
      }
      if (variant.stockQuantity < item.quantity) {
        stockErrors.push(`Only ${variant.stockQuantity} units in stock for ${product.name} (${variant.size}). Requested: ${item.quantity}.`);
      }

      // Check wholesale volume threshold
      let unitPrice = variant.priceRwf;
      if (item.quantity >= variant.wholesaleMinQty && variant.wholesalePriceRwf > 0) {
        wholesaleSavingsRwf += (variant.priceRwf - variant.wholesalePriceRwf) * item.quantity;
        unitPrice = variant.wholesalePriceRwf;
      }

      const lineSubtotal = unitPrice * item.quantity;
      subtotalRwf += lineSubtotal;

      items.push({
        productId: product.id,
        name: product.name,
        size: variant.size,
        sku: variant.sku,
        unitPriceRwf: unitPrice,
        quantity: item.quantity,
        subtotalRwf: lineSubtotal
      });
    }

    // Validate Coupon
    let discountRwf = 0;
    let validCouponCode: string | undefined = undefined;
    if (couponCode) {
      const coupon = this.coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.active);
      if (coupon && subtotalRwf >= coupon.minOrderRwf) {
        discountRwf = Math.round((subtotalRwf * coupon.discountPercent) / 100);
        validCouponCode = coupon.code;
      }
    }

    // Delivery calculation
    // Kigali districts: Gasabo, Kicukiro, Nyarugenge
    // Free delivery if subtotal after discount >= 30,000 RWF or configured threshold
    const discountedSubtotal = Math.max(0, subtotalRwf - discountRwf);
    let deliveryFeeRwf = 2000; // standard Kigali delivery
    if (district && !['gasabo', 'kicukiro', 'nyarugenge'].includes(district.toLowerCase().trim())) {
      deliveryFeeRwf = 5000; // upcountry Rwanda
    }
    if (discountedSubtotal >= this.content.freeDeliveryThresholdRwf && discountedSubtotal > 0) {
      deliveryFeeRwf = 0; // free delivery qualification
    }
    if (discountedSubtotal === 0) {
      deliveryFeeRwf = 0;
    }

    // In Rwanda, prices typically include 18% VAT. We calculate and show the tax component for commercial receipts.
    const taxRwf = Math.round((discountedSubtotal * 18) / 118);
    const totalRwf = discountedSubtotal + deliveryFeeRwf;

    return {
      items,
      subtotalRwf,
      discountRwf,
      discountCodeApplied: validCouponCode,
      deliveryFeeRwf,
      taxRwf,
      totalRwf,
      stockErrors,
      wholesaleSavingsRwf
    };
  }

  /**
   * Atomic order placement: validates availability again, updates inventory, and generates order record
   */
  public placeOrder(orderData: {
    customer: Order['customer'];
    items: { productId: string; size: string; quantity: number }[];
    paymentMethod: Order['paymentMethod'];
    customerNotes?: string;
    couponCode?: string;
  }): { success: boolean; order?: Order; error?: string } {
    const calculation = this.calculateQuote(orderData.items, orderData.couponCode, orderData.customer.district);

    if (calculation.stockErrors.length > 0) {
      return { success: false, error: calculation.stockErrors.join(' ') };
    }
    if (calculation.items.length === 0) {
      return { success: false, error: 'Cannot place order with zero valid items.' };
    }

    // Atomically decrement stock
    for (const item of calculation.items) {
      const prod = this.getProductById(item.productId);
      if (prod) {
        const variant = prod.variants.find(v => v.size === item.size);
        if (variant) {
          variant.stockQuantity = Math.max(0, variant.stockQuantity - item.quantity);
          if (variant.stockQuantity === 0) {
            variant.inStock = false;
          }
        }
      }
    }

    const orderNumber = `ISP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customer: orderData.customer,
      items: calculation.items,
      subtotalRwf: calculation.subtotalRwf,
      discountRwf: calculation.discountRwf,
      discountCodeApplied: calculation.discountCodeApplied,
      deliveryFeeRwf: calculation.deliveryFeeRwf,
      taxRwf: calculation.taxRwf,
      totalRwf: calculation.totalRwf,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
      fulfillmentStatus: 'pending_confirmation',
      customerNotes: orderData.customerNotes,
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          status: 'pending_confirmation',
          note: `Order submitted by ${orderData.customer.fullName} via online store`,
          timestamp: now
        }
      ]
    };

    this.orders.unshift(newOrder);

    // Also auto-capture or update lead in CRM
    this.createLead({
      name: orderData.customer.fullName,
      organization: orderData.customer.organizationName,
      phone: orderData.customer.phone,
      email: orderData.customer.email,
      customerType: orderData.customer.customerType,
      estimatedVolume: `${calculation.items.reduce((acc, i) => acc + i.quantity, 0)} units`,
      interestProduct: calculation.items.map(i => i.name).join(', '),
      source: 'landing_page',
      status: 'converted',
      notes: [`Converted to customer through Order #${orderNumber} (${calculation.totalRwf.toLocaleString()} RWF)`]
    });

    this.addAuditLog('System', 'admin', 'ORDER_CREATED', `Order #${orderNumber} created for ${orderData.customer.fullName} (${calculation.totalRwf} RWF)`);

    return { success: true, order: newOrder };
  }

  // ================= ORDERS =================
  public getOrders(): Order[] {
    return this.orders;
  }

  public getOrderByNumber(orderNumber: string): Order | undefined {
    return this.orders.find(o => o.orderNumber.toUpperCase() === orderNumber.toUpperCase());
  }

  public updateOrderStatus(orderNumber: string, status: FulfillmentStatus, note: string, actor = 'Staff'): Order | null {
    const order = this.getOrderByNumber(orderNumber);
    if (!order) return null;

    order.fulfillmentStatus = status;
    order.updatedAt = new Date().toISOString();
    order.timeline.push({
      status,
      note: note || `Status changed to ${status.replace(/_/g, ' ')}`,
      timestamp: new Date().toISOString()
    });

    this.addAuditLog(actor, 'sales_manager', 'ORDER_STATUS_UPDATED', `Order #${orderNumber} transitioned to ${status}`);
    return order;
  }

  public updatePaymentStatus(orderNumber: string, status: Order['paymentStatus'], actor = 'Staff'): Order | null {
    const order = this.getOrderByNumber(orderNumber);
    if (!order) return null;
    order.paymentStatus = status;
    order.updatedAt = new Date().toISOString();
    this.addAuditLog(actor, 'admin', 'PAYMENT_STATUS_UPDATED', `Order #${orderNumber} payment marked as ${status}`);
    return order;
  }

  // ================= LEADS & CRM =================
  public getLeads(): Lead[] {
    return this.leads;
  }

  public createLead(data: Omit<Lead, 'id' | 'createdAt'>): Lead {
    // Check if phone or email already exists to update
    const existing = this.leads.find(l => l.phone === data.phone && l.phone !== '');
    if (existing) {
      existing.notes.push(...(data.notes || []));
      if (data.status === 'converted') existing.status = 'converted';
      return existing;
    }

    const newLead: Lead = {
      ...data,
      id: `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };
    this.leads.unshift(newLead);
    this.addAuditLog('Sales Bot/Form', 'sales_agent', 'LEAD_CAPTURED', `New lead captured: ${newLead.name} (${newLead.customerType})`);
    return newLead;
  }

  public updateLead(id: string, updates: Partial<Lead>): Lead | null {
    const idx = this.leads.findIndex(l => l.id === id);
    if (idx === -1) return null;
    this.leads[idx] = { ...this.leads[idx], ...updates };
    return this.leads[idx];
  }

  // ================= CONVERSATIONS & CHAT =================
  public getConversation(visitorId: string): Conversation {
    if (!this.conversations.has(visitorId)) {
      this.conversations.set(visitorId, {
        id: `conv-${Date.now()}`,
        visitorId,
        messages: [
          {
            id: 'msg-welcome',
            role: 'assistant',
            content: 'Hello! 👋 Welcome to Isuku Pure Cleaners. I am your AI sales assistant. I can help you select the ideal liquid soap, compare packaging sizes (500ml, 1L, 5L, or 20L), calculate wholesale discounts, and place orders. How can I help you today?',
            timestamp: new Date().toISOString(),
            suggestedActions: [
              'Recommend dishwashing soap',
              'Commercial quote for 20L jerrycans',
              'Do you deliver to Kigali?',
              'Wholesale pricing for hotels'
            ]
          }
        ],
        status: 'active',
        leadCaptured: false,
        lastActive: new Date().toISOString()
      });
    }
    return this.conversations.get(visitorId)!;
  }

  public getAllConversations(): Conversation[] {
    return Array.from(this.conversations.values());
  }

  public saveConversation(conv: Conversation) {
    conv.lastActive = new Date().toISOString();
    this.conversations.set(conv.visitorId, conv);
  }

  // ================= COUPONS =================
  public getCoupons(): Coupon[] {
    return this.coupons;
  }

  public validateCoupon(code: string, subtotalRwf: number) {
    const coupon = this.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon) return { valid: false, error: 'Invalid coupon code.' };
    if (!coupon.active) return { valid: false, error: 'This coupon is no longer active.' };
    if (subtotalRwf < coupon.minOrderRwf) {
      return { 
        valid: false, 
        error: `Requires a minimum order of ${coupon.minOrderRwf.toLocaleString()} RWF.` 
      };
    }
    const discountAmount = Math.round((subtotalRwf * coupon.discountPercent) / 100);
    return { 
      valid: true, 
      coupon, 
      discountAmount, 
      discountPercent: coupon.discountPercent 
    };
  }

  // ================= WEBSITE CONTENT =================
  public getContent(): WebsiteContent {
    return this.content;
  }

  public updateContent(updates: Partial<WebsiteContent>): WebsiteContent {
    this.content = { ...this.content, ...updates };
    this.addAuditLog('Admin', 'admin', 'CONTENT_UPDATED', 'Updated website homepage/settings content.');
    return this.content;
  }

  // ================= AUDIT LOGS =================
  public getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }

  public addAuditLog(userName: string, userRole: UserRole, action: string, details: string) {
    this.auditLogs.unshift({
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userName,
      userRole,
      action,
      details,
      timestamp: new Date().toISOString()
    });
  }

  // ================= ANALYTICS =================
  public getAnalytics() {
    const totalOrders = this.orders.length;
    const pendingOrders = this.orders.filter(o => o.fulfillmentStatus === 'pending_confirmation' || o.fulfillmentStatus === 'processing').length;
    const completedOrders = this.orders.filter(o => o.fulfillmentStatus === 'delivered').length;
    const totalRevenueRwf = this.orders.reduce((sum, o) => sum + o.totalRwf, 0);
    const totalLeads = this.leads.length;
    const qualifiedLeads = this.leads.filter(l => l.status === 'qualified' || l.status === 'converted').length;

    // Low stock alerts
    const lowStockAlerts: { name: string; size: string; stock: number; sku: string }[] = [];
    for (const prod of this.products) {
      for (const variant of prod.variants) {
        if (variant.stockQuantity <= 25) {
          lowStockAlerts.push({
            name: prod.name,
            size: variant.size,
            stock: variant.stockQuantity,
            sku: variant.sku
          });
        }
      }
    }

    const conversationCount = this.conversations.size;
    const aiAssistedOrders = this.leads.filter(l => l.source === 'ai_chatbot' && l.status === 'converted').length;
    const conversionRate = totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : '0';

    return {
      totalRevenueRwf,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalLeads,
      qualifiedLeads,
      lowStockAlerts,
      conversationCount,
      aiAssistedOrders,
      conversionRate
    };
  }
}

export const db = new Store();
