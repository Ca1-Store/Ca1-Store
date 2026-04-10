/* ============================
   بيانات المنتجات
============================ */

const productsData = [
{
    id: 1,
    title: "جرافيكس فايف ام | 𝐂𝐚-𝟏-𝐏𝐚𝐜𝐤",
    desc: `CA-1 PACK نسخة

جرافيكس مخصص للفايتات مع لمسة واقعية جميلة.

اضاءة نهارية في جميع اوقات اللعبة لرؤية واضحة

سماء الشفق (Aurora) بمظهر خيالي وجذاب

قائمة تحكم كاملة لتعديل لون الشجر ولون البحر، مع تحكم شامل بالسماء (ألوان + غيوم)

فلتر SSR احترافي مناسب للتصوير وللعب

كيل افيكت Killeffect

تأثيرات دماء بعد الدمج

تخفيف سطوع الشمس لراحة أفضل للعين وتوازن بصري أجمل

إمكانية تغيير الطقس إلى ثلج للتصوير

فلتر البلور للتصوير

بعد شرائك المنتج بادر بفتح تذكرة بسيرفر الديسكورد.`,
    price: 29.99,
    image: "CA-1 (2).png",
    category: "fivem",
    status: "available",
    paypal: "https://www.paypal.com/ncp/payment/28Q47CF3QFH5L"
    },

{
    id: 2,
    title: "جرافيكس فايف ام | 𝐂𝐚-𝟐-𝐏𝐚𝐜𝐤",
    desc: `CA-2 PACK الإصدار الجديد

تجربة جرافيكس مطوّرة بالكامل، مصممة للفايتات والتصوير الاحترافي، مع تحسينات بصرية عميقة تعطيك واقعية أعلى وثبات أفضل داخل اللعبة.

🔹 10 فلاتر جاهزة بتدرجات مختلفة  
🔹 إضاءة نهارية محسّنة وواضحة  
🔹 سماء ديناميكية مع تأثيرات Aurora & Galaxy  
🔹 تحكم كامل بالألوان (الشجر – البحر – السماء – الغيوم – الشوارع)  
🔹 فلتر SSR مطوّر  
🔹 Killeffect محسّن  
🔹 تأثيرات مطر على الشاشة والسيارة  
🔹 تأثيرات دماء واقعية  
🔹 فلتر خاص للفايتات الليلية  
🔹 فلتر Blur احترافي  
🔹 إمكانية تغيير الطقس إلى ثلج  

بعد الشراء افتح تذكرة في سيرفر الديسكورد.`,
    price: 44.99,
    oldPrice: 64.99,
    image: "combined_image_small.png",
    category: "fivem",
    status: "available",
    paypal: "https://www.paypal.com/ncp/payment/BQV36TDMKEZZS"
    },

    {
        id: 3,
        title: "اعادة تركيب",
        price: "9.99",
        image: "Copilot_20260330_010158.png",
        category: "fivem",
        status: "available",
        paypal: "https://www.paypal.com/ncp/payment/7L3HS223L8RVC"
    },

    /* ============================
       🔥 منتج ChatGPT Plus (خصم من 70 → 21.99)
       وتم نقله لقسم الاشتراكات
    ============================= */

    {
        id: 4,
        title: "ChatGPT Plus – اشتراك شهر واحد",
        desc: "اشتراك رسمي لمدة شهر – تفعيل فوري",
        price: 21.99,
        oldPrice: 70.00, // السعر قبل الخصم
        image: "cg.png",
        category: "subscriptions",
        status: "available",
        paypal: "ضع رابط الدفع هنا"
    },

    /* ============================
       باقي منتجات الديسكورد كما هي
    ============================= */

{
    id: 5,
    title: "Nitro Gaming – 1 month",
    desc: "هذا المنتج غير متوفر حاليًا",
    price: "نفذت الكمية",
    image: "Nitro.png",
    category: "discord",
    status: "out_of_stock",
    paypal: null
},

    {
        id: 6,
        title: "Coming Soon",
        desc: "قريبًا",
        price: "0.0",
        image: "cms.avif",
        category: "discord",
        status: "soon",
        paypal: null
    }
];

/* ============================
   إنشاء بطاقة المنتج
============================ */

