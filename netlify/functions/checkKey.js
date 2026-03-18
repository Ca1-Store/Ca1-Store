const { initializeApp } = require("firebase/app");
const { getFirestore, collection, query, where, getDocs } = require("firebase/firestore");

exports.handler = async (event) => {
    const userKey = event.queryStringParameters.key;

    if (!userKey) {
        return { statusCode: 400, body: "No key provided" };
    }

    const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const q = query(collection(db, "keys"), where("key", "==", userKey));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return { statusCode: 200, body: JSON.stringify({ valid: false }) };
    }

    const doc = snapshot.docs[0].data();

    if (doc.used === true) {
        return { statusCode: 200, body: JSON.stringify({ valid: false }) };
    }

    return { statusCode: 200, body: JSON.stringify({ valid: true }) };
};
