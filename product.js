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

    const paypalBtn = document.getElementById("paypalBtn");
    const notAvailable = document.getElementById("notAvailable");

    // إخفاء الجميع أولاً
    paypalBtn.classList.add("hidden");
    notAvailable.classList.add("hidden");

    if (product.status === "soon") {
        notAvailable.classList.remove("hidden");
    } else {
        if (product.paypal) {
            paypalBtn.href = product.paypal;
            paypalBtn.classList.remove("hidden");
        } else {
            notAvailable.classList.remove("hidden");
        }
    }
}
