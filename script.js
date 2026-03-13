/* ============================
   بيانات المنتجات
============================ */

const productsData = [
    {
        id: 1,
        title: "جرافيكس فايف ام | 𝐂𝐚-𝟏-𝐏𝐚𝐜𝐤",
        desc: "جرافيكس مخصص للفايتات يضمن بيئة لعب احترافية خالية من الدروبات والتقطيع - مناسب للاجهزة المتوسطة والضعيفة - الوضع النهاري بجميع اوقات اللعبه لضمان رؤية واضحة",
        price: 24.99,
        image: "a.png",
        category: "fivem",
        status: "available"
    },
    {
        id: 2,
        title: "جرافيكس فايف ام | 𝐂𝐚-𝟐",
        desc: "قريبًا",
        price: "قريبًا",
        image: "cms.avif",
        category: "fivem",
        status: "soon"
    },
    {
        id: 3,
        title: " اعادة تركيب",
        price: "8.99",
        image: "RE.png",
        category: "fivem",
        status: "soon"
    },
    {
        id: 4,
        title: "Coming Soon",
        desc: "قريبًا",
        price: "0.0",
        image: "cms.avif",
        category: "discord",
        status: "soon"
    },
    {
        id: 5,
        title: "Coming Soon",
        desc: "قريبًا",
        price: "0.0",
        image: "cms.avif",
        category: "discord",
        status: "soon"
    },
    {
        id: 6,
        title: "Coming Soon",
        desc: "قريبًا",
        price: "0.0",
        image: "cms.avif",
        category: "discord",
        status: "soon"
    }
];

/* ============================
   دالة إنشاء بطاقة المنتج
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
    if (p.id === 1) {
        priceHTML = `
            <span class="old-price">33.99 ر.س</span>
            <span class="new-price">24.99 ر.س</span>
        `;
    } else {
        priceHTML = p.price === "قريبًا" ? "قريبًا" : p.price + " ر.س";
    }

    card.innerHTML = `
        <div class="product-image-box">
            <img src="${p.image}">
            ${p.status === "soon" ? `<span class="soon-badge">قريبًا</span>` : ""}
            ${p.id === 1 ? `<span class="discount-badge">خصم</span>` : ""}
        </div>

        <h3>${p.title}</h3>
        <p class="price">${priceHTML}</p>

        ${
            p.status === "available"
            ? `<button class="add-to-cart"
                    data-id="${p.id}"
                    data-title="${p.title}"
                    data-price="${p.price}"
                    data-image="${p.image}">إضافة للسلة</button>`
            : ""
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
   تفعيل زر إضافة للسلة
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
   رسالة التنبيه
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
   السلة
============================ */

const cartIcon = document.querySelector(".cart-icon");

