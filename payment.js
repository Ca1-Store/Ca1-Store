document.addEventListener("DOMContentLoaded", () => {

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (!cart.length) {
        alert("السلة فارغة — لا يمكن إتمام الدفع");
        window.location.href = "checkout.html";
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    // تحويل الريال السعودي إلى دولار
    const usdRate = 0.27; // 1 SAR ≈ 0.27 USD
    const usdTotal = total * usdRate;

    const loadingText = document.getElementById("loadingText");

    paypal.Buttons({

        style: {
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal",
            height: 45
        },

        onInit: function() {
            loadingText.style.display = "none";
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
            return actions.order.capture().then(function(details) {

                const item = cart[0];
                const totalSAR = item.price * item.qty;

                /* ============================================================
                   1) إرسال الفاتورة إلى Google Sheets
                ============================================================ */
                fetch("https://script.google.com/macros/s/AKfycbxHB6W4H8ZAh2pkQz60BgEVA8rhRIM0KWlIf-YxkJGijArc9pNEeCsD4Pmfh3i8R5THuQ/exec", {
                    method: "POST",
                    body: JSON.stringify({
                        orderId: data.orderID,
                        product: item.title,
                        price: item.price,
                        qty: item.qty,
                        total: totalSAR,
                        email: details.payer.email_address,
                        transactionId: details.id
                    })
                });

                /* ============================================================
                   2) حفظ بيانات الفاتورة لصفحة success.html
                ============================================================ */
                localStorage.setItem("invoice", JSON.stringify({
                    orderId: data.orderID,
                    product: item.title,
                    price: item.price,
                    qty: item.qty,
                    total: totalSAR,
                    email: details.payer.email_address,
                    transactionId: details.id
                }));

                /* ============================================================
                   3) تفريغ السلة + الانتقال لصفحة النجاح
                ============================================================ */
                localStorage.removeItem("cart");
                window.location.href = "success.html";
            });
        }

    }).render('#paypal-button-container');
});

console.log("TOTAL (SAR) =", total);
console.log("TOTAL (USD) =", usdTotal);
