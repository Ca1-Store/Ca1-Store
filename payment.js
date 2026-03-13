/* ============================================================
   Stripe Elements — تهيئة
============================================================ */

// ضع هنا الـ Publishable Key من Stripe
const stripe = Stripe("pk_test_51TA3DsFf2eMMaCqvdp0Yt8pYy0u8tZJt8lYq0G2z8tQFQ9VY8x8Gm7Jv0n2Z2x0t8m9Q8g9X9t8x0G2z8tQFQ9VY8x8Gm7Jv0n2Z2x0");

// إنشاء عناصر Stripe
const elements = stripe.elements();

// تصميم حقل البطاقة
const cardElement = elements.create("card", {
    style: {
        base: {
            color: "#ffffff",
            fontFamily: '"IBM Plex Sans Arabic", sans-serif',
            fontSize: "16px",
            "::placeholder": { color: "#bbbbbb" }
        },
        invalid: { color: "#ff5252" }
    }
});

// تركيب الحقل داخل الصفحة
cardElement.mount("#card-element");


/* ============================================================
   عناصر الصفحة
============================================================ */

const form = document.getElementById("payment-form");
const messageDiv = document.getElementById("payment-message");
const submitButton = document.getElementById("submit-button");


/* ============================================================
   جلب السلة والمستخدم
============================================================ */

const cart = JSON.parse(localStorage.getItem("cart")) || [];
const user = JSON.parse(localStorage.getItem("loggedUser") || "null");

if (!cart.length) {
    messageDiv.textContent = "السلة فارغة — لا يمكن إتمام الدفع";
    messageDiv.style.color = "#ff5252";
}

if (!user) {
    messageDiv.textContent = "يجب تسجيل الدخول قبل الدفع";
    messageDiv.style.color = "#ff5252";
}


/* ============================================================
   تنفيذ الدفع
============================================================ */

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = "جاري المعالجة...";

    try {
        /* ---------------------------------------------
           1) إرسال السلة والمستخدم للسيرفر
        --------------------------------------------- */
        const res = await fetch("http://localhost:4242/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart, user })
        });

        const data = await res.json();

        if (!data.clientSecret) {
            throw new Error("لم يتم استلام client_secret من السيرفر");
        }

        /* ---------------------------------------------
           2) تنفيذ الدفع عبر Stripe Elements
        --------------------------------------------- */
        const result = await stripe.confirmCardPayment(data.clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    email: user.email
                }
            }
        });

        /* ---------------------------------------------
           3) فشل الدفع
        --------------------------------------------- */
        if (result.error) {
            messageDiv.textContent = "فشل الدفع: " + result.error.message;
            messageDiv.style.color = "#ff5252";
            submitButton.disabled = false;
            submitButton.textContent = "ادفع الآن";
            return;
        }

        /* ---------------------------------------------
           4) نجاح الدفع
        --------------------------------------------- */
        if (result.paymentIntent.status === "succeeded") {
            messageDiv.textContent = "تم الدفع بنجاح! سيتم تحويلك الآن...";
            messageDiv.style.color = "#4CAF50";

            // تفريغ السلة
            localStorage.removeItem("cart");

            // تحويل لصفحة النجاح
            setTimeout(() => {
                window.location.href = "success.html";
            }, 1500);
        }

    } catch (err) {
        console.error(err);
        messageDiv.textContent = "حدث خطأ أثناء الاتصال بالسيرفر";
        messageDiv.style.color = "#ff5252";
    }

    submitButton.disabled = false;
    submitButton.textContent = "ادفع الآن";
});
