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

    // السعر الجديد للمنتج رقم 1
    let finalPrice = product.price;

    if (product.id === 1) {
        productPrice.innerHTML = `
            <span class="old-price">34.99 ر.س</span>
            <span class="new-price">24.99 ر.س</span>
        `;
        finalPrice = 24.99;
    } else {
        productPrice.textContent =
            product.price === "قريبًا" ? "قريبًا" : product.price + " ر.س";
    }

    /* ============================
       زر شراء الآن (PayPal)
    ============================ */

    const paypal1 = document.getElementById("paypal1");
    const paypal3 = document.getElementById("paypal3");
    const notAvailable = document.getElementById("notAvailable");

    // إخفاء الجميع أولاً
    paypal1.classList.add("hidden");
    paypal3.classList.add("hidden");
    notAvailable.classList.add("hidden");

    if (product.status === "soon") {
        notAvailable.classList.remove("hidden");
    } else {
        if (product.id === 1) {
            paypal1.classList.remove("hidden");
        } else if (product.id === 3) {
            paypal3.classList.remove("hidden");
        } else {
            notAvailable.classList.remove("hidden");
        }
    }
}
