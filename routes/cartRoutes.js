// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { requireAuth } = require('../middleware/authMiddleware');

// 📦 عرض محتويات السلة
router.get('/allCart', requireAuth, cartController.getCart);

// ➕ إضافة كتاب للسلة
router.post('/add-to-cart', requireAuth, cartController.addToCart);

// ❌ إزالة كتاب من السلة (id من الرابط)
router.post('/remove-from-cart/:id', requireAuth, cartController.removeFromCart);

// 🔼 زيادة كمية كتاب في السلة
router.post('/increase-quantity/:id', requireAuth, cartController.increaseQuantity);

// 🔽 تقليل كمية كتاب في السلة
router.post('/decrease-quantity/:id', requireAuth, cartController.decreaseQuantity);

// 🧹 تفريغ السلة بالكامل
router.post('/empty-cart', requireAuth, cartController.emptyCart);

// 🧽 تنظيف السلة من العناصر غير الصحيحة
router.post('/clean-cart', requireAuth, cartController.cleanCart);

module.exports = router;
