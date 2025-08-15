// controllers/authController.js
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { sendEmail } = require('../utils/mailer');
const generateToken = require('../utils/generateToken'); // ✅ استدعاء الدالة الجديدة

// ✅ عرض صفحة تسجيل الدخول
exports.getLoginPage = (req, res) => {
  res.render('login', { req });
};

// ✅ عرض صفحة التسجيل
exports.getRegisterPage = (req, res) => {
  const message = req.cookies.message || null;
  res.clearCookie('message');
  res.render('register', { message });
};

// ✅ معالجة التسجيل
exports.postRegister = async (req, res) => {
  const { username, firstName, lastName, email, phone, password, confirmPassword } = req.body;

  if (!username || !firstName || !lastName || !email || !phone || !password || !confirmPassword) {
    res.cookie('message', '❌ All fields are required.');
    return res.redirect('/register');
  }

  if (password !== confirmPassword) {
    res.cookie('message', '❌ Passwords do not match.');
    return res.redirect('/register');
  }

  try {
    const existingUser = await User.findOne({ username: { $regex: `^${username}$`, $options: 'i' } });
    if (existingUser) {
      res.cookie('message', '⚠️ Username already exists.');
      return res.redirect('/register');
    }

    const userCount = await User.countDocuments();
    const isAdmin = userCount === 0;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
  username,
  firstName,
  lastName,
  email,
  phone,
  password: hashedPassword,
  isAdmin
});

await newUser.save(); // ✅ هذا ضروري تنتظره لأنه يعتمد عليه كل شيء بعده

// ✅ إرسال الإيميل بالخلفية بدون انتظار
sendEmail(
  email,
  '📚 Welcome to Book Store!',
  `Hello ${firstName}, thank you for registering!`
).catch(emailErr => {
  console.warn('⚠️ Failed to send welcome email:', emailErr.message);
});
    const token = generateToken(newUser); // ✅ استخدام الدالة الجديدة
    res.cookie('token', token, { httpOnly: true });

    return res.redirect(newUser.isAdmin ? '/dashboard/admin' : '/dashboard/user');

  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).send('❌ Error registering user.');
  }
};

// ✅ تسجيل الدخول
exports.postLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.cookie('message', '❌ Invalid username or password.');
      return res.redirect('/login');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.cookie('message', '❌ Invalid username or password.');
      return res.redirect('/login');
    }

    const token = generateToken(user); // ✅ استخدام الدالة الجديدة
    res.cookie('token', token, { httpOnly: true });

    return res.redirect(user.isAdmin ? '/dashboard/admin' : '/dashboard/user');

  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).send('❌ Error logging in.');
  }
};

// ✅ تسجيل الخروج
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};
