// routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// ✅ إعادة توجيه الجذر إلى صفحة تسجيل الدخول
router.get('/', (req, res) => {
  res.redirect('/login');
});

// ✅ عرض الصفحة الرئيسية بعد تسجيل الدخول
router.get('/home', requireAuth, (req, res) => {
  res.render('index', { user: req.user });
});

// ✅ عرض كل الكتب
router.get('/allBooks', requireAuth, bookController.getAllBooks);

// ✅ صفحة إضافة كتاب
router.get('/add-book', requireAuth, requireAdmin, bookController.getAddBookPage);
router.post('/add-book', requireAuth, requireAdmin, bookController.postAddBook);

// ✅ تعديل كتاب
router.get('/edit-book/:id', requireAuth, requireAdmin, bookController.getEditBookPage);
router.post('/edit-book/:id', requireAuth, requireAdmin, bookController.postEditBook);

// ✅ حذف كتاب
router.post('/delete-book/:id', requireAuth, requireAdmin, bookController.deleteBook);

module.exports = router;
