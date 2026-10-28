import test from 'node:test';
import assert from 'node:assert/strict';

// Core Business Logic Unit Tests

// Test 1: Pricing and Wholesale Volume Threshold Calculation
test('Wholesale volume discount triggers when quantity exceeds threshold', () => {
  const variant = {
    size: '20 L',
    priceRwf: 36000,
    wholesalePriceRwf: 29500,
    wholesaleMinQty: 2
  };

  function calculateUnitPrice(qty) {
    if (qty >= variant.wholesaleMinQty && variant.wholesalePriceRwf > 0) {
      return variant.wholesalePriceRwf;
    }
    return variant.priceRwf;
  }

  // 1 unit: retail price
  assert.equal(calculateUnitPrice(1), 36000);

  // 2 units: wholesale price
  assert.equal(calculateUnitPrice(2), 29500);

  // 5 units: wholesale price
  assert.equal(calculateUnitPrice(5), 29500);
});

// Test 2: Kigali Free Delivery Qualification Threshold
test('Free delivery activates when subtotal exceeds threshold', () => {
  const threshold = 30000;
  function getDeliveryFee(subtotal, district = 'Gasabo') {
    if (subtotal >= threshold) return 0;
    const isKigali = ['gasabo', 'kicukiro', 'nyarugenge'].includes(district.toLowerCase());
    return isKigali ? 2000 : 5000;
  }

  assert.equal(getDeliveryFee(15000, 'Gasabo'), 2000);
  assert.equal(getDeliveryFee(30000, 'Gasabo'), 0);
  assert.equal(getDeliveryFee(45000, 'Kicukiro'), 0);
  assert.equal(getDeliveryFee(20000, 'Musanze'), 5000);
});

// Test 3: Coupon Code Application & Validation
test('Coupon code validates minimum order constraint', () => {
  const coupon = {
    code: 'ISUKU10',
    discountPercent: 10,
    minOrderRwf: 10000,
    active: true
  };

  function applyCoupon(subtotal, code) {
    if (code !== coupon.code || !coupon.active) return { valid: false, discount: 0 };
    if (subtotal < coupon.minOrderRwf) return { valid: false, discount: 0 };
    const discount = Math.round((subtotal * coupon.discountPercent) / 100);
    return { valid: true, discount };
  }

  // Below minimum
  assert.equal(applyCoupon(8000, 'ISUKU10').valid, false);

  // Meets minimum
  const result = applyCoupon(12000, 'ISUKU10');
  assert.equal(result.valid, true);
  assert.equal(result.discount, 1200);
});

// Test 4: Inventory Depletion & Underflow Guard
test('Inventory stock cannot decrement below zero', () => {
  let stockQuantity = 5;

  function deductStock(qty) {
    if (qty > stockQuantity) {
      throw new Error(`Insufficient stock. Available: ${stockQuantity}, Requested: ${qty}`);
    }
    stockQuantity -= qty;
    return stockQuantity;
  }

  assert.equal(deductStock(3), 2);
  assert.throws(() => deductStock(5), /Insufficient stock/);
});

// Test 5: Role-Based Authorization Hierarchy
test('Staff roles obey hierarchical permissions', () => {
  const weights = { owner: 4, admin: 3, sales_manager: 2, sales_agent: 1 };

  function canAccess(userRole, requiredRole) {
    return weights[userRole] >= weights[requiredRole];
  }

  assert.equal(canAccess('owner', 'admin'), true);
  assert.equal(canAccess('admin', 'sales_manager'), true);
  assert.equal(canAccess('sales_manager', 'sales_agent'), true);
  assert.equal(canAccess('sales_agent', 'admin'), false);
  assert.equal(canAccess('sales_manager', 'owner'), false);
});
