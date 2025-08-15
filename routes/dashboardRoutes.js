// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// ✅ توجيه المستخدم بناءً على الدور
router.get('/home', requireAuth, (req, res) => {
  const user = req.user;

  if (user.isAdmin) {
    console.log('✅ Admin detected. Redirecting to /dashboard/admin');
    return res.redirect('/dashboard/admin');
  } else {
    console.log('👤 User detected. Redirecting to /dashboard/user');
    return res.redirect('/dashboard/user');
  }
});

// ✅ لوحة تحكم الأدمن
router.get('/admin', requireAdmin, (req, res) => {
  const user = req.user;
  res.render('dashboard-admin', { user });
});

// ✅ لوحة تحكم المستخدم العادي
router.get('/user', requireAuth, (req, res) => {
  const user = req.user;
  res.render('dashboard-user', { user });
});

module.exports = router;
