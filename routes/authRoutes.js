// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// صفحات تسجيل الدخول والتسجيل
router.get('/login', authController.getLoginPage);
router.get('/register', authController.getRegisterPage);

// معالجة بيانات تسجيل الدخول والتسجيل
router.post('/login', authController.postLogin);
router.post('/register', authController.postRegister);

// تسجيل الخروج
router.get('/logout', authController.logout);

// الصفحة الرئيسية - توجيه إلى صفحة تسجيل الدخول
router.get('/', (req, res) => res.redirect('/login'));

// لوحة تحكم الأدمن - محمية بـ requireAdmin
router.get('/dashboard-admin', requireAdmin, (req, res) => {
  res.render('dashboard-admin', { user: req.user, message: null });
});

// لوحة تحكم المستخدم - محمية بـ requireAuth
router.get('/dashboard-user', requireAuth, (req, res) => {
  res.render('dashboard-user', { user: req.user, message: null });
});

module.exports = router;
