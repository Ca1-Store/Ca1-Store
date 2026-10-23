(async function () {
    const { $, icon, api, boot, productCard, skeletons, esc, stars, fmtDate, avatarHtml, catMeta } = CA;
    $("#arr1").innerHTML = icon("arrow", "sm");
    $("#fi1").innerHTML = icon("lock", "lg"); $("#fi2").innerHTML = icon("bolt", "lg"); $("#fi3").innerHTML = icon("chat", "lg");
    ["q1", "q2", "q3", "q4"].forEach(i => $("#" + i).innerHTML = icon("chev", "sm"));
    const words = ["جرافيكس FiveM", "تفعيل فوري", "دفع آمن عبر PayPal", "دعم عبر الديسكورد", "تقييمات موثّقة", "أداء ثابت بدون FPS drop", "تحديثات مستمرة"];
    $("#mq").innerHTML = [...words, ...words, ...words, ...words].map(w => `<span>${w}</span>`).join("");
    $("#steps").innerHTML = [["user", "سجّل الدخول", "بحساب ديسكورد الخاص بك ليتم ربط الشراء بحسابك."], ["card", "اختر وادفع", "اختر المنتج وأكمل الدفع بأمان عبر PayPal."], ["ticket", "افتح تذكرة", "افتح تذكرة في السيرفر وتسلّم منتجك فوراً."]]
        .map(([ic, t, d], i) => `<div class="step"><div class="step-n">${icon(ic, "lg")}</div><h3>${i + 1}. ${t}</h3><p>${d}</p></div>`).join("");
    $("#feats").innerHTML = [["shield", "دفع موثوق", "جميع العمليات تتم عبر PayPal، بياناتك البنكية لا تصلنا أبداً."], ["bolt", "تسليم سريع", "نفعّل لك المنتج خلال دقائق من فتح التذكرة."], ["star", "تقييمات موثّقة", "لا يقيّم إلا من اشترى فعلاً، لتقرأ آراء حقيقية."], ["gamepad", "جودة وأداء", "حزم محسّنة بصرياً دون التأثير على الـ FPS."], ["chat", "دعم مباشر", "فريق جاهز للمساعدة عبر سيرفر الديسكورد."], ["refresh", "تحديثات مستمرة", "نطوّر حزمنا باستمرار وتصلك التحديثات تلقائياً."]]
        .map(([ic, t, d]) => `<div class="feat"><div class="icon-tile">${icon(ic, "lg")}</div><h3>${t}</h3><p>${d}</p></div>`).join("");
    $("#featured").innerHTML = skeletons(3);
    await boot("index.html");
    try {
        const d = await api("/api/store/products"); const ps = d.products || [];
        const avail = ps.filter(p => p.status === "available");
        $("#stProducts").textContent = avail.length;
        const pool = avail.filter(p => !p.isSupport); const feat = [...pool.filter(p => p.featured), ...pool.filter(p => !p.featured).reverse()].slice(0, 3);
        $("#featured").innerHTML = feat.map(productCard).join("") || '<div class="empty" style="grid-column:1/-1">لا توجد منتجات حالياً</div>';
        const counts = {}; ps.forEach(p => { if (p.status !== "hidden") counts[p.category] = (counts[p.category] || 0) + 1; });
        $("#cats").innerHTML = Object.keys(counts).map(c => { const m = catMeta[c] || [c, "bag"]; return `<a class="cat" href="store.html?cat=${encodeURIComponent(c)}"><div class="icon-tile">${icon(m[1], "lg")}</div><div><b>${esc(m[0])}</b><small>${counts[c]} منتج</small></div></a>`; }).join("");
    } catch (e) { $("#featured").innerHTML = `<div class="empty" style="grid-column:1/-1">${esc(e.message)}</div>`; }
    try {
        const r = await api("/api/store/reviews?limit=6");
        $("#stReviews").textContent = r.summary.count; $("#stAvg").textContent = r.summary.count ? r.summary.avg : "—";
        $("#reviews").innerHTML = r.reviews.length ? r.reviews.map(v => `<div class="rv"><div class="rv-top">${avatarHtml(v.avatar, v.username)}<div><div class="rv-name">${esc(v.username)}<span class="chip ok">${icon("check")} مشتري موثّق</span></div><div class="rv-date">${fmtDate(v.createdAt)}</div></div></div>${stars(v.rating)}<p class="rv-text">${esc(v.comment)}</p><div class="rv-prod">${icon("bag", "sm")}<a href="product.html?id=${v.productId}">${esc(v.productTitle)}</a></div></div>`).join("") : '<div class="empty" style="grid-column:1/-1"><h3>كن أول من يقيّم</h3>اشترِ منتجاً وشاركنا رأيك.</div>';
    } catch { $("#reviews").innerHTML = ""; }
    CA.reveal();
})();
