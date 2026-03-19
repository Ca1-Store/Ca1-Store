import { db } from "../lib/firebaseAdmin.js";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { key } = req.body;

    if (!key) {
        return res.status(400).json({ success: false, error: "No key provided" });
    }

    try {
        const keysRef = db.collection("keys");
        const snapshot = await keysRef.where("key", "==", key).get();

        if (snapshot.empty) {
            return res.status(200).json({ success: false, message: "Invalid key" });
        }

        const doc = snapshot.docs[0];
        const data = doc.data();

        // إذا الكود مستخدم مسبقًا
        if (data.used === true) {
            return res.status(200).json({
                success: false,
                message: "Key already used"
            });
        }

        // تحديث حالة الكود إلى مستخدم
        await doc.ref.update({
            used: true,
            usedAt: new Date().toISOString()
        });

        return res.status(200).json({
            success: true,
            message: "Key activated successfully",
            product: data.product
        });

    } catch (error) {
        console.error("Error using key:", error);
        return res.status(500).json({ success: false, error: "Server error" });
    }
}