if (cartIcon) {
    cartIcon.addEventListener("click", () => {
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
   البحث — فتح وإغلاق
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

/* ============================
   البحث — تصفية المنتجات
============================ */

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
   تسجيل الدخول
============================ */

const profileIcon = document.querySelector(".profile-icon");

if (profileIcon) {
    profileIcon.addEventListener("click", () => {
        const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "null");

        if (loggedUser) {
            window.location.href = "profile.html";
        } else {
            window.location.href = "account.html";
        }
    });
}

/* ============================
   EmailJS + خطوات تسجيل الدخول
============================ */

const loginPopup = document.querySelector(".login-popup");
const closeLogin = document.querySelector(".close-login");

const stepEmail = document.getElementById("accStepEmail");
const stepCode = document.getElementById("accStepCode");
const stepSignup = document.getElementById("accStepSignup");

if (closeLogin && loginPopup) {
    closeLogin.addEventListener("click", () => {
        loginPopup.style.display = "none";
    });
}

/* ============================
   إرسال رمز التحقق
============================ */

const sendCodeBtn = document.getElementById("accSendCode");
const verifyCodeBtn = document.getElementById("accVerifyBtn");
const createAccountBtn = document.getElementById("accCreateAccount");

let tempEmail = "";
let tempCode = "";

if (sendCodeBtn) {
    sendCodeBtn.addEventListener("click", async () => {
        const emailInput = document.getElementById("accEmail");
        if (!emailInput) return;

        const email = emailInput.value.trim();
        if (!email) return alert("الرجاء إدخال البريد الإلكتروني");

        tempEmail = email;
        tempCode = String(Math.floor(100000 + Math.random() * 900000));

        try {
            await emailjs.send("service_hy5xrr2", "template_9io3rt8", {
                to_email: tempEmail,
                code: tempCode
            });

            showNiceAlert("تم إرسال رمز التحقق! الرجاء فحص بريدك.");

            fade(stepEmail, stepCode);

        } catch (err) {
            console.error(err);
            alert("فشل إرسال الرمز");
        }
    });
}

/* ============================
   التحقق من الرمز
============================ */

if (verifyCodeBtn) {
    verifyCodeBtn.addEventListener("click", () => {
        const codeInput = document.getElementById("accVerifyCode");
        if (!codeInput) return;

        const code = codeInput.value.trim();

        if (code !== tempCode) return alert("رمز التحقق غير صحيح");

        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const existing = users.find(u => u.email === tempEmail);

        if (existing) {
            localStorage.setItem("loggedUser", JSON.stringify(existing));
            alert("تم تسجيل الدخول بنجاح");

            const redirect = localStorage.getItem("redirectAfterLogin");
            if (redirect === "checkout") {
                localStorage.removeItem("redirectAfterLogin");
                window.location.href = "checkout.html";
            }

        } else {
            fade(stepCode, stepSignup);
        }
    });
}

/* ============================
   إنشاء حساب
============================ */

if (createAccountBtn) {
    createAccountBtn.addEventListener("click", () => {
        const first = document.getElementById("accFirst").value.trim();
        const last = document.getElementById("accLast").value.trim();
        const phone = document.getElementById("accPhone").value.trim();

        if (first.length < 2) {
            alert("الاسم الأول يجب أن يكون حرفين على الأقل");
            return;
        }

        if (last.length < 2) {
            alert("الاسم الأخير يجب أن يكون حرفين على الأقل");
            return;
        }

        if (!/^[0-9]{9,15}$/.test(phone)) {
            alert("رقم الجوال غير صحيح. يجب أن يكون من 9 إلى 15 رقمًا.");
            return;
        }

        const users = JSON.parse(localStorage.getItem("users") || "[]");

        const exists = users.find(u => u.email === tempEmail);
        if (exists) {
            alert("يوجد حساب مسجل بهذا البريد مسبقًا");
            return;
        }

        const newUser = {
            email: tempEmail,
            first,
            last,
            phone
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("loggedUser", JSON.stringify(newUser));

        alert("تم إنشاء الحساب وتسجيل الدخول بنجاح");

        const redirect = localStorage.getItem("redirectAfterLogin");
        if (redirect === "checkout") {
            localStorage.removeItem("redirectAfterLogin");
            window.location.href = "checkout.html";
        }
    });
}

/* ============================
   تأثير Fade
============================ */

function fade(hideEl, showEl) {
    hideEl.style.opacity = 1;
    hideEl.style.transition = "opacity .3s";
    hideEl.style.opacity = 0;

    setTimeout(() => {
        hideEl.style.display = "none";
        showEl.style.display = "block";
        showEl.style.opacity = 0;
        showEl.style.transition = "opacity .3s";
        setTimeout(() => showEl.style.opacity = 1, 10);
    }, 300);
}
function showAlert(message, type = "success") {
    const alertBox = document.getElementById("niceAlert");

    alertBox.innerHTML = `
        ${type === "success" ? "✔" : type === "error" ? "⚠" : "ℹ"} 
        ${message}
    `;

    alertBox.className = "nice-alert " + (type === "error" ? "error" : type === "info" ? "info" : "");
    alertBox.classList.add("show");

    setTimeout(() => {
        alertBox.classList.remove("show");
    }, 2500);
}
