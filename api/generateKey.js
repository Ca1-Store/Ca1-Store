import { db } from "../lib/firebaseAdmin.js";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { key, product } = req.body;

    if (!key || !product) {
        return res.status(400).json({ error: "Missing key or product" });
    }

    try {
        await db.collection("keys").add({
            key,
            product,
            email: "",
            used: false,
            createdAt: new Date().toISOString()
        });

        return res.status(200).json({ success: true, key });

    } catch (error) {
        console.error("Error generating key:", error);
        return res.status(500).json({ success: false, error: "Server error" });
    }
}
