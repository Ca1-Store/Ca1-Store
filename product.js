document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     SAFE LOGIN UI
  ========================= */
  const user = JSON.parse(localStorage.getItem("loggedUser") || "null");

  const signinBtn = document.getElementById("signinBtn");
  const profileIcon = document.getElementById("profileIcon");

  if (signinBtn && profileIcon) {
    if (user && user.email) {
      signinBtn.style.display = "none";
      profileIcon.style.display = "flex";
    } else {
      signinBtn.style.display = "block";
      profileIcon.style.display = "none";
    }
  }

  /* =========================
     GET ELEMENTS SAFELY
  ========================= */
  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get("id"));

  const productImage = document.getElementById("productImage");
  const productTitle = document.getElementById("productTitle");
  const productDesc = document.getElementById("productDesc");
  const productPrice = document.getElementById("productPrice");
  const buyNowBtn = document.getElementById("buyNowBtn");
  const addToCartBtn = document.getElementById("addToCartBtn");
  const notAvailable = document.getElementById("notAvailable");

  if (!productTitle || !productImage) return;

  if (typeof productsData === "undefined") {
    console.error("productsData غير موجود");
    productTitle.textContent = "خطأ في تحميل البيانات";
    return;
  }

  const product = productsData.find(p => p.id === productId);

  if (!product) {
    productTitle.textContent = "المنتج غير موجود";
    return;
  }

  /* =========================
     RENDER PRODUCT
  ========================= */
  productImage.src = product.image || "";
  productTitle.textContent = product.title || "";
  productDesc.textContent = product.desc || "";

  if (productPrice) {
    if (product.oldPrice) {
      productPrice.innerHTML = `
        <span class="old-price">${product.oldPrice} ر.س</span>
        <span class="new-price">${product.price} ر.س</span>
      `;
    } else {
      productPrice.textContent =
        product.price === "قريبًا" ? "قريبًا" : (product.price + " ر.س");
    }
  }

/* =========================
   BUY BUTTON SAFE
========================= */
if (buyNowBtn && notAvailable) {

  buyNowBtn.classList.add("hidden");
  notAvailable.classList.add("hidden");

  // الحالات اللي تمنع الشراء
  const unavailable =
    product.status === "soon" ||
    product.status === "out" ||
    product.status === "unavailable" ||
    product.stock === 0 ||
    !product.paypal;

  if (unavailable) {

    notAvailable.classList.remove("hidden");

    // النص حسب الحالة
    if (product.status === "soon") {
      notAvailable.textContent = "المنتج قريبًا";
    } else if (product.stock === 0 || product.status === "out") {
      notAvailable.textContent = "نفذت الكمية";
    } else {
      notAvailable.textContent = "المنتج غير متوفر";
    }

  } else {

    buyNowBtn.classList.remove("hidden");

    buyNowBtn.onclick = () => {

      const userCheck = JSON.parse(localStorage.getItem("loggedUser") || "null");

      if (!userCheck || !userCheck.email) {
        window.location.href = "account.html";
        return;
      }

      window.location.href = product.paypal;
    };
  }
}
  /* =========================
     ADD TO CART FIX (IMPORTANT)
  ========================= */
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {

      let cart = JSON.parse(localStorage.getItem("cart") || "[]");

      const exist = cart.find(i => i.id === product.id);

      if (exist) {
        exist.qty++;
      } else {
        cart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          qty: 1
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      if (typeof updateCartCount === "function") {
        updateCartCount();
      }

      const alertBox = document.getElementById("niceAlert");
      if (alertBox) {
        alertBox.textContent = "تمت إضافة المنتج للسلة";
        alertBox.style.display = "block";

        setTimeout(() => {
          alertBox.style.display = "none";
        }, 1500);
      }
    });
  }

  /* =========================
     REVIEWS SAFE
  ========================= */
  function loadProductReviews() {
    const wall = document.getElementById("productReviews");
    if (!wall) return;

    const reviews = JSON.parse(localStorage.getItem("castore_reviews") || "[]");

    const filtered = reviews.filter(r => r.product === product.title);

    if (!filtered.length) {
      wall.innerHTML = `<p style="opacity:0.6">لا توجد تقييمات لهذا المنتج</p>`;
      return;
    }

    wall.innerHTML = filtered.map(r => `
      <div class="review-card">
        <div>⭐ ${"★".repeat(r.rating)}</div>
        <p>${r.text}</p>
        <small>${r.name}</small>
      </div>
    `).join("");
  }

  loadProductReviews();
});