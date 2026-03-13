// قراءة ID من الرابط
const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

// عناصر الصفحة
const productImage = document.getElementById("productImage");
const productTitle = document.getElementById("productTitle");
const productDesc = document.getElementById("productDesc");
const productPrice = document.getElementById("productPrice");
const addToCartBtn = document.getElementById("addToCartBtn");

// التأكد أن بيانات المنتجات موجودة
if (typeof productsData === "undefined") {
    console.error("productsData غير موجود. تأكد من تحميل script.js قبل product.js");
}

// البحث عن المنتج
const product = productsData.find(p => p.id === productId);

// لو المنتج غير موجود
if (!product) {
    productTitle.textContent = "المنتج غير موجود";
    addToCartBtn.style.display = "none";
} else {

    // عرض بيانات المنتج
    productImage.src = product.image;
    productTitle.textContent = product.title;
    productDesc.textContent = product.desc;

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

    // لو المنتج قريبًا → أخفي زر السلة
    if (product.status === "soon") {
        addToCartBtn.style.display = "none";
    }

    // زر إضافة للسلة
    addToCartBtn.addEventListener("click", () => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existing = cart.find(p => p.id === product.id);

        if (existing) {
            existing.qty++;
        } else {
            cart.push({
                id: product.id,
                title: product.title,
                price: finalPrice,
                image: product.image,
                qty: 1
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        // رسالة التنبيه الجديدة
        showNiceAlert("تمت إضافة المنتج للسلة");
    });
}
