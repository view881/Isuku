# Isuku Pure Cleaners Ltd - Liquid Soap & AI Sales Platform

Modern full-stack e-commerce, wholesale B2B distribution, and AI sales platform built for **Isuku Pure Cleaners Ltd**, a liquid soap manufacturing company operating in the **Kigali Special Economic Zone (KSEZ), Masoro, Rwanda**.

---

## 🌟 Key Features

### 1. Public E-Commerce & B2B Wholesale Website
- **Mobile-First Design System**: Deep emerald green, fresh lime accents, crisp typography (`Plus Jakarta Sans` & `Outfit`), zero-pill metadata discipline, and high-fidelity product imagery.
- **Top Bar Contract**: Strict 3-zone header with wordmark, concise single-line nav links, cart drawer trigger, language selector, and primary CTA.
- **Factory-Direct Catalog**:
  - Dishwashing Liquid (500ml, 1L, 5L, 20L)
  - Antibacterial Hand Soap (500ml, 1L, 5L, 20L)
  - High-Efficiency Laundry Liquid (1L, 5L, 20L)
  - Concentrated Commercial Multipurpose Cleaner & Degreaser (5L, 20L)
- **Currency**: Rwandan Francs (`RWF`) formatted with tabular figures.
- **Multilingual Support**: English (default), Kinyarwanda, and French.
- **Interactive Wholesale B2B Portal**: Interactive bulk savings calculator and corporate registration form for hotels, schools, hospitals, and restaurants.
- **Instant Ordering & Checkout**:
  - Live quote calculation on the server (handles volume tier discounts, promo codes, and Kigali delivery logic).
  - Explicit customer confirmation before order submission.
  - No mandatory online credit card payment; supports Payment on Delivery, MTN Mobile Money (MoMo), Airtel Money, and Bank Transfer.
  - 1-click **"Order on WhatsApp"** with automated itemized message.
- **Printable Invoices & Receipts**: Commercial receipts with TIN, VAT breakdown, and live milestone tracking.

### 2. 24/7 AI Sales Agent Chatbot
- Connected to Google Gemini (`gemini-3.8-flash`) via the `@google/genai` TypeScript SDK on the server with `User-Agent: 'aistudio-build'`.
- **Server-Side Function Calling Tools**:
  1. `lookupProducts`: Queries current database catalog and specifications.
  2. `calculateOrderQuote`: Calculates accurate totals, wholesale discounts, and delivery fees in RWF.
  3. `captureSalesLead`: Collects customer name, organization, volume needs, and phone with consent.
  4. `escalateToHumanSales`: Provides direct WhatsApp contact link for custom contracts.
- Embedded interactive recommendation cards with 1-click `+Cart` and live quote breakdown tables.

### 3. Secure Admin Dashboard (`/admin`)
- **Role-Based Access Control (RBAC)**:
  - `owner` (Emmanuel Habimana)
  - `admin` (Staff Administrator)
  - `sales_manager` (Aline Uwase)
  - `sales_agent` (Eric Nshuti)
- **Executive Operations Overview**: Live revenue, order counts, pending fulfillment, low stock warnings, and conversion rates.
- **Product & Inventory Management**: Add products, adjust packaging sizes, set retail/wholesale prices in RWF, and edit warehouse stock levels.
- **Order Fulfillment & Dispatch**: Order inspection, status updates (`pending_confirmation` → `confirmed` → `processing` → `out_for_delivery` → `delivered`), and payment status tracking.
- **Sales Pipeline & Lead CRM**: Follow-up notes, pipeline classification (`new`, `contacted`, `qualified`, `converted`, `lost`), and WhatsApp quick-dial.
- **AI Sales Telemetry**: Visitor chat transcripts, tool execution history, and lead capture logs.
- **Website Content Management**: Change announcement banner text, Kigali free delivery threshold, and factory contact details without code edits.
- **Audit Trail**: Security log recording sensitive actions.

---

## 🔐 Staff Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Owner / Admin** | `admin@isukupure.rw` | `Isuku2026!` |
| **Sales Manager** | `sales@isukupure.rw` | `Sales2026!` |
| **Sales Agent** | `agent@isukupure.rw` | `Agent2026!` |

*(A fast single-click login button is also provided on `/admin` for rapid evaluation.)*

---

## 🚀 Running the Application

### Development
```bash
npm run dev
```
Starts the full-stack Node.js Express server on port 3000 mounting the API router and Vite middleware.

### Automated Tests
```bash
npm test
```
Executes automated tests validating wholesale volume discount calculations, inventory guards, Kigali delivery rules, coupon constraints, and role permissions.

### Build
```bash
npm run build
```
Creates production-ready frontend bundle.
