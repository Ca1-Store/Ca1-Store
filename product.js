// قراءة ID من الرابط
const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

// عناصر الصفحة
const productImage = document.getElementById("productImage");
const productTitle = document.getElementById("productTitle");
const productDesc = document.getElementById("productDesc");
const productPrice = document.getElementById("productPrice");

// التأكد أن بيانات المنتجات موجودة
if (typeof productsData === "undefined") {
    console.error("productsData غير موجود. تأكد من تحميل script.js قبل product.js");
}

// البحث عن المنتج
const product = productsData.find(p => p.id === productId);

// لو المنتج غير موجود
if (!product) {
    productTitle.textContent = "المنتج غير موجود";
} else {

    // عرض بيانات المنتج
    productImage.src = product.image;
    productTitle.textContent = product.title;
    productDesc.textContent = product.desc || "";

    /* ============================
       عرض السعر (يدعم الخصم تلقائياً)
    ============================ */

    if (product.oldPrice) {
        productPrice.innerHTML = `
            <span class="old-price">${product.oldPrice} ر.س</span>
            <span class="new-price">${product.price} ر.س</span>
        `;
    } else {
        productPrice.textContent =
            product.price === "قريبًا" ? "قريبًا" : product.price + " ر.س";
    }

    /* ============================
       زر شراء الآن (PayPal)
    ============================ */

    const buyNowBtn = document.getElementById("buyNowBtn");
    const notAvailable = document.getElementById("notAvailable");

    // إخفاء الجميع أولاً
    buyNowBtn.classList.add("hidden");
    notAvailable.classList.add("hidden");

    // المنتج غير متاح
    if (product.status === "soon" || !product.paypal) {
        notAvailable.classList.remove("hidden");
    } else {
        // المنتج متاح
        buyNowBtn.classList.remove("hidden");
        buyNowBtn.onclick = () => {
            const user = JSON.parse(localStorage.getItem("loggedUser") || "null");

            if (!user || !user.email) {
                if (typeof openLoginPopup === "function") {
                    openLoginPopup();
                } else {
                    window.location.href = "account.html";
                }
                return;
            }

            window.location.href = product.paypal;
        };
    }
}
