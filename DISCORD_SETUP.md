# إعداد نظام Discord OAuth2 للموقع

## نظرة عامة
هذا الدليل يشرح كيفية ربط موقع CA Store مع Railway Backend باستخدام Discord OAuth2.

## المتطلبات
- Railway Backend قيد التشغيل
- Discord Application مع OAuth2 مفعّل
- Discord Bot مع صلاحيات إدارة الرولز

## خطوات الإعداد

### 1. إعداد Discord Developer Portal

1. اذهب إلى https://discord.com/developers/applications
2. أنشئ تطبيق جديد أو استخدم التطبيق الحالي
3. في قسم **OAuth2**:
   - أضف Redirect URI: `https://your-website-url.com/auth/callback`
   - Scopes: `identify`, `guilds.members.read`
4. احفظ `CLIENT_ID` و `CLIENT_SECRET`

### 2. إعداد Discord Bot

1. في نفس التطبيق، أنشئ Bot
2. في قسم **Bot**:
   - احفظ `BOT_TOKEN`
   - فعّل **Server Members Intent**
3. في قسم **OAuth2 > URL Generator**:
   - Scopes: `bot`
   - Bot Permissions: `Manage Roles`
4. ادع البوت إلى سيرفرك باستخدام الرابط المُنشأ

### 3. إعداد Railway Backend

1. افتح ملف `.env` في مشروع Railway:
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   JWT_SECRET=your-random-secret-key
   DISCORD_BOT_TOKEN=your-bot-token
   DISCORD_GUILD_ID=your-server-id
   DISCORD_CLIENT_ID=your-client-id
   DISCORD_CLIENT_SECRET=your-client-secret
   WEBHOOK_SECRET=your-webhook-secret
   WEBSITE_URL=https://your-website-url.com
   ```

2. حدّث ملف `config.js` في الموقع:
   ```javascript
   const BACKEND_URL = "https://your-railway-backend-url.railway.app";
   ```

3. نشر التغييرات على Railway:
   ```bash
   git add .
   git commit -m "Add Discord OAuth2"
   git push
   ```

4. تثبيت الحزم الجديدة:
   ```bash
   npm install
   ```

### 4. إضافة الرولز في سيرفر Discord

تأكد من وجود الرولز التالية في سيرفرك:
- CA-1 (Role ID: 1479829127715618866)
- CA-2 (Role ID: 1479829984385171557)
- CA-3 (Role ID: 1502945235817467974)
- CA-4 (Role ID: 1509080955858456687)

إذا كانت الـ IDs مختلفة، حدّثها في `index.js`:
```javascript
const ROLE_PLAN_MAP = {
    "YOUR_ROLE_ID_CA1": "CA-1",
    "YOUR_ROLE_ID_CA2": "CA-2",
    "YOUR_ROLE_ID_CA3": "CA-3",
    "YOUR_ROLE_ID_CA4": "CA-4",
};
```

### 5. إعداد PayPal Webhook (اختياري)

لمنح الرول تلقائياً عند الدفع:

1. في PayPal، أنشئ Webhook
2. أضف رابط Railway Backend: `https://your-backend.railway.app/webhook/payment`
3. عند نجاح الدفع، أرسل طلب POST:
   ```json
   {
     "secret": "your-webhook-secret",
     "discordId": "user-discord-id",
     "plan": "CA-1"
   }
   ```

## كيف يعمل النظام

### تسجيل الدخول
1. المستخدم يضغط "تسجيل الدخول بـ Discord"
2. يُحوّل إلى Discord OAuth2
3. Discord يُرجع code إلى `/auth/callback`
4. Backend يبدّل code بـ access token
5. Backend يتحقق من الرولز في سيرفر Discord
6. إذا كان لديه رول، يُنشئ session ويُرجع token

### التحقق من الرولز
- البرنامج: يتحقق من HWID + Discord roles
- الموقع: يتحقق من session + Discord roles

### منح الرول عند الشراء
- عند الدفع الناجح، Webhook يُرسل discordId و plan
- Backend يمنح الرول المناسب في Discord

## الحماية المُضافة

- **Rate Limiting**: 10 محاولات كل 15 دقيقة
- **IP Logging**: تسجيل جميع الطلبات
- **Session Management**: Sessions تنتهي بعد 30 يوم
- **Webhook Secret**: تأكيد صحة الويبوك

## استكشاف الأخطاء

### فشل تسجيل الدخول
- تأكد من صحة `CLIENT_ID` و `CLIENT_SECRET`
- تأكد من صحة Redirect URI في Discord
- تحقق من logs في Railway

### الرول لا يُمنح
- تأكد من صحة `DISCORD_BOT_TOKEN`
- تأكد من أن البوت لديه صلاحية Manage Roles
- تأكد من صحة `DISCORD_GUILD_ID`
- تحقق من Role IDs في `ROLE_PLAN_MAP`

### CORS Error
- تأكد من صحة `WEBSITE_URL` في `.env`
- تأكد من أن Railway Backend يسمح بـ CORS

## الدعم
إذا واجهت مشاكل، تواصل مع الدعم في سيرفر Discord.
