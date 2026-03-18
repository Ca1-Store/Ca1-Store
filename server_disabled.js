const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
require("dotenv").config(); // تحميل متغيرات البيئة من ملف .env

const app = express();
app.use(cors());
app.use(express.json());

// مفتاح Stripe السري من متغيرات البيئة
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/* ============================================================
   1) Stripe Checkout Session
============================================================ */
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { cart, user } = req.body;

    const line_items = cart.map(item => ({
      price_data: {
        currency: "aed",
        product_data: {
          name: item.title,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: "http://localhost:5500/success.html",
      cancel_url: "http://localhost:5500/checkout.html",
      customer_email: user.email,
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Stripe Error" });
  }
});

/* ============================================================
   2) Stripe Payment Intent
============================================================ */
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { cart, user } = req.body;

    const amount = cart.reduce((total, item) => {
      return total + item.price * item.qty;
    }, 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "aed",
      metadata: {
        email: user?.email || "",
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Stripe Error" });
  }
});

/* ============================================================
   تشغيل السيرفر
============================================================ */
app.listen(4242, () => console.log("Stripe server running on port 4242"));
