# 📚 Book Store - متجر الكتب

نظام متجر كتب إلكتروني مبني بـ Node.js و Express.js مع دعم الدفع عبر Stripe.

## 🚀 الميزات

- ✅ نظام مصادقة كامل (تسجيل دخول/خروج)
- 📖 إدارة الكتب (إضافة/تعديل/حذف)
- 🛒 نظام سلة التسوق
- 💳 دفع إلكتروني عبر Stripe
- 👥 لوحات تحكم منفصلة للمشرف والمستخدم
- 📧 إرسال رسائل البريد الإلكتروني
- 🔐 حماية API عبر JWT

## 🛠️ التقنيات المستخدمة

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT, bcrypt
- **Payment:** Stripe
- **Email:** Nodemailer
- **Frontend:** EJS Templates
- **Styling:** CSS

## 📋 المتطلبات

- Node.js (v14 أو أحدث)
- MongoDB
- حساب Stripe
- حساب Gmail (لإرسال البريد)

## ⚙️ التثبيت

### 1. استنساخ المشروع
```bash
git clone <repository-url>
cd Book_Store
```

### 2. تثبيت التبعيات
```bash
npm install
```

### 3. إعداد المتغيرات البيئية
```bash
cp .env.example .env
# قم بتعديل ملف .env بالمعلومات المطلوبة
```

### 4. تشغيل قاعدة البيانات
```bash
# تأكد من تشغيل MongoDB
mongod
```

### 5. تشغيل التطبيق
```bash
# للتطوير
npm run dev

# للإنتاج
npm start
```

## 🌐 المتغيرات البيئية

أضف هذه المتغيرات في ملف `.env`:

```env
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/book_store
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## 🚀 الرفع (Deployment)

### Heroku
```bash
# إنشاء تطبيق Heroku
heroku create your-app-name

# إضافة متغيرات البيئة
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set STRIPE_SECRET_KEY=your_stripe_secret

# رفع الكود
git push heroku main
```

### Railway
```bash
# تثبيت Railway CLI
npm install -g @railway/cli

# تسجيل الدخول
railway login

# إنشاء مشروع جديد
railway init

# رفع الكود
railway up
```

### Render
```bash
# ربط المستودع بـ Render
# إضافة متغيرات البيئة في لوحة التحكم
# تعيين Build Command: npm install
# تعيين Start Command: npm start
```

## 📁 هيكل المشروع

```
Book_Store/
├── app.js                 # التطبيق الرئيسي
├── config/               # إعدادات قاعدة البيانات و Stripe
├── controllers/          # منطق الأعمال
├── middleware/           # وسائط المصادقة
├── models/              # نماذج البيانات
├── routes/              # مسارات API
├── views/               # صفحات EJS
├── public/              # الملفات الثابتة
└── utils/               # أدوات مساعدة
```

## 🔧 استكشاف الأخطاء

### مشاكل قاعدة البيانات
- تأكد من تشغيل MongoDB
- تحقق من صحة URI الاتصال
- تأكد من وجود قاعدة البيانات

### مشاكل Stripe
- تحقق من صحة مفاتيح API
- تأكد من إعدادات الويب هوك

### مشاكل البريد الإلكتروني
- تأكد من تفعيل "App Passwords" في Gmail
- تحقق من إعدادات SMTP

## 📞 الدعم

للمساعدة أو الاستفسارات، يرجى التواصل عبر:
- 📧 البريد الإلكتروني
- 🐛 فتح issue في المستودع

## 📄 الرخصة

هذا المشروع مرخص تحت رخصة ISC. 