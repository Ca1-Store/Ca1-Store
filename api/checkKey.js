import { db } from "../lib/firebaseAdmin.js";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { key } = req.body;

    if (!key) {
        return res.status(400).json({ valid: false, error: "No key provided" });
    }

    try {
        const keysRef = db.collection("keys");
        const snapshot = await keysRef.where("key", "==", key).get();

        if (snapshot.empty) {
            return res.status(200).json({ valid: false, message: "Invalid key" });
        }

        const doc = snapshot.docs[0];
        const data = doc.data();

        if (data.used === true) {
            return res.status(200).json({ valid: false, message: "Key already used" });
        }

        return res.status(200).json({
            valid: true,
            email: data.email,
            product: data.product
        });

    } catch (error) {
        console.error("Error checking key:", error);
        return res.status(500).json({ error: "Server error" });
    }
}
