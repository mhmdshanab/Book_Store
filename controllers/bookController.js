// controllers/bookController.js
const Book = require('../models/bookModel');

// ✅ عرض كل الكتب
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ stock: { $gt: 0 } });
    const user = req.user || res.locals.user || null;
    const message = null;

    res.render('all-books', { books, message, user });
  } catch (err) {
    console.error('❌ Error loading books from DB:', err);
    res.status(500).send('❌ Error loading books from DB.');
  }
};

// ✅ صفحة إضافة كتاب
exports.getAddBookPage = (req, res) => {
  const user = req.user || res.locals.user || null;
  res.render('add-book', { user, message: null });
};

// ✅ حفظ كتاب جديد
exports.postAddBook = async (req, res) => {
  const { title, price, description, stock } = req.body;

  if (!title || !price || !description || !stock) {
    return res.render('add-book', { user: req.user, message: '❌ All fields are required.' });
  }

  try {
    await Book.create({
      title,
      price: parseFloat(price),
      description,
      stock: parseInt(stock)
    });

    res.render('add-book', { user: req.user, message: '✅ Book added successfully.' });
  } catch (err) {
    console.error('❌ Error saving book:', err);
    res.status(500).send('❌ Error saving book.');
  }
};

// ✅ عرض صفحة تعديل كتاب
exports.getEditBookPage = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.redirect('/books/allBooks');
    }

    res.render('edit-book', { book, user: req.user });
  } catch (err) {
    console.error('❌ Error fetching book:', err);
    res.status(500).send('❌ Error fetching book.');
  }
};

// ✅ تعديل بيانات كتاب
exports.postEditBook = async (req, res) => {
  const { title, price, description, stock } = req.body;

  if (!title || !price || !description || !stock) {
    return res.render('edit-book', {
      book: { _id: req.params.id, title, price, description, stock },
      user: req.user,
      message: '❌ All fields are required.'
    });
  }

  try {
    await Book.findByIdAndUpdate(req.params.id, {
      title,
      price: parseFloat(price),
      description,
      stock: parseInt(stock)
    });

    res.redirect('/books/allBooks');
  } catch (err) {
    console.error('❌ Error updating book:', err);
    res.status(500).send('❌ Error updating book.');
  }
};

// ✅ حذف كتاب
exports.deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect('/books/allBooks');
  } catch (err) {
    console.error('❌ Error deleting book:', err);
    res.status(500).send('❌ Error deleting book.');
  }
};
