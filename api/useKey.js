export default function handler(req, res) {
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    const key = searchParams.get("key");

    if (!key) {
        return res.status(400).json({ success: false, error: "No key provided" });
    }

    // قاعدة بيانات مؤقتة (محاكاة)
    let users = global.usersDB || [];

    for (const user of users) {
        if (!user.orders) continue;

        const order = user.orders.find(o => o.key === key);
        if (order) {
            order.used = true;
            return res.status(200).json({ success: true });
        }
    }

    return res.status(200).json({ success: false });
}
