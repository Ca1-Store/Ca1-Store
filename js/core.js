/* ===== CA Store — core ===== */
(function () {
    const C = window.CA_CONFIG;
    const TK = "ca_token";
    const IC = {
        home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
        bag: '<path d="M6 7h12l1 13H5z"/><path d="M9 7a3 3 0 0 1 6 0"/>',
        star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
        user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
        logout: '<path d="M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
        shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
        check: '<path d="M5 12l5 5L20 7"/>',
        x: '<path d="M6 6l12 12M18 6L6 18"/>',
        menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
        search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
        chev: '<path d="M6 9l6 6 6-6"/>',
        arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
        bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
        lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
        ticket: '<path d="M3 9a2 2 0 0 0 0 6v3h18v-3a2 2 0 0 1 0-6V6H3z"/><path d="M14 6v12" stroke-dasharray="2 3"/>',
        chat: '<path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.5A8 8 0 1 1 21 12z"/>',
        heart: '<path d="M12 20s-7-4.4-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.6-9 9-9 9z"/>',
        gamepad: '<rect x="3" y="7" width="18" height="11" rx="4"/><path d="M8 10v5M5.5 12.5h5M15.5 11.5h.01M18 13.5h.01"/>',
        card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/>',
        bot: '<rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01"/>',
        sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/>',
        plus: '<path d="M12 5v14M5 12h14"/>',
        trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
        edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
        up: '<path d="M6 15l6-6 6 6"/>', down: '<path d="M6 9l6 6 6-6"/>',
        eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
        link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
        chart: '<path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6"/>',
        info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
        discord: '<path d="M7 7.5c3-1.3 7-1.3 10 0 1.6 2.3 2.6 5 2.8 8.3-1.4 1.2-3 1.8-4.5 2.1l-.9-1.6c.5-.2 1-.4 1.4-.7-2.5 1-5.3 1-7.8 0 .4.3.9.5 1.4.7l-.9 1.6c-1.5-.3-3.1-.9-4.5-2.1.2-3.3 1.2-6 2.8-8.3z"/><circle cx="9.5" cy="12.5" r="1"/><circle cx="14.5" cy="12.5" r="1"/>',
        refresh: '<path d="M20 11a8 8 0 0 0-14-4L4 9M4 4v5h5M4 13a8 8 0 0 0 14 4l2-2M20 20v-5h-5"/>',
        money: '<circle cx="12" cy="12" r="9"/><path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.5 0-2.500 1-2.500 2s1 1.500 2.500 2 2.500 1 2.500 2-1 2-2.500 2c-1 0-2-.5-2.500-1.500M12 6.500V8M12 16v1.500"/>',
        users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0"/><path d="M16 4.500a3.500 3.500 0 0 1 0 7M18 14a7 7 0 0 1 4 6"/>'
    };
    const icon = (n, c = "") => `<svg class="i ${c}" viewBox="0 0 24 24" aria-hidden="true">${IC[n] || ""}</svg>`;
    const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];

    /* ---------- storage ---------- */
    const store = {
        get(k) { try { return localStorage.getItem(k); } catch { return null; } },
        set(k, v) { try { localStorage.setItem(k, v); } catch {} },
        del(k) { try { localStorage.removeItem(k); } catch {} }
    };

    /* ---------- api ---------- */
    async function api(path, opt = {}) {
        const headers = { "Content-Type": "application/json" };
        const t = store.get(TK); if (t) headers.Authorization = "Bearer " + t;
        let res;
        try {
            res = await fetch(C.API + path, { method: opt.method || "GET", headers, body: opt.body ? JSON.stringify(opt.body) : undefined });
        } catch { throw new Error("تعذّر الاتصال بالخادم، تحقق من اتصالك بالإنترنت"); }
        let data = {}; try { data = await res.json(); } catch {}
        if (res.status === 401 && t) { store.del(TK); auth.user = null; }
        if (!res.ok || data.success === false) { const e = new Error(data.message || "حدث خطأ غير متوقع"); e.status = res.status; e.code = data.code; throw e; }
        return data;
    }

    /* ---------- auth ---------- */
    const auth = {
        user: null,
        get token() { return store.get(TK); },
        async load() {
            if (!this.token) return null;
            try { const d = await api("/api/store/me"); this.user = d; } catch { this.user = null; }
            return this.user;
        },
        async login(back) {
            store.set("ca_back", back || location.pathname.split("/").pop() + location.search);
            try {
                const redirect = location.origin + location.pathname.replace(/[^/]*$/, "") + "auth-callback.html";
                const d = await fetch(C.API + "/auth/web/url?redirect_uri=" + encodeURIComponent(redirect)).then(r => r.json());
                location.href = d.url;
            } catch { toast("تعذّر بدء تسجيل الدخول", "err"); }
        },
        logout() { store.del(TK); this.user = null; location.href = "index.html"; }
    };

    /* ---------- ui ---------- */
    function toast(msg, type = "ok") {
        let box = $(".toasts"); if (!box) { box = document.createElement("div"); box.className = "toasts"; document.body.appendChild(box); }
        const el = document.createElement("div"); el.className = "toast " + type;
        el.innerHTML = icon(type === "ok" ? "check" : "info") + `<span>${esc(msg)}</span>`;
        box.appendChild(el);
        setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 300); }, 3600);
    }
    function modal(html, onMount) {
        const ov = document.createElement("div"); ov.className = "overlay";
        ov.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
        const close = () => { ov.remove(); document.removeEventListener("keydown", esc_); };
        const esc_ = e => { if (e.key === "Escape") close(); };
        ov.addEventListener("mousedown", e => { if (e.target === ov) close(); });
        document.addEventListener("keydown", esc_);
        document.body.appendChild(ov); onMount && onMount(ov, close); return { el: ov, close };
    }
    function confirmBox(title, text, okLabel = "تأكيد", danger = true) {
        return new Promise(res => {
            modal(`<h3>${esc(title)}</h3><p>${esc(text)}</p><div class="modal-actions"><button class="btn ${danger ? "btn-danger" : "btn-primary"}" data-act="yes">${esc(okLabel)}</button><button class="btn" data-act="no">إلغاء</button></div>`, (ov, close) => {
                ov.addEventListener("click", e => { const b = e.target.closest("[data-act]"); if (!b) return; close(); res(b.dataset.act === "yes"); });
                ov.addEventListener("mousedown", e => { if (e.target === ov) res(false); });
            });
        });
    }
    const stars = (v, n = 5) => `<span class="stars" aria-label="${v} / 5">${[...Array(n)].map((_, i) => icon("star", i < Math.round(v) ? "on" : "")).join("")}</span>`;
    const fmtPrice = p => { const n = Number(p) || 0; return Number.isInteger(n) ? String(n) : n.toFixed(2); };
    const fmtDate = d => { try { return new Date(d).toLocaleDateString("ar", { year: "numeric", month: "long", day: "numeric" }); } catch { return ""; } };
    const imgSrc = f => !f ? "" : /^(https?:)?\/\//.test(f) || f.startsWith("data:") ? f : "assets/products/" + encodeURIComponent(f);
    const avatarHtml = (u, name) => u ? `<span class="avatar"><img src="${esc(u)}" alt="" loading="lazy" onerror="this.parentNode.textContent='${esc((name || "?")[0])}'"></span>` : `<span class="avatar">${esc((name || "?")[0].toUpperCase())}</span>`;
    const catMeta = { fivem: ["جرافيكس FiveM", "gamepad"], discord: ["ديسكورد", "discord"], subscriptions: ["اشتراكات", "card"], support: ["دعم المتجر", "heart"] };
    const catName = c => (catMeta[c] || [c])[0];

    /* ---------- product card ---------- */
    function productCard(p) {
        const out = p.status === "out";
        const img = imgSrc(p.image);
        const rating = p.rating && p.rating.count ? `<div class="rate-row">${stars(p.rating.avg)}<span class="ltr">${p.rating.avg}</span><span>(${p.rating.count})</span></div>` : `<div class="rate-row"><span>لا توجد تقييمات بعد</span></div>`;
        return `<article class="pcard ${out ? "out" : ""}">
          <a class="pimg" href="product.html?id=${p.id}" aria-label="${esc(p.title)}">
            <div class="ph"><img src="assets/emblem.png" alt=""></div>
            ${img ? `<img src="${img}" alt="${esc(p.title)}" loading="lazy" onerror="this.remove()">` : ""}
            <div class="pbadges"><span class="chip">${esc(catName(p.category))}</span>${out ? '<span class="chip err">غير متوفر</span>' : p.oldPrice > p.price ? `<span class="chip silver">خصم ${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : p.featured ? '<span class="chip silver">مميّز</span>' : ""}</div>
          </a>
          <div class="pbody">
            <a class="ptitle" href="product.html?id=${p.id}">${esc(p.title)}</a>
            <p class="pdesc">${esc((p.description || "").split("\n").filter(Boolean)[0] || "")}</p>
            ${p.isSupport ? "" : rating}
            <div class="pfoot">
              <div class="price ${p.price ? "" : "free"}">${p.price ? `<b>$${fmtPrice(p.price)}</b>${p.oldPrice > p.price ? `<s>$${fmtPrice(p.oldPrice)}</s>` : ""}` : `<b>المبلغ حسب رغبتك</b>`}</div>
              <a class="btn btn-sm ${out ? "" : "btn-primary"}" href="product.html?id=${p.id}">${out ? "التفاصيل" : p.isSupport ? "ادعمنا" : "اشترِ الآن"}${icon("arrow", "sm")}</a>
            </div>
          </div></article>`;
    }
    const skeletons = n => [...Array(n)].map(() => '<div class="skeleton" style="height:380px"></div>').join("");

    /* ---------- layout ---------- */
    const NAV = [["index.html", "الرئيسية"], ["store.html", "المتجر"], ["reviews.html", "التقييمات"], ["index.html#faq", "الأسئلة الشائعة"]];
    function renderHeader(active) {
        const h = $("#hdr"); if (!h) return;
        const navHtml = NAV.map(([href, t]) => `<a href="${href}" class="${href === active ? "on" : ""}">${t}</a>`).join("");
        h.className = "hdr";
        h.innerHTML = `<div class="wrap hdr-in">
          <a class="brand" href="index.html"><img src="assets/logo.png" alt="CA"><span><b>CA STORE</b><small>OFFICIAL</small></span></a>
          <nav class="nav">${navHtml}</nav>
          <div class="hdr-end" id="hdrEnd" style="position:relative"></div>
          <button class="burger" id="burger" aria-label="القائمة">${icon("menu")}</button></div>
          <div class="drawer" id="drawer"><div class="drawer-in">${navHtml}<div style="flex:1"></div><a href="${C.DISCORD_INVITE}" target="_blank" rel="noopener">سيرفر الديسكورد</a></div></div>`;
        const dr = $("#drawer");
        $("#burger").onclick = () => dr.classList.add("open");
        dr.addEventListener("click", e => { if (e.target === dr || e.target.closest("a")) dr.classList.remove("open"); });
        const onScroll = () => h.classList.toggle("scrolled", scrollY > 8); onScroll(); addEventListener("scroll", onScroll, { passive: true });
    }
    function renderUser() {
        const end = $("#hdrEnd"); if (!end) return; const u = auth.user;
        if (!u) { end.innerHTML = `<button class="btn btn-sm" style="height:44px" id="loginBtn">${icon("discord", "sm")} تسجيل الدخول</button>`; $("#loginBtn").onclick = () => auth.login(); return; }
        end.innerHTML = `<div class="user-chip" id="uchip" tabindex="0">${avatarHtml(u.avatar, u.username)}<span>${esc(u.username)}</span>${icon("chev", "sm")}</div>
          <div class="menu" id="umenu">${u.isAdmin ? `<a href="admin.html">${icon("shield", "sm")} لوحة التحكم</a>` : ""}<a href="reviews.html">${icon("star", "sm")} التقييمات</a><div class="sep"></div><button class="danger" id="outBtn">${icon("logout", "sm")} تسجيل الخروج</button></div>`;
        const m = $("#umenu"); $("#uchip").onclick = e => { e.stopPropagation(); m.classList.toggle("open"); };
        document.addEventListener("click", () => m.classList.remove("open")); $("#outBtn").onclick = () => auth.logout();
    }
    function renderFooter() {
        const f = $("#ftr"); if (!f) return; f.className = "ftr";
        f.innerHTML = `<div class="wrap"><div class="ftr-grid">
          <div><a class="brand" href="index.html"><img src="assets/logo.png" alt="CA"><span><b>CA STORE</b><small>OFFICIAL</small></span></a><p>متجر عربي متخصص بحزم الجرافيكس وخدمات ديسكورد. جودة عالية، تسليم سريع، ودعم حقيقي عبر سيرفرنا.</p></div>
          <div><h4>المتجر</h4><ul><li><a href="store.html">كل المنتجات</a></li><li><a href="store.html?cat=fivem">جرافيكس FiveM</a></li><li><a href="store.html?cat=discord">خدمات ديسكورد</a></li></ul></div>
          <div><h4>المساعدة</h4><ul><li><a href="index.html#how">كيف أشتري؟</a></li><li><a href="index.html#faq">الأسئلة الشائعة</a></li><li><a href="reviews.html">آراء العملاء</a></li></ul></div>
          <div><h4>تواصل معنا</h4><ul><li><a href="${C.DISCORD_INVITE}" target="_blank" rel="noopener">سيرفر الديسكورد</a></li><li><a href="${C.DISCORD_INVITE}" target="_blank" rel="noopener">فتح تذكرة</a></li></ul></div>
        </div><div class="ftr-bot"><span>© ${new Date().getFullYear()} CA Store — جميع الحقوق محفوظة</span><span>الدفع عبر PayPal · التسليم عبر Discord</span></div></div>`;
    }
    function reveal() {
        const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); } }), { threshold: .12 });
        $$(".rv-in").forEach(el => io.observe(el));
    }
    async function boot(active) {
        if (!$(".bg")) { const b = document.createElement("div"); b.className = "bg"; document.body.prepend(b); }
        renderHeader(active); renderFooter(); renderUser();
        await auth.load(); renderUser(); reveal();
    }
    window.CA = { C, api, auth, icon, esc, $, $$, toast, modal, confirmBox, stars, fmtPrice, fmtDate, imgSrc, avatarHtml, catName, catMeta, productCard, skeletons, boot, reveal, store };
})();
