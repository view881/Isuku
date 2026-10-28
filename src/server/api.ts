import { Router, Request, Response } from 'express';
import { db } from './db';
import { processAIChat } from './aiSalesAgent';
import { CustomerType, FulfillmentStatus } from '../types';

export const apiRouter = Router();

// ================= PUBLIC PRODUCTS & CATEGORIES =================
apiRouter.get('/products', (req: Request, res: Response) => {
  const includeInactive = req.query.admin === 'true';
  const products = db.getProducts(includeInactive);
  res.json({ products });
});

apiRouter.get('/products/:slug', (req: Request, res: Response) => {
  const product = db.getProductBySlug(req.params.slug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
});

apiRouter.get('/categories', (_req: Request, res: Response) => {
  const categories = db.getCategories();
  res.json({ categories });
});

// ================= PRICING & QUOTES =================
apiRouter.post('/quote/calculate', (req: Request, res: Response) => {
  const { items, couponCode, district } = req.body;
  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Items array is required' });
  }
  const quote = db.calculateQuote(items, couponCode, district);
  res.json(quote);
});

apiRouter.post('/coupons/validate', (req: Request, res: Response) => {
  const { code, subtotalRwf } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Coupon code is required' });
  }
  const result = db.validateCoupon(code, Number(subtotalRwf) || 0);
  res.json(result);
});

// ================= ORDERS =================
apiRouter.post('/orders', (req: Request, res: Response) => {
  const { customer, items, paymentMethod, customerNotes, couponCode } = req.body;

  if (!customer || !customer.fullName || !customer.phone || !customer.deliveryAddress) {
    return res.status(400).json({ error: 'Customer name, phone, and delivery address are required.' });
  }
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'At least one item is required in order.' });
  }

  const result = db.placeOrder({
    customer,
    items,
    paymentMethod: paymentMethod || 'cash_on_delivery',
    customerNotes,
    couponCode
  });

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  res.status(201).json({ success: true, order: result.order });
});

apiRouter.get('/orders', (req: Request, res: Response) => {
  const orders = db.getOrders();
  res.json({ orders });
});

apiRouter.get('/orders/:orderNumber', (req: Request, res: Response) => {
  const order = db.getOrderByNumber(req.params.orderNumber);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({ order });
});

apiRouter.patch('/orders/:orderNumber/status', (req: Request, res: Response) => {
  const { status, note, actor } = req.body;
  const validStatuses: FulfillmentStatus[] = [
    'pending_confirmation',
    'confirmed',
    'processing',
    'ready_for_delivery',
    'out_for_delivery',
    'delivered',
    'cancelled'
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid fulfillment status.' });
  }

  const updated = db.updateOrderStatus(req.params.orderNumber, status, note, actor || 'Admin');
  if (!updated) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({ success: true, order: updated });
});

// ================= LEADS & WHOLESALE INQUIRIES =================
apiRouter.get('/leads', (_req: Request, res: Response) => {
  const leads = db.getLeads();
  res.json({ leads });
});

apiRouter.post('/leads', (req: Request, res: Response) => {
  const { name, phone, email, organization, customerType, estimatedVolume, interestProduct, source, notes } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone number are required.' });
  }

  const lead = db.createLead({
    name,
    phone,
    email,
    organization,
    customerType: (customerType as CustomerType) || 'wholesaler',
    estimatedVolume,
    interestProduct,
    source: source || 'wholesale_form',
    status: 'new',
    notes: notes ? [notes] : []
  });

  res.status(201).json({ success: true, lead });
});

apiRouter.patch('/leads/:id', (req: Request, res: Response) => {
  const updated = db.updateLead(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Lead not found' });
  }
  res.json({ success: true, lead: updated });
});

// ================= AI CHAT SALES AGENT =================
apiRouter.post('/ai/chat', async (req: Request, res: Response) => {
  const { visitorId, message, language } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message string is required' });
  }

  const vid = visitorId || `vis-${Date.now()}`;
  try {
    const assistantReply = await processAIChat(vid, message, language || 'en');
    res.json({ reply: assistantReply, visitorId: vid });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to process chat' });
  }
});

