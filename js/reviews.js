(async function () {
    const { $, icon, api, boot, esc, stars, fmtDate, avatarHtml } = CA;
    await boot("reviews.html");
    try {
        const r = await api("/api/store/reviews?limit=60");
        $("#sum").innerHTML = `<div class="summary" style="grid-template-columns:auto 1fr"><div class="big"><b>${r.summary.count ? r.summary.avg : "—"}</b>${stars(r.summary.avg)}<small style="color:var(--text-3)">${r.summary.count} تقييم</small></div><p style="color:var(--text-2)">لكل منتج صفحة تقييمات خاصة به. لإضافة تقييم، افتح صفحة المنتج الذي اشتريته بعد تسجيل الدخول.</p></div>`;
        $("#list").innerHTML = r.reviews.length ? r.reviews.map(v => `<div class="rv"><div class="rv-top">${avatarHtml(v.avatar, v.username)}<div><div class="rv-name">${esc(v.username)}<span class="chip ok">${icon("check")} مشتري موثّق</span></div><div class="rv-date">${fmtDate(v.createdAt)}</div></div></div>${stars(v.rating)}${v.comment ? `<p class="rv-text">${esc(v.comment)}</p>` : ""}<div class="rv-prod">${icon("bag", "sm")}<a href="product.html?id=${v.productId}">${esc(v.productTitle)}</a></div></div>`).join("") : `<div class="empty" style="grid-column:1/-1"><h3>لا توجد تقييمات بعد</h3></div>`;
    } catch (e) { $("#list").innerHTML = `<div class="empty" style="grid-column:1/-1">${esc(e.message)}</div>`; }
})();
