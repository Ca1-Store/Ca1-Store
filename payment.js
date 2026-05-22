document.addEventListener("DOMContentLoaded", () => {

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (!cart.length) {
        alert("السلة فارغة — لا يمكن إتمام الدفع");
        window.location.href = "checkout.html";
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    const usdRate = 0.27;
    const usdTotal = total * usdRate;

    const priceInfo = document.getElementById("priceInfo");
    const usdInfo   = document.getElementById("usdInfo");
    const loadingText = document.getElementById("loadingText");

    if (priceInfo) priceInfo.textContent = "المبلغ الإجمالي: " + total.toFixed(2) + " ريال";
    if (usdInfo)   usdInfo.textContent   = "≈ " + usdTotal.toFixed(2) + " USD";

    function generateRandomKey() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let key = "";
        for (let i = 0; i < 16; i++) {
            key += chars[Math.floor(Math.random() * chars.length)];
        }
        return key;
    }

    if (typeof paypal === "undefined") {
        if (loadingText) loadingText.textContent = "⚠️ تعذّر تحميل بوابة الدفع — تحقق من اتصالك أو أعد المحاولة.";
        return;
    }

    paypal.Buttons({

        style: {
            layout: "vertical",
            color:  "gold",
            shape:  "rect",
            label:  "paypal",
            height: 45
        },

        onInit: function() {
            if (loadingText) loadingText.style.display = "none";
        },

        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: usdTotal.toFixed(2),
                        currency_code: "USD"
                    }
                }]
            });
        },

        onApprove: function(data, actions) {
            return actions.order.capture().then(async function(details) {

                const item      = cart[0];
                const totalSAR  = item.price * item.qty;
                const generatedKey = generateRandomKey();

                fetch("https://script.google.com/macros/s/AKfycbxHB6W4H8ZAh2pkQz60BgEVA8rhRIM0KWlIf-YxkJGijArc9pNEeCsD4Pmfh3i8R5THuQ/exec", {
                    method: "POST",
                    body: JSON.stringify({
                        orderId:       data.orderID,
                        product:       item.title,
                        price:         item.price,
                        qty:           item.qty,
                        total:         totalSAR,
                        email:         details.payer.email_address,
                        transactionId: details.id
                    })
                });

                const orderEntry = {
                    id:          data.orderID,
                    productName: item.title,
                    date:        new Date().toLocaleString("ar-SA"),
                    amount:      totalSAR + " ريال",
                    code:        generatedKey,
                    qty:         item.qty,
                    email:       details.payer.email_address,
                    transactionId: details.id
                };

                localStorage.setItem("invoice", JSON.stringify(orderEntry));

                let user = JSON.parse(localStorage.getItem("loggedUser") || "{}");
                if (!user.orders) user.orders = [];
                user.orders.push(orderEntry);
                localStorage.setItem("loggedUser", JSON.stringify(user));

                const ordersKey = "orders_" + (user.email || details.payer.email_address || "guest");
                const existing  = JSON.parse(localStorage.getItem(ordersKey) || "[]");
                existing.push(orderEntry);
                localStorage.setItem(ordersKey, JSON.stringify(existing));

                localStorage.removeItem("cart");
                window.location.href = "success.html";
            });
        },

        onError: function(err) {
            console.error("PayPal error", err);
            if (loadingText) {
                loadingText.style.display = "block";
                loadingText.textContent = "⚠️ حدث خطأ أثناء الدفع — يرجى المحاولة مجدداً.";
            }
        }

    }).render("#paypal-button-container");
});
