export default function handler(req, res) {
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    const key = searchParams.get("key");

    if (!key) {
        return res.status(400).json({ valid: false, error: "No key provided" });
    }

    // قراءة المستخدمين من localStorage (محاكاة)
    // في موقعك الحقيقي، راح نستبدلها بقاعدة بيانات لاحقًا
    let users = global.usersDB || [];

    // البحث عن الكود داخل الطلبات
    let found = null;

    for (const user of users) {
        if (!user.orders) continue;

        const order = user.orders.find(o => o.key === key);
        if (order) {
            found = order;
            break;
        }
    }

    if (!found) {
        return res.status(200).json({ valid: false });
    }

    return res.status(200).json({
        valid: true,
        used: found.used
    });
}
