(async function () {
    const { $, t, icon, api, auth, boot, esc, stars, fmtPrice, money, usd, fmtDate, imgSrc, avatarHtml, catName, ptitle, pdesc, toast, modal, confirmBox, C, cdBox, startCountdowns, galleryHtml, initGallery, compareHtml, initCompare, isAr } = CA;
    const id = parseInt(new URLSearchParams(location.search).get("id"), 10);
    await boot("store.html");
    let p, applied = null;
    const fail = m => { $("#top").innerHTML = `<div class="empty" style="margin-top:60px"><div class="icon-tile">${icon("info", "lg")}</div><h3>${esc(m)}</h3><a class="btn" href="store.html">${t("back_store")}</a></div>`; $("#reviewsSec").innerHTML = ""; };
    async function fetchProduct() { const d = await api("/api/store/products"); return d.products.find(x => x.id === id); }
    try { p = await fetchProduct(); } catch (e) { return fail(e.message); }
    if (!p) return fail(t("pd_missing"));

    const out = () => p.status === "out";
    const finalUsd = () => applied ? applied.final : p.price;

    function render() {
        document.title = ptitle(p) + " — CA Store";
        const lines = (pdesc(p) || "").split("\n").map(s => s.trim()).filter(Boolean);
        const isB = l => /^[🔹🚀•\-]/u.test(l);
        const bullets = lines.filter(isB), paras = lines.filter(l => !isB(l));
        const img = imgSrc(p.image), o = out();
        const m = p.media || {}, hasG = m.gallery && m.gallery.length, hasC = m.compare && m.compare.length;
        const buyLabel = p.isSupport ? t("donate_btn") : t("buy_paypal");
        const pct = p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
        $("#top").innerHTML = `
          <div class="crumbs"><a href="index.html">${t("nav_home")}</a>${icon("chev")}<a href="store.html?cat=${esc(p.category)}">${esc(catName(p.category))}</a>${icon("chev")}<span>${esc(ptitle(p))}</span></div>
          <div class="pd">
            <div class="pd-media"><div class="ph"><img src="assets/emblem.png" alt=""></div>${img ? `<img src="${img}" alt="${esc(ptitle(p))}" onerror="this.remove()">` : ""}</div>
            <div class="pd-info">
              <div style="display:flex;gap:8px;flex-wrap:wrap"><span class="chip">${esc(catName(p.category))}</span>${o ? `<span class="chip err">${t("out_now")}</span>` : `<span class="chip ok">${t("available")}</span>`}${!p.isSupport && p.sold > 0 ? `<span class="chip sold-chip">${icon("fire")} ${t("sold_n", { n: p.sold })}</span>` : ""}</div>
              <h1>${esc(ptitle(p))}</h1>
              ${p.isSupport ? "" : `<div class="rate-row" id="topRate"></div>`}
              <div class="pd-price">
                ${p.offerEndsAt && !o ? cdBox(p.offerEndsAt, true) : ""}
                <div class="price ${p.price ? "" : "free"}" id="priceBox">${p.price ? (applied ? `<b class="p-new">${money(applied.final)}</b><s>${money(p.price)}</s><span class="chip ok">${icon("tag")} ${esc(applied.code)}</span>` : `<b>${money(p.price)}</b>${p.oldPrice > p.price ? `<s>${money(p.oldPrice)}</s><span class="chip silver">${t("save", { n: pct })}</span>` : ""}`) : `<b>${t("free_amount")}</b>`}</div>
                ${p.price && !p.isSupport ? `<div class="usd-note">${icon("info", "sm")} <span id="usdNote">${usdNote()}</span></div>` : ""}
                ${!o && !p.isSupport && p.price ? `<div class="coupon" id="couponBox"></div>` : ""}
                <button class="btn btn-primary btn-lg btn-block ${o ? "disabled" : ""}" id="buy" ${o ? "disabled" : ""}>${o ? t("out_now") : `${icon("lock", "sm")} ${buyLabel}`}</button>
                ${!o && !p.isSupport && p.paymentUrl ? `<button class="btn btn-block" id="altPay">${icon("card", "sm")} ${t("alt_pay")}</button>` : ""}
                <div class="pd-trust"><div>${icon("shield")}${t("tr1")}</div><div>${icon("bolt")}${t("tr2")}</div><div>${icon("chat")}${t("tr3")}</div></div>
              </div>
              <div class="desc">${paras.map(x => `<p>${esc(x)}</p>`).join("")}${bullets.length ? `<ul>${bullets.map(b => `<li>${icon("check")}<span>${esc(b.replace(/^[🔹🚀•\-]\s*/u, ""))}</span></li>`).join("")}</ul>` : ""}</div>
            </div>
          </div>
          <div class="sticky-buy"><div class="price"><b id="stickyPrice">${p.price ? money(finalUsd()) : ""}</b></div><button class="btn btn-primary btn-block ${o ? "disabled" : ""}" id="buy2" ${o ? "disabled" : ""}>${o ? t("out_of_stock") : buyLabel}</button></div>`;
        $("#extra").innerHTML = (hasC ? `<section class="section tight"><div class="sec-head"><div><span class="eyebrow">${t("cmp_hint")}</span><h2 class="sec-title">${t("cmp_title")}</h2></div></div>${compareHtml(m.compare)}</section>` : "") +
            (hasG ? `<section class="section tight"><div class="sec-head"><div><span class="eyebrow">${t("gal_title")}</span><h2 class="sec-title">${t("gal_title")}</h2></div></div>${galleryHtml(m.gallery)}</section>` : "");
        if (hasC) initCompare($("#extra")); if (hasG) initGallery($("#extra"), m.gallery);
        startCountdowns(); wire(); couponUi();
    }
    function usdNote() { return t("usd_note", { usd: `<b class="ltr">${usd(finalUsd())}</b>` }); }

    /* ---------- كود الخصم ---------- */
    function couponUi() {
        const box = $("#couponBox"); if (!box) return;
        if (!auth.user) { box.innerHTML = `<div class="coupon-login">${icon("tag", "sm")} <span>${t("coupon_login")}</span> <button class="btn btn-sm" id="cpLogin">${t("login")}</button></div>`; $("#cpLogin").onclick = () => auth.login(); return; }
        if (applied) { box.innerHTML = `<div class="coupon-ok">${icon("check")} <span>${t("coupon_ok", { code: esc(applied.code), amt: money(applied.discount) })}</span> <button class="btn btn-sm" id="cpRm">${t("coupon_remove")}</button></div>`; $("#cpRm").onclick = () => { applied = null; refreshPrice(); couponUi(); }; return; }
        box.innerHTML = `<label class="cp-l">${icon("tag", "sm")} ${t("coupon_l")}</label><div class="cp-row"><input class="input ltr" id="cpIn" maxlength="24" placeholder="${t("coupon_ph")}" autocomplete="off" style="text-transform:uppercase"><button class="btn" id="cpGo">${t("coupon_apply")}</button></div><div class="cp-err" id="cpErr"></div>`;
        const go = async () => {
            const code = $("#cpIn").value.trim(); if (!code) return; const b = $("#cpGo"); b.disabled = true; $("#cpErr").textContent = "";
            try { const r = await api("/api/store/coupons/validate", { method: "POST", body: { code, productId: p.id } }); applied = { code: r.code, final: r.final, discount: r.discount, original: r.original }; refreshPrice(); couponUi(); }
            catch (e) { $("#cpErr").textContent = e.message; b.disabled = false; }
        };
        $("#cpGo").onclick = go; $("#cpIn").addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); go(); } });
    }
    function refreshPrice() {
        $("#priceBox").innerHTML = applied ? `<b class="p-new">${money(applied.final)}</b><s>${money(p.price)}</s><span class="chip ok">${icon("tag")} ${esc(applied.code)}</span>` : `<b>${money(p.price)}</b>${p.oldPrice > p.price ? `<s>${money(p.oldPrice)}</s><span class="chip silver">${t("save", { n: Math.round((1 - p.price / p.oldPrice) * 100) })}</span>` : ""}`;
        $("#usdNote").innerHTML = usdNote(); $("#stickyPrice").innerHTML = money(finalUsd());
    }

    /* ---------- الشراء ---------- */
    async function buy() {
        if (out()) return;
        if (p.isSupport) return go();
        if (!auth.user) {
            return modal(`<h3>${t("m_login_t")}</h3><p>${t("m_login_d")}</p><div class="modal-actions"><button class="btn btn-primary" data-a="l">${icon("discord", "sm")} ${t("login_discord")}</button><button class="btn" data-a="c">${t("cancel")}</button></div>`, (ov, close) => ov.addEventListener("click", e => { const a = e.target.closest("[data-a]"); if (!a) return; close(); if (a.dataset.a === "l") auth.login(); }));
        }
        const btns = ["buy", "buy2"].map(i => $("#" + i)).filter(Boolean); btns.forEach(b => b.disabled = true);
        try { const d = await api("/api/store/checkout", { method: "POST", body: { productId: p.id, couponCode: applied ? applied.code : undefined } }); location.href = d.url; }
        catch (e) {
            btns.forEach(b => b.disabled = false);
            if (e.code === "checkout_disabled" || e.status === 503) return go();
            if (applied) { applied = null; refreshPrice(); couponUi(); }
            toast(e.message, "err");
        }
    }
    function go() {
        if (!p.paymentUrl) return toast(t("no_pay_link"), "err");
        modal(`<h3>${t("m_pay_t")}</h3><p>${t("m_pay_d")} ${p.isSupport ? "" : esc(C.TICKET_NOTE)}</p><div class="modal-actions"><a class="btn btn-primary" href="${esc(p.paymentUrl)}" target="_blank" rel="noopener noreferrer" data-a="ok">${icon("lock", "sm")} ${t("m_pay_go")}</a><button class="btn" data-a="c">${t("cancel")}</button></div>`, (ov, close) => ov.addEventListener("click", e => { if (e.target.closest("[data-a]")) close(); }));
    }
    function wire() {
        ["buy", "buy2"].forEach(i => { const b = $("#" + i); if (b) b.onclick = buy; });
        const alt = $("#altPay");
        if (alt) alt.onclick = () => modal(`<h3>${t("m_alt_t")}</h3><p>${t("m_alt_d")}<br><br><b>${t("m_alt_w")}</b>${applied ? `<br><br>${t("coupon_alt_note")}` : ""}</p><div class="modal-actions"><a class="btn btn-primary" href="${esc(p.paymentUrl)}" target="_blank" rel="noopener noreferrer" data-a="ok">${icon("lock", "sm")} ${t("m_pay_go")}</a><a class="btn" href="${esc(C.DISCORD_INVITE)}" target="_blank" rel="noopener" data-a="t">${icon("ticket", "sm")} ${t("ftr_ticket")}</a></div>`, (ov, close) => ov.addEventListener("click", e => { if (e.target.closest("[data-a=ok]")) close(); }));
    }
    render();
    document.addEventListener("ca:expired", async () => { try { const np = await fetchProduct(); if (np) { p = np; applied = null; render(); } } catch {} });
    if (p.isSupport) { $("#reviewsSec").remove(); return; }

    /* ---------- التقييمات ---------- */
    async function loadReviews() {
        const sec = $("#reviewsSec");
        if (!sec.dataset.ready) { sec.dataset.ready = 1; sec.innerHTML = `<div class="sec-head"><div><span class="eyebrow">${t("rt_eyebrow")}</span><h2 class="sec-title">${t("rt_title")}</h2></div></div><div id="rvBox"><div class="skeleton" style="height:200px"></div></div>`; }
        let revs;
        try { revs = await api("/api/store/products/" + id + "/reviews"); } catch (e) { $("#rvBox").innerHTML = `<div class="empty">${esc(e.message)}</div>`; return; }
        const { summary: s, reviews, me } = revs, max = Math.max(...s.distribution, 1);
        const tr = $("#topRate"); if (tr) tr.innerHTML = s.count ? `${stars(s.avg)}<span class="ltr">${s.avg}</span><a href="#reviewsSec">${t("n_ratings", { n: s.count })}</a>` : `<span>${t("no_ratings")}</span>`;
        let form;
        if (!me.loggedIn) form = `<div class="notice">${icon("lock")}<div>${t("rt_login")} <button class="btn btn-sm" id="rvLogin" style="margin-inline-start:8px">${icon("discord", "sm")} ${t("login")}</button></div></div>`;
        else if (!me.canReview) form = `<div class="notice warn">${icon("info")}<div>${t("rt_notbuyer")}</div></div>`;
        else form = `<div class="form-card"><h3>${me.myReview ? t("rt_form_edit") : t("rt_form_new")}</h3><p style="color:var(--text-3);font-size:13px">${t("rt_thanks")}</p>
            <div class="star-input" id="si">${[1, 2, 3, 4, 5].map(n => `<button type="button" data-n="${n}" aria-label="${n}">${icon("star")}</button>`).join("")}</div>
            <textarea class="textarea" id="rvText" maxlength="600" placeholder="${t("rt_ph")}">${esc(me.myReview ? me.myReview.comment : "")}</textarea>
            <div style="display:flex;gap:10px;margin-top:14px;align-items:center;flex-wrap:wrap"><button class="btn btn-primary" id="rvSend">${me.myReview ? t("rt_save") : t("rt_send")}</button>${me.myReview ? `<button class="btn btn-danger" id="rvDel">${t("rt_del_mine")}</button>` : ""}<span id="rvErr" style="color:var(--err);font-size:13px"></span></div></div>`;
        $("#rvBox").innerHTML = `<div style="display:grid;gap:18px">
          <div class="summary"><div class="big"><b>${s.count ? s.avg : "—"}</b>${stars(s.avg)}<small style="color:var(--text-3)">${t("rt_count", { n: s.count })}</small></div>
          <div class="bars">${[5, 4, 3, 2, 1].map(n => `<div class="bar-row"><span>${n} ★</span><div class="bar"><i style="width:${s.distribution[n - 1] / max * 100}%"></i></div><span>${s.distribution[n - 1]}</span></div>`).join("")}</div></div>
          ${form}
          <div class="rv-grid">${reviews.map(v => `<div class="rv"><div class="rv-top">${avatarHtml(v.avatar, v.username)}<div><div class="rv-name">${esc(v.username)}<span class="chip ok">${icon("check")} ${t("verified")}</span></div><div class="rv-date">${fmtDate(v.createdAt)}</div></div>${me.isAdmin || v.mine ? `<button class="btn btn-sm btn-danger btn-icon rv-del" data-del="${v.id}" aria-label="${t("delete")}">${icon("trash", "sm")}</button>` : ""}</div>${stars(v.rating)}${v.comment ? `<p class="rv-text">${esc(v.comment)}</p>` : ""}</div>`).join("")}</div></div>`;
        const lg = $("#rvLogin"); if (lg) lg.onclick = () => auth.login();
        let rating = me.myReview ? me.myReview.rating : 0;
        const paint = () => document.querySelectorAll("#si button").forEach(b => b.classList.toggle("on", +b.dataset.n <= rating)); paint();
        const si = $("#si"); if (si) si.onclick = e => { const b = e.target.closest("button"); if (b) { rating = +b.dataset.n; paint(); } };
        const send = $("#rvSend"); if (send) send.onclick = async () => {
            if (!rating) { $("#rvErr").textContent = t("rt_pick"); return; }
            send.disabled = true;
            try { await api("/api/store/reviews", { method: "POST", body: { productId: id, rating, comment: $("#rvText").value } }); toast(t("rt_saved")); loadReviews(); }
            catch (e) { $("#rvErr").textContent = e.message; send.disabled = false; }
        };
        const delOwn = async rid => { if (!await confirmBox(t("rt_del_t"), t("rt_del_d"), t("delete"))) return; try { await api("/api/store/reviews/" + rid, { method: "DELETE" }); toast(t("rt_deleted")); loadReviews(); } catch (e) { toast(e.message, "err"); } };
        const d1 = $("#rvDel"); if (d1) d1.onclick = () => delOwn(me.myReview.id);
        document.querySelectorAll("[data-del]").forEach(b => b.onclick = () => delOwn(b.dataset.del));
    }
    loadReviews();
})();
