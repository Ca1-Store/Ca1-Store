(async function () {
    const { $, t, icon, api, boot, productCard, skeletons, esc, catName, startCountdowns } = CA;
    $("#sI").innerHTML = icon("search", "sm"); $("#grid").innerHTML = skeletons(6);
    let all = [], cat = new URLSearchParams(location.search).get("cat") || "all";
    await boot("store.html");
    async function load() { try { all = (await api("/api/store/products")).products || []; } catch (e) { $("#grid").innerHTML = `<div class="empty" style="grid-column:1/-1">${esc(e.message)}</div>`; return false; } return true; }
    if (!await load()) return;
    function tabs() {
        const cs = [...new Set(all.map(p => p.category))];
        $("#tabs").innerHTML = [["all", t("all"), all.length], ...cs.map(c => [c, catName(c), all.filter(p => p.category === c).length])]
            .map(([k, n, c]) => `<button class="tab ${k === cat ? "on" : ""}" data-c="${esc(k)}">${esc(n)}<small>${c}</small></button>`).join("");
    }
    function draw() {
        const q = $("#q").value.trim().toLowerCase(), s = $("#sort").value, av = $("#onlyAvail").checked, of = $("#onlyOffers").checked;
        let l = all.filter(p => (cat === "all" || p.category === cat) && (!av || p.status === "available") && (!of || p.offerEndsAt) && (!q || (p.title + " " + p.titleEn + " " + p.description).toLowerCase().includes(q)));
        if (s === "pa") l.sort((a, b) => a.price - b.price); else if (s === "pd") l.sort((a, b) => b.price - a.price); else if (s === "rt") l.sort((a, b) => (b.rating.avg || 0) - (a.rating.avg || 0)); else if (s === "sold") l.sort((a, b) => b.sold - a.sold);
        else l.sort((a, b) => (a.status === "out") - (b.status === "out"));
        $("#grid").innerHTML = l.length ? l.map(productCard).join("") : `<div class="empty" style="grid-column:1/-1"><div class="icon-tile">${icon("search", "lg")}</div><h3>${t("no_results")}</h3>${t("no_results_s")}</div>`;
        startCountdowns();
    }
    $("#tabs").onclick = e => { const b = e.target.closest(".tab"); if (!b) return; cat = b.dataset.c; tabs(); draw(); history.replaceState(null, "", cat === "all" ? "store.html" : "?cat=" + encodeURIComponent(cat)); };
    ["q", "sort", "onlyAvail", "onlyOffers"].forEach(i => $("#" + i).addEventListener("input", draw));
    document.addEventListener("ca:expired", async () => { if (await load()) { tabs(); draw(); } });
    tabs(); draw();
})();
