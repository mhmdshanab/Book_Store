// app.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');

// 🔗 Import Routes
const bookRoutes = require('./routes/bookRoutes');
const cartRoutes = require('./routes/cartRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const authMiddleware = require('./middleware/authMiddleware')
// 🔌 Connect to DB
const connectDB = require('./config/db');
connectDB();

const app = express();

// 🔧 Middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware خاص لـ Stripe webhook
app.use('/payment/webhook', express.raw({ type: 'application/json' }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Extract user from token for all views
app.use(authMiddleware.setUser);

// 📦 Routes
app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/books', bookRoutes);
app.use('/cart', cartRoutes);
app.use('/payment', paymentRoutes);

// 🚀 Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
