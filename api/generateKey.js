import { db } from "../lib/firebaseAdmin.js";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { orderId, product, email } = req.body;

    if (!orderId || !product || !email) {
        return res.status(400).json({ error: "Missing data" });
    }

    try {
        // توليد كود فريد
        const key = uuidv4();

        // حفظه في Firebase
        await db.collection("keys").add({
            key,
            orderId,
            product,
            email,
            used: false,
            createdAt: new Date().toISOString()
        });

        return res.status(200).json({ success: true, key });

    } catch (error) {
        console.error("Error generating key:", error);
        return res.status(500).json({ success: false, error: "Server error" });
    }
}
