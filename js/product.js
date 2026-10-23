(async function () {
    const { $, icon, api, auth, boot, esc, stars, fmtPrice, fmtDate, imgSrc, avatarHtml, catName, toast, modal, confirmBox, productCard, C } = CA;
    const id = parseInt(new URLSearchParams(location.search).get("id"), 10);
    await boot("store.html");
    let p, revs;
    try { p = (await api("/api/store/products")).products.find(x => x.id === id); } catch (e) { return fail(e.message); }
    if (!p) return fail("المنتج غير موجود أو لم يعد متاحاً");
    document.title = p.title + " — CA Store";
    function fail(m) { $("#main").innerHTML = `<div class="empty" style="margin-top:60px"><div class="icon-tile">${icon("info", "lg")}</div><h3>${esc(m)}</h3><a class="btn" href="store.html">العودة للمتجر</a></div>`; }
    const lines = (p.description || "").split("\n").map(s => s.trim()).filter(Boolean);
    const bullets = lines.filter(l => /^[🔹🚀•\-]/u.test(l)), paras = lines.filter(l => !/^[🔹🚀•\-]/u.test(l));
    const out = p.status === "out", img = imgSrc(p.image);
    const buyLabel = p.isSupport ? "ادعم المتجر" : "اشترِ الآن عبر PayPal";
    $("#main").innerHTML = `
      <div class="crumbs"><a href="index.html">الرئيسية</a>${icon("chev")}<a href="store.html?cat=${esc(p.category)}">${esc(catName(p.category))}</a>${icon("chev")}<span>${esc(p.title)}</span></div>
      <div class="pd">
        <div class="pd-media"><div class="ph"><img src="assets/emblem.png" alt=""></div>${img ? `<img src="${img}" alt="${esc(p.title)}" onerror="this.remove()">` : ""}</div>
        <div class="pd-info">
          <div style="display:flex;gap:8px;flex-wrap:wrap"><span class="chip">${esc(catName(p.category))}</span>${out ? '<span class="chip err">غير متوفر حالياً</span>' : '<span class="chip ok">متوفر</span>'}</div>
          <h1>${esc(p.title)}</h1>
          ${p.isSupport ? "" : `<div class="rate-row" id="topRate"></div>`}
          <div class="pd-price">
            <div class="price ${p.price ? "" : "free"}">${p.price ? `<b>$${fmtPrice(p.price)}</b>${p.oldPrice > p.price ? `<s>$${fmtPrice(p.oldPrice)}</s><span class="chip silver">وفّر ${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : ""}` : "<b>المبلغ حسب رغبتك</b>"}</div>
            <button class="btn btn-primary btn-lg btn-block ${out ? "disabled" : ""}" id="buy" ${out ? "disabled" : ""}>${out ? "غير متوفر حالياً" : `${icon("lock", "sm")} ${buyLabel}`}</button>
            ${!out && !p.isSupport && p.paymentUrl ? `<button class="btn btn-block" id="altPay">${icon("card", "sm")} لا تملك حساب PayPal؟ ادفع ببطاقة</button>` : ""}
            <div class="pd-trust"><div>${icon("shield")}دفع آمن</div><div>${icon("bolt")}تسليم سريع</div><div>${icon("chat")}دعم عبر تذكرة</div></div>
          </div>
          <div class="desc">${paras.map(t => `<p>${esc(t)}</p>`).join("")}${bullets.length ? `<ul>${bullets.map(b => `<li>${icon("check")}<span>${esc(b.replace(/^[🔹🚀•\-]\s*/u, ""))}</span></li>`).join("")}</ul>` : ""}</div>
        </div>
      </div>
      ${p.isSupport ? "" : `<section class="section tight" id="reviewsSec"><div class="sec-head"><div><span class="eyebrow">التقييمات</span><h2 class="sec-title">آراء من اشتروا هذا المنتج</h2></div></div><div id="rvBox"><div class="skeleton" style="height:200px"></div></div></section>`}
      <div class="sticky-buy"><div class="price"><b>${p.price ? "$" + fmtPrice(p.price) : "ادعم"}</b></div><button class="btn btn-primary btn-block ${out ? "disabled" : ""}" id="buy2" ${out ? "disabled" : ""}>${out ? "غير متوفر" : buyLabel}</button></div>`;

    async function buy() {
        if (out) return;
        if (p.isSupport) return go();                       // الدعم: رابط مباشر
        if (!auth.user) {
            return modal(`<h3>سجّل الدخول أولاً</h3><p>نربط مشترياتك بحسابك في ديسكورد لنفعّل لك المنتج تلقائياً ونفتح لك التقييم بعد الشراء.</p><div class="modal-actions"><button class="btn btn-primary" data-a="l">${icon("discord", "sm")} تسجيل الدخول</button><button class="btn" data-a="c">إلغاء</button></div>`, (ov, close) => ov.addEventListener("click", e => { const a = e.target.closest("[data-a]"); if (!a) return; close(); if (a.dataset.a === "l") auth.login(); }));
        }
        const btns = ["buy", "buy2"].map(i => $("#" + i)).filter(Boolean); btns.forEach(b => b.disabled = true);
        try {
            const d = await api("/api/store/checkout", { method: "POST", body: { productId: p.id } });
            location.href = d.url;
        } catch (e) {
            btns.forEach(b => b.disabled = false);
            if (e.code === "checkout_disabled" || e.status === 503) return go();   // احتياطي: الرابط القديم
            toast(e.message, "err");
        }
    }
    function go() {
        if (!p.paymentUrl) return toast("الدفع غير متاح لهذا المنتج حالياً", "err");
        modal(`<h3>أنت على وشك الدفع</h3><p>سيتم فتح صفحة PayPal الآمنة في تبويب جديد. ${p.isSupport ? "" : esc(C.TICKET_NOTE)}</p><div class="modal-actions"><a class="btn btn-primary" href="${esc(p.paymentUrl)}" target="_blank" rel="noopener noreferrer" data-a="ok">${icon("lock", "sm")} متابعة للدفع</a><button class="btn" data-a="c">إلغاء</button></div>`, (ov, close) => ov.addEventListener("click", e => { if (e.target.closest("[data-a]")) close(); }));
    }
    const alt = $("#altPay");
    if (alt) alt.onclick = () => modal(`<h3>الدفع ببطاقة بدون حساب PayPal</h3><p>سيفتح لك رابط دفع آمن من PayPal تقدر تدفع منه ببطاقتك كضيف.<br><br><b>مهم:</b> هذا الرابط لا يعرف حسابك في ديسكورد، لذلك بعد الدفع <b>افتح تذكرة في سيرفرنا</b> وأرسل إثبات الدفع ليتم تفعيل منتجك وفتح التقييم لك يدوياً خلال وقت قصير.</p><div class="modal-actions"><a class="btn btn-primary" href="${esc(p.paymentUrl)}" target="_blank" rel="noopener noreferrer" data-a="ok">${icon("lock", "sm")} متابعة للدفع</a><a class="btn" href="${esc(C.DISCORD_INVITE)}" target="_blank" rel="noopener" data-a="t">${icon("ticket", "sm")} فتح تذكرة</a></div>`, (ov, close) => ov.addEventListener("click", e => { if (e.target.closest("[data-a=ok]")) close(); }));
    ["buy", "buy2"].forEach(i => { const b = $("#" + i); if (b) b.onclick = buy; });
    if (p.isSupport) return;
    document.body.classList.add("has-sticky");

    async function loadReviews() {
        try { revs = await api("/api/store/products/" + id + "/reviews"); } catch (e) { $("#rvBox").innerHTML = `<div class="empty">${esc(e.message)}</div>`; return; }
        const { summary: s, reviews, me } = revs, max = Math.max(...s.distribution, 1);
        $("#topRate").innerHTML = s.count ? `${stars(s.avg)}<span class="ltr">${s.avg}</span><a href="#reviewsSec">(${s.count} تقييم)</a>` : "<span>لا توجد تقييمات بعد</span>";
        let form;
        if (!me.loggedIn) form = `<div class="notice">${icon("lock")}<div>سجّل الدخول لتتمكن من تقييم المنتج إن كنت قد اشتريته. <button class="btn btn-sm" id="rvLogin" style="margin-inline-start:8px">${icon("discord", "sm")} تسجيل الدخول</button></div></div>`;
        else if (!me.canReview) form = `<div class="notice warn">${icon("info")}<div>التقييم متاح فقط لمن اشترى هذا المنتج. إذا اشتريته للتو وما زلت لا ترى النموذج، افتح تذكرة في السيرفر ليتم تأكيد عمليتك.</div></div>`;
        else form = `<div class="form-card"><h3>${me.myReview ? "عدّل تقييمك" : "قيّم هذا المنتج"}</h3><p style="color:var(--text-3);font-size:13px">شكراً لشرائك! رأيك يساعد الآخرين.</p>
            <div class="star-input" id="si">${[1, 2, 3, 4, 5].map(n => `<button type="button" data-n="${n}" aria-label="${n}">${icon("star")}</button>`).join("")}</div>
            <textarea class="textarea" id="rvText" maxlength="600" placeholder="اكتب تجربتك مع المنتج (اختياري)">${esc(me.myReview ? me.myReview.comment : "")}</textarea>
            <div style="display:flex;gap:10px;margin-top:14px;align-items:center"><button class="btn btn-primary" id="rvSend">${me.myReview ? "حفظ التعديل" : "إرسال التقييم"}</button>${me.myReview ? `<button class="btn btn-danger" id="rvDel">حذف تقييمي</button>` : ""}<span id="rvErr" style="color:var(--err);font-size:13px"></span></div></div>`;
        $("#rvBox").innerHTML = `<div style="display:grid;gap:18px">
          <div class="summary"><div class="big"><b>${s.count ? s.avg : "—"}</b>${stars(s.avg)}<small style="color:var(--text-3)">${s.count} تقييم</small></div>
          <div class="bars">${[5, 4, 3, 2, 1].map(n => `<div class="bar-row"><span>${n} ★</span><div class="bar"><i style="width:${s.distribution[n - 1] / max * 100}%"></i></div><span>${s.distribution[n - 1]}</span></div>`).join("")}</div></div>
          ${form}
          <div class="rv-grid">${reviews.map(v => `<div class="rv"><div class="rv-top">${avatarHtml(v.avatar, v.username)}<div><div class="rv-name">${esc(v.username)}<span class="chip ok">${icon("check")} مشتري موثّق</span></div><div class="rv-date">${fmtDate(v.createdAt)}</div></div>${me.isAdmin || v.mine ? `<button class="btn btn-sm btn-danger btn-icon rv-del" data-del="${v.id}" aria-label="حذف">${icon("trash", "sm")}</button>` : ""}</div>${stars(v.rating)}${v.comment ? `<p class="rv-text">${esc(v.comment)}</p>` : ""}</div>`).join("")}</div></div>`;
        const lg = $("#rvLogin"); if (lg) lg.onclick = () => auth.login();
        let rating = me.myReview ? me.myReview.rating : 0;
        const paint = () => document.querySelectorAll("#si button").forEach(b => b.classList.toggle("on", +b.dataset.n <= rating)); paint();
        const si = $("#si"); if (si) si.onclick = e => { const b = e.target.closest("button"); if (b) { rating = +b.dataset.n; paint(); } };
        const send = $("#rvSend"); if (send) send.onclick = async () => {
            if (!rating) { $("#rvErr").textContent = "اختر عدد النجوم"; return; }
            send.disabled = true;
            try { await api("/api/store/reviews", { method: "POST", body: { productId: id, rating, comment: $("#rvText").value } }); toast("تم حفظ تقييمك، شكراً لك!"); loadReviews(); }
            catch (e) { $("#rvErr").textContent = e.message; send.disabled = false; }
        };
        const delOwn = async rid => { if (!await confirmBox("حذف التقييم", "هل تريد حذف هذا التقييم نهائياً؟", "حذف")) return; try { await api("/api/store/reviews/" + rid, { method: "DELETE" }); toast("تم الحذف"); loadReviews(); } catch (e) { toast(e.message, "err"); } };
        const d1 = $("#rvDel"); if (d1) d1.onclick = () => delOwn(me.myReview.id);
        document.querySelectorAll("[data-del]").forEach(b => b.onclick = () => delOwn(b.dataset.del));
    }
    loadReviews();
})();
