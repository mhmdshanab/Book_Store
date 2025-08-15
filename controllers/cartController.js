const CartItem = require('../models/cartModel');
const Book = require('../models/bookModel');

// ✅ عرض السلة
exports.getCart = async (req, res) => {
  try {
    const user = req.user || res.locals.user;
    if (!user) return res.redirect('/login');

    const userId = user.id;
    const cart = await CartItem.find({ userId }).populate('bookId');

    // تصفية العناصر الصحيحة فقط
    const validCart = cart.filter(item => item.bookId && item.bookId._id);

    const totalQuantity = validCart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = validCart.reduce((sum, item) => sum + item.quantity * (item.bookId?.price || 0), 0);

    res.render('all-cart', {
      cart: validCart,
      totalQuantity,
      totalPrice,
      message: null,
      user,
      stripeKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
  } catch (err) {
    console.error('❌ Error loading cart:', err);
    res.status(500).send('❌ Error loading cart.');
  }
};

// ✅ إضافة كتاب إلى السلة
exports.addToCart = async (req, res) => {
  try {
    const user = req.user || res.locals.user;
    if (!user) return res.redirect('/login');

    const userId = user.id;
    const bookId = req.body.bookId;

    if (!bookId) {
      return res.render('all-books', { books: [], message: '❌ Book ID is required.', user });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.render('all-books', { books: [], message: '❌ Book not found.', user });
    }
    
    if (book.stock <= 0) {
      return res.render('all-books', { books: [], message: '❌ This book is out of stock.', user });
    }

    let item = await CartItem.findOne({ userId, bookId });

    if (item) {
      item.quantity++;
      await item.save();
    } else {
      await CartItem.create({ userId, bookId, quantity: 1 });
    }

    book.stock--;
    await book.save();

    res.redirect('/books/allBooks');
  } catch (err) {
    console.error('❌ Error adding to cart:', err);
    res.status(500).send('❌ Error adding to cart.');
  }
};

// ✅ زيادة كمية كتاب
exports.increaseQuantity = async (req, res) => {
  try {
    const user = req.user || res.locals.user;
    if (!user) return res.redirect('/login');

    const userId = user.id;
    const bookId = req.params.id;

    const item = await CartItem.findOne({ userId, bookId });
    const book = await Book.findById(bookId);

    if (!book || !item) {
      return res.redirect('/cart/allCart');
    }

    if (book.stock <= 0) {
      return res.redirect('/cart/allCart');
    }

    item.quantity++;
    await item.save();

    book.stock--;
    await book.save();

    res.redirect('/cart/allCart');
  } catch (err) {
    console.error('❌ Error increasing quantity:', err);
    res.status(500).send('❌ Error increasing quantity.');
  }
};

// ✅ تقليل كمية كتاب
exports.decreaseQuantity = async (req, res) => {
  try {
    const user = req.user || res.locals.user;
    if (!user) return res.redirect('/login');

    const userId = user.id;
    const bookId = req.params.id;

    const item = await CartItem.findOne({ userId, bookId });
    const book = await Book.findById(bookId);

    if (!item || !book) {
      return res.redirect('/cart/allCart');
    }

    if (item.quantity <= 1) {
      await item.deleteOne();
    } else {
      item.quantity--;
      await item.save();
    }

    book.stock++;
    await book.save();

    res.redirect('/cart/allCart');
  } catch (err) {
    console.error('❌ Error decreasing quantity:', err);
    res.status(500).send('❌ Error decreasing quantity.');
  }
};

// ✅ حذف عنصر من السلة
exports.removeFromCart = async (req, res) => {
  try {
    const user = req.user || res.locals.user;
    if (!user) return res.redirect('/login');

    const userId = user.id;
    const bookId = req.params.id;

    const item = await CartItem.findOne({ userId, bookId });
    const book = await Book.findById(bookId);

    if (!item) {
      return res.redirect('/cart/allCart');
    }

    if (book) {
      book.stock += item.quantity;
      await book.save();
    }

    await item.deleteOne();

    res.redirect('/cart/allCart');
  } catch (err) {
    console.error('❌ Error removing item:', err);
    res.status(500).send('❌ Error removing item.');
  }
};

// ✅ تفريغ السلة
exports.emptyCart = async (req, res) => {
  try {
    const user = req.user || res.locals.user;
    if (!user) return res.redirect('/login');

    const userId = user.id;
    const cartItems = await CartItem.find({ userId });

    for (const item of cartItems) {
      const book = await Book.findById(item.bookId);
      if (book) {
        book.stock += item.quantity;
        await book.save();
      }
      await item.deleteOne();
    }

    res.redirect('/cart/allCart');
  } catch (err) {
    console.error('❌ Error emptying cart:', err);
    res.status(500).send('❌ Error emptying cart.');
  }
};

// ✅ تنظيف السلة من العناصر غير الصحيحة
exports.cleanCart = async (req, res) => {
  try {
    const user = req.user || res.locals.user;
    if (!user) return res.redirect('/login');

    const userId = user.id;
    const cartItems = await CartItem.find({ userId });

    for (const item of cartItems) {
      const book = await Book.findById(item.bookId);
      if (!book) {
        // إذا لم يعد الكتاب موجوداً، أزل العنصر من السلة
        await item.deleteOne();
        console.log(`🗑️ Removed invalid cart item for book ID: ${item.bookId}`);
      }
    }

    res.redirect('/cart/allCart');
  } catch (err) {
    console.error('❌ Error cleaning cart:', err);
    res.status(500).send('❌ Error cleaning cart.');
  }
};