function createProductCard(p) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.category = p.category;

    if (p.status === "soon") {
        card.classList.add("soon");
    } else {
        card.addEventListener("click", () => {
            window.location.href = `product.html?id=${p.id}`;
        });
    }

    let priceHTML = "";

    // خصم المنتج الجديد (ChatGPT Plus)
    if (p.oldPrice) {
        priceHTML = `
            <span class="old-price">${p.oldPrice} ر.س</span>
            <span class="new-price">${p.price} ر.س</span>
        `;
    }
else {
    if (p.status === "out_of_stock") {
        priceHTML = "نفذت الكمية";
    } else if (p.status === "soon") {
        priceHTML = "قريبًا";
    } else {
        priceHTML = p.price + " ر.س";
    }
}

    card.innerHTML = `
        <div class="product-image-box">
            <img src="${p.image}">
            ${p.status === "soon" ? `<span class="soon-badge">قريبًا</span>` : ""}
            ${p.oldPrice ? `<span class="discount-badge">خصم</span>` : ""}
        </div>

        <h3>${p.title}</h3>
        <p class="price">${priceHTML}</p>

        ${
            p.status === "available"
            ? `
                <button class="add-to-cart"
                    data-id="${p.id}"
                    data-title="${p.title}"
                    data-price="${p.price}"
                    data-image="${p.image}">
                    إضافة للسلة
                </button>

                <button class="buy-now-btn"
                    onclick="event.stopPropagation(); buyNow(${p.id});">
                    شراء الآن
                </button>
            `
            : `
                <button class="buy-now-btn disabled" disabled>شراء الآن</button>
            `
        }
    `;

    return card;
}

/* ============================
   عرض المنتجات
============================ */

const productsGrid = document.getElementById("productsGrid");

if (productsGrid) {
    productsGrid.innerHTML = "";

    if (!window.location.search.includes("cat=")) {
        productsData.forEach(p => {
            const card = createProductCard(p);
            productsGrid.appendChild(card);
        });
    }

    activateAddToCartButtons();
}

/* ============================
   شراء الآن — حماية تسجيل الدخول
============================ */

function buyNow(id) {
    const user = JSON.parse(localStorage.getItem("loggedUser") || "null");

    if (!user || !user.email) {
        window.location.href = "account.html";
        return;
    }

    const product = productsData.find(p => p.id === id);
    if (!product || !product.paypal) return;

    window.location.href = product.paypal;
}

/* ============================
   إضافة للسلة
============================ */

function activateAddToCartButtons() {
    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();

            const id = Number(btn.dataset.id);
            const title = btn.dataset.title;
            const price = Number(btn.dataset.price);
            const image = btn.dataset.image;

            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            const existing = cart.find(p => p.id === id);

            if (existing) {
                existing.qty++;
            } else {
                cart.push({
                    id,
                    title,
                    price,
                    image,
                    qty: 1
                });
            }

            localStorage.setItem("cart", JSON.stringify(cart));

            showNiceAlert("تمت إضافة المنتج للسلة");
            updateCartCount();
        });
    });
}

/* ============================
   تنبيه
============================ */

function showNiceAlert(message) {
    const alertBox = document.getElementById("niceAlert");
    if (!alertBox) return;

    alertBox.textContent = message;
    alertBox.classList.add("show");

    setTimeout(() => {
        alertBox.classList.remove("show");
    }, 2000);
}

/* ============================
   السلة — حماية تسجيل الدخول
============================ */

const cartIcon = document.querySelector(".cart-icon");

if (cartIcon) {
    cartIcon.addEventListener("click", () => {
        const user = JSON.parse(localStorage.getItem("loggedUser") || "null");

        if (!user || !user.email) {
            window.location.href = "account.html";
            return;
        }

        window.location.href = "checkout.html";
    });
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.reduce((sum, item) => sum + item.qty, 0);

    const cartCount = document.querySelector(".cart-count") || document.getElementById("cartCount");
    if (cartCount) cartCount.textContent = count;
}

updateCartCount();

/* ============================
   البحث
============================ */

const searchIcon = document.querySelector(".search-icon");
const headerEl = document.querySelector("header");
const searchBox = document.querySelector(".search-box");
const searchInput = document.getElementById("searchInput");