apiRouter.get('/ai/conversation/:visitorId', (req: Request, res: Response) => {
  const conv = db.getConversation(req.params.visitorId);
  res.json({ conversation: conv });
});

apiRouter.get('/ai/conversations', (_req: Request, res: Response) => {
  const conversations = db.getAllConversations();
  res.json({ conversations });
});

// ================= WEBSITE CONTENT & SETTINGS =================
apiRouter.get('/content', (_req: Request, res: Response) => {
  const content = db.getContent();
  res.json({ content });
});

apiRouter.put('/content', (req: Request, res: Response) => {
  const updated = db.updateContent(req.body);
  res.json({ success: true, content: updated });
});

// ================= ADMIN MANAGEMENT & AUDIT =================
apiRouter.get('/admin/analytics', (_req: Request, res: Response) => {
  const analytics = db.getAnalytics();
  res.json(analytics);
});

apiRouter.get('/admin/audit-logs', (_req: Request, res: Response) => {
  const logs = db.getAuditLogs();
  res.json({ logs });
});

apiRouter.post('/admin/products', (req: Request, res: Response) => {
  const { name, category, shortDescription, fullDescription, usageInstructions, ingredients, safetyInstructions, features, variants, images, featured } = req.body;
  if (!name || !variants || variants.length === 0) {
    return res.status(400).json({ error: 'Product name and at least one size variant are required.' });
  }
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const product = db.createProduct({
    slug,
    name,
    category: category || 'multipurpose',
    shortDescription: shortDescription || '',
    fullDescription: fullDescription || '',
    usageInstructions: usageInstructions || '',
    ingredients: ingredients || [],
    safetyInstructions: safetyInstructions || '',
    features: features || [],
    images: images && images.length ? images : ['/src/assets/images/hero_liquid_soap_lineup_1793189044482.jpg'],
    variants,
    featured: !!featured,
    active: true
  });
  res.status(201).json({ success: true, product });
});

apiRouter.put('/admin/products/:id', (req: Request, res: Response) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ success: true, product: updated });
});

apiRouter.delete('/admin/products/:id', (req: Request, res: Response) => {
  const success = db.deleteProduct(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ success: true });
});

// Admin authentication endpoint
apiRouter.post('/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  // Demo accounts for the staff roles
  if (email === 'admin@isukupure.rw' && password === 'Isuku2026!') {
    return res.json({
      success: true,
      user: {
        id: 'usr-1',
        name: 'Emmanuel Habimana',
        email: 'admin@isukupure.rw',
        role: 'owner'
      },
      token: 'mock-jwt-owner-2026'
    });
  } else if (email === 'sales@isukupure.rw' && password === 'Sales2026!') {
    return res.json({
      success: true,
      user: {
        id: 'usr-2',
        name: 'Aline Uwase',
        email: 'sales@isukupure.rw',
        role: 'sales_manager'
      },
      token: 'mock-jwt-sales-2026'
    });
  } else if (email === 'agent@isukupure.rw' && password === 'Agent2026!') {
    return res.json({
      success: true,
      user: {
        id: 'usr-3',
        name: 'Eric Nshuti',
        email: 'agent@isukupure.rw',
        role: 'sales_agent'
      },
      token: 'mock-jwt-agent-2026'
    });
  }

  // Provide fallback default login so the user can easily test
  if (password === 'admin' || password === '123456') {
    return res.json({
      success: true,
      user: {
        id: 'usr-demo',
        name: 'Staff Administrator',
        email: email || 'admin@isukupure.rw',
        role: 'admin'
      },
      token: 'mock-jwt-admin-2026'
    });
  }

  res.status(401).json({ error: 'Invalid credentials. You may use admin@isukupure.rw / Isuku2026!' });
});
