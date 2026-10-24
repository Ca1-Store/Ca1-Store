(async function () {
    const { $, t, icon, api, auth, boot, esc, fmtDate, imgSrc, ptitle, catName, usd, money, C, isAr } = CA;
    await boot("my-orders.html");
    const v = $("#view");
    if (!auth.user) { v.innerHTML = `<div class="empty"><div class="icon-tile">${icon("lock", "lg")}</div><h3>${t("or_login_t")}</h3><p style="margin-bottom:18px">${t("or_login_d")}</p><button class="btn btn-primary" id="lg">${icon("discord", "sm")} ${t("login")}</button></div>`; $("#lg").onclick = () => auth.login("my-orders.html"); return; }
    try {
        const d = await api("/api/store/my/purchases"); const list = d.purchases;
        const title = x => x.product ? (!isAr && x.product.titleEn ? x.product.titleEn : x.product.title) : "—";
        const card = x => {
            const p = x.product, role = x.source === "discord-role";
            const img = p && p.image ? imgSrc(p.image) : "";
            return `<article class="order">
              <div class="o-img"><img src="assets/emblem.png" alt="">${img ? `<img class="o-real" src="${img}" alt="" loading="lazy" onerror="this.remove()">` : ""}</div>
              <div class="o-main">
                <div class="o-top"><h3>${p ? `<a href="product.html?id=${p.id}">${esc(title(x))}</a>` : esc(title(x))}</h3>
                  <span class="chip ${role ? "silver" : "ok"}">${icon(role ? "discord" : "check", "sm")} ${role ? t("or_from_role") : t("or_paid")}</span></div>
                <div class="o-meta">
                  ${x.createdAt ? `<span>${icon("clock", "sm")} ${fmtDate(x.createdAt)}</span>` : ""}
                  ${x.amount ? `<span>${icon("card", "sm")} <b class="ltr">$${esc(Number(x.amount).toFixed(2))}</b></span>` : ""}
                  ${x.method ? `<span>${esc(x.method === "Manual" ? t("or_manual") : x.method)}</span>` : ""}
                  ${x.couponCode ? `<span class="chip">${icon("tag", "sm")} <span class="ltr">${esc(x.couponCode)}</span></span>` : ""}
                  ${p && p.plan ? `<span class="chip">${esc(p.plan)}</span>` : ""}
                </div>
                <div class="o-act">
                  ${p ? `<a class="btn btn-sm btn-primary" href="product.html?id=${p.id}#reviewsSec">${icon("star", "sm")} ${x.myRating ? t("or_edit") : t("or_rate")}</a>` : ""}
                  ${x.myRating ? `<span class="o-rate">${t("or_your")}: ${CA.stars(x.myRating)}</span>` : ""}
                  <a class="btn btn-sm" href="${esc(C.DISCORD_INVITE)}" target="_blank" rel="noopener">${icon("ticket", "sm")} ${t("or_support")}</a>
                </div></div></article>`;
        };
        const roles = list.filter(x => x.source === "discord-role"), hist = list.filter(x => x.source !== "discord-role");
        if (!list.length) { v.innerHTML = `<div class="empty"><div class="icon-tile">${icon("box", "lg")}</div><h3>${t("or_none_t")}</h3><p style="margin-bottom:18px">${t("or_none_d")}</p><a class="btn btn-primary" href="store.html">${t("nav_store")}</a></div>`; return; }
        v.innerHTML = `${roles.length ? `<h2 class="o-h">${t("or_active")}</h2><p class="sec-sub" style="margin:-4px 0 14px">${t("or_active_d")}</p><div class="o-list">${roles.map(card).join("")}</div>` : ""}
          ${hist.length ? `<h2 class="o-h" style="margin-top:34px">${t("or_history")}</h2><div class="o-list">${hist.map(card).join("")}</div>` : ""}`;
    } catch (e) { v.innerHTML = `<div class="empty">${esc(e.message)}</div>`; }
})();