if (searchIcon && headerEl && searchBox) {
    searchIcon.addEventListener("click", () => {
        headerEl.classList.toggle("search-open");

        if (headerEl.classList.contains("search-open")) {
            searchInput.focus();
        } else {
            searchInput.value = "";
            filterProducts("");
        }
    });

    document.addEventListener("click", (e) => {
        if (
            headerEl.classList.contains("search-open") &&
            !searchBox.contains(e.target) &&
            !searchIcon.contains(e.target)
        ) {
            headerEl.classList.remove("search-open");
            searchInput.value = "";
            filterProducts("");
        }
    });
}

function filterProducts(query) {
    if (!productsGrid) return;

    const cards = productsGrid.querySelectorAll(".product-card");
    const q = query.trim().toLowerCase();

    cards.forEach(card => {
        const title = card.querySelector("h3").textContent.toLowerCase();
        card.style.display = title.includes(q) ? "" : "none";
    });
}

if (searchInput) {
    searchInput.addEventListener("input", () => {
        filterProducts(searchInput.value);
    });
}

/* ============================
   قائمة الملف الشخصي المنسدلة
============================ */

const profileIcon = document.getElementById("profileIcon");
const profileDropdown = document.getElementById("profileDropdown");

if (profileIcon) {
    profileIcon.addEventListener("click", () => {
        const user = JSON.parse(localStorage.getItem("loggedUser") || "null");

        if (!user) {
            window.location.href = "account.html";
            return;
        }

        profileDropdown.classList.toggle("show");
    });
}

document.addEventListener("click", (e) => {
    if (!profileIcon.contains(e.target) && !profileDropdown.contains(e.target)) {
        profileDropdown.classList.remove("show");
    }
});

/* ============================
   القائمة الجانبية العامة
============================ */

const sideMenu = document.getElementById("sideMenu");
const sideMenuBtn = document.getElementById("sideMenuBtn");

sideMenuBtn.addEventListener("click", () => {
    sideMenu.classList.toggle("open");
    sideMenuBtn.classList.toggle("hidden");
});

document.addEventListener("click", (e) => {
    if (!sideMenu.contains(e.target) && !sideMenuBtn.contains(e.target)) {
        sideMenu.classList.remove("open");
        sideMenuBtn.classList.remove("hidden");
    }
});

/* ============================
   تأثير Scroll على الهيدر
============================ */

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        document.querySelector("header").classList.add("scrolled");
    } else {
        document.querySelector("header").classList.remove("scrolled");
    }
});

/* ============================
   التنقل
============================ */

function goOrders() {
    window.location.href = "orders.html";
}

function openSettings() {
    window.location.href = "settings.html";
}

function logout() {
    localStorage.removeItem("loggedUser");
    sessionStorage.clear();
    window.location.href = "account.html";
}
/* ============================
   الفلاتر
============================ */

const filterCategory = document.getElementById("filterCategory");
const filterPrice = document.getElementById("filterPrice");
const filterStatus = document.getElementById("filterStatus");

function applyFilters() {
    if (!productsGrid) return;

    let filtered = [...productsData];

    // فلتر القسم
    if (filterCategory && filterCategory.value !== "all") {
        filtered = filtered.filter(p => p.category === filterCategory.value);
    }

    // فلتر السعر
    if (filterPrice && filterPrice.value !== "all") {
        if (filterPrice.value === "low") {
            filtered = filtered.filter(p => Number(p.price) < 20);
        }
        if (filterPrice.value === "mid") {
            filtered = filtered.filter(p => Number(p.price) >= 20 && Number(p.price) <= 50);
        }
        if (filterPrice.value === "high") {
            filtered = filtered.filter(p => Number(p.price) > 50);
        }
    }

    // فلتر الحالة
    if (filterStatus && filterStatus.value !== "all") {
        filtered = filtered.filter(p => p.status === filterStatus.value);
    }

    // إعادة عرض المنتجات
    productsGrid.innerHTML = "";
    filtered.forEach(p => {
        const card = createProductCard(p);
        productsGrid.appendChild(card);
    });

    activateAddToCartButtons();
}

// تشغيل الفلاتر عند التغيير
if (filterCategory) filterCategory.addEventListener("change", applyFilters);
if (filterPrice) filterPrice.addEventListener("change", applyFilters);
if (filterStatus) filterStatus.addEventListener("change", applyFilters);

// تشغيل الفلاتر عند فتح الصفحة إذا كان هناك cat في الرابط
const urlParams = new URLSearchParams(window.location.search);
const catParam = urlParams.get("cat");

if (catParam && filterCategory) {
    filterCategory.value = catParam;
    applyFilters();
}
