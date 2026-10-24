(async function () {
    const { $, t, icon, api, boot, productCard, skeletons, esc, stars, fmtDate, avatarHtml, catMeta, catName, compareHtml, initCompare, startCountdowns, ptitle } = CA;
    const nf = n => Number(n).toLocaleString("en");
    $("#arr1").innerHTML = icon("arrow", "sm");
    $("#fi1").innerHTML = icon("lock", "lg"); $("#fi2").innerHTML = icon("bolt", "lg"); $("#fi3").innerHTML = icon("chat", "lg");
    const words = ["mq1", "mq2", "mq3", "mq4", "mq5", "mq6", "mq7"].map(k => t(k));
    $("#mq").innerHTML = [...words, ...words, ...words, ...words].map(w => `<span>${w}</span>`).join("");
    $("#faqList").innerHTML = [1, 2, 3, 4, 5].map(i => `<details><summary>${t("q" + i)}<span>${icon("chev", "sm")}</span></summary><p>${t("a" + i)}</p></details>`).join("");
    $("#steps").innerHTML = [["user", "s1"], ["card", "s2"], ["ticket", "s3"]].map(([ic, k], i) => `<div class="step"><div class="step-n">${icon(ic, "lg")}</div><h3>${i + 1}. ${t(k + "_t")}</h3><p>${t(k + "_d")}</p></div>`).join("");
    $("#feats").innerHTML = [["shield", "f1"], ["bolt", "f2"], ["star", "f3"], ["gamepad", "f4"], ["chat", "f5"], ["refresh", "f6"]].map(([ic, k]) => `<div class="feat"><div class="icon-tile">${icon(ic, "lg")}</div><h3>${t(k + "_t")}</h3><p>${t(k + "_d")}</p></div>`).join("");
    $("#featured").innerHTML = skeletons(3);
    await boot("index.html");

    async function loadProducts() {
        try {
            const d = await api("/api/store/products"); const ps = d.products || [];
            const avail = ps.filter(p => p.status === "available" && !p.isSupport);
            const feat = [...avail.filter(p => p.featured), ...avail.filter(p => !p.featured).sort((a, b) => b.sold - a.sold)].slice(0, 3);
            $("#featured").innerHTML = feat.map(productCard).join("") || `<div class="empty" style="grid-column:1/-1">—</div>`;
            const offers = avail.filter(p => p.offerEndsAt);
            $("#offersSec").classList.toggle("hidden", !offers.length);
            $("#offers").innerHTML = offers.map(productCard).join("");
            const withCmp = ps.find(p => p.status !== "hidden" && p.media && p.media.compare && p.media.compare.length);
            $("#diffSec").classList.toggle("hidden", !withCmp);
            if (withCmp) { $("#diff").innerHTML = compareHtml(withCmp.media.compare.slice(0, 1)); initCompare($("#diff")); $("#diffLink").href = "product.html?id=" + withCmp.id; }
            const counts = {}; ps.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
            $("#cats").innerHTML = Object.keys(counts).map(c => { const m = catMeta[c] || [c, "bag"]; return `<a class="cat" href="store.html?cat=${encodeURIComponent(c)}"><div class="icon-tile">${icon(m[1], "lg")}</div><div><b>${esc(catName(c))}</b><small>${t("n_products", { n: counts[c] })}</small></div></a>`; }).join("");
            startCountdowns(); CA.reveal();
        } catch (e) { $("#featured").innerHTML = `<div class="empty" style="grid-column:1/-1">${esc(e.message)}</div>`; }
    }
    loadProducts();
    document.addEventListener("ca:expired", loadProducts);

    try {
        const s = await api("/api/store/public-stats");
        $("#stCustomers").textContent = nf(s.customers) + "+"; $("#stSales").textContent = nf(s.sales) + "+"; $("#stAvg").textContent = s.reviews.count ? s.reviews.avg : "—";
    } catch { ["stCustomers", "stSales", "stAvg"].forEach(i => $("#" + i).textContent = "—"); }
    try {
        const r = await api("/api/store/reviews?limit=6");
        $("#reviews").innerHTML = r.reviews.length ? r.reviews.map(v => `<div class="rv"><div class="rv-top">${avatarHtml(v.avatar, v.username)}<div><div class="rv-name">${esc(v.username)}<span class="chip ok">${icon("check")} ${t("verified")}</span></div><div class="rv-date">${fmtDate(v.createdAt)}</div></div></div>${stars(v.rating)}${v.comment ? `<p class="rv-text">${esc(v.comment)}</p>` : ""}<div class="rv-prod">${icon("bag", "sm")}<a href="product.html?id=${v.productId}">${esc(v.productTitle)}</a></div></div>`).join("") : `<div class="empty" style="grid-column:1/-1"><h3>${t("be_first")}</h3>${t("be_first_s")}</div>`;
    } catch { $("#reviews").innerHTML = ""; }
    CA.reveal();
})();
