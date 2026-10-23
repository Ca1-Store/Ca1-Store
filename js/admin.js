(async function () {
    const { $, $$, icon, api, auth, boot, esc, toast, modal, confirmBox, fmtPrice, fmtDate, imgSrc, stars, catName } = CA;
    const app = $("#app");
    await boot("");
    if (!auth.user) { app.innerHTML = `<div class="empty guard"><div class="icon-tile">${icon("lock", "lg")}</div><h3>لوحة التحكم للإدارة فقط</h3><p style="margin-bottom:18px">سجّل الدخول بحساب ديسكورد المخوّل.</p><button class="btn btn-primary" id="lg">${icon("discord", "sm")} تسجيل الدخول</button></div>`; $("#lg").onclick = () => auth.login("admin.html"); return; }
    if (!auth.user.isAdmin) { app.innerHTML = `<div class="empty guard"><div class="icon-tile">${icon("shield", "lg")}</div><h3>ليست لديك صلاحية</h3><a class="btn" href="index.html">العودة للرئيسية</a></div>`; return; }

    const PLANS = ["", "CA-1", "CA-2", "CA-3", "CA-4", "CA-5"];
    const STATUS = { available: ["متوفر", "ok"], out: ["غير متوفر", "err"], hidden: ["مخفي", "warn"] };
    let tab = "overview", products = [];
    app.innerHTML = `<div class="adm-head"><div><span class="eyebrow">الإدارة</span><h1 class="page-title">لوحة التحكم</h1></div><a class="btn" href="store.html" target="_blank">${icon("eye", "sm")} عرض المتجر</a></div>
      <div class="adm-tabs" id="tabs"></div><div id="view"></div>`;
    const TABS = [["overview", "نظرة عامة", "chart"], ["products", "المنتجات", "bag"], ["reviews", "التقييمات", "star"], ["purchases", "المشتريات", "card"]];
    function tabs() { $("#tabs").innerHTML = TABS.map(([k, n, ic]) => `<button class="tab ${k === tab ? "on" : ""}" data-t="${k}">${icon(ic, "sm")} ${n}</button>`).join(""); }
    $("#tabs").onclick = e => { const b = e.target.closest("[data-t]"); if (b) { tab = b.dataset.t; go(); } };
    const A = (p, o) => api("/api/admin/store" + p, o);
    async function loadProducts() { products = (await A("/products")).products; }
    async function go() { tabs(); $("#view").innerHTML = '<div class="skeleton" style="height:240px"></div>'; try { await ({ overview, products: viewProducts, reviews: viewReviews, purchases: viewPurchases })[tab](); } catch (e) { $("#view").innerHTML = `<div class="empty">${esc(e.message)}</div>`; } }

    async function overview() {
        const { stats: s } = await A("/stats");
        const cards = [["bag", "المنتجات", s.products], ["check", "المتوفرة", s.available], ["card", "المشتريات", s.purchases], ["money", "الإيرادات ($)", fmtPrice(s.revenue)], ["star", "التقييمات", s.reviews], ["sparkle", "متوسط التقييم", s.avgRating || "—"]];
        $("#view").innerHTML = `<div class="stat-grid">${cards.map(([ic, n, v]) => `<div class="stat"><div class="icon-tile" style="margin:0;width:42px;height:42px">${icon(ic)}</div><b>${v}</b><span>${n}</span></div>`).join("")}</div>
          <div class="notice" style="margin-top:22px">${icon("info")}<div>من تبويب <b>المنتجات</b> أضف منتجاً جديداً وألصق <b>رابط الدفع</b> (PayPal)، ويمكنك تعديل السعر مباشرة من الجدول أو تغيير الحالة إلى «غير متوفر» لإيقاف البيع.</div></div>`;
    }

    /* ---------- products ---------- */
    async function viewProducts() {
        await loadProducts();
        $("#view").innerHTML = `<div style="display:flex;justify-content:space-between;margin-bottom:16px;gap:10px;flex-wrap:wrap"><p style="color:var(--text-2)">${products.length} منتج</p><button class="btn btn-primary" id="add">${icon("plus", "sm")} إضافة منتج</button></div>
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th></th><th>المنتج</th><th>السعر ($)</th><th>الحالة</th><th>رابط الدفع</th><th>الترتيب</th><th></th></tr></thead><tbody>
        ${products.map((p, i) => `<tr data-id="${p.id}"><td>${p.image ? `<img class="thumb" src="${esc(imgSrc(p.image))}" alt="" onerror="this.style.visibility='hidden'">` : '<div class="thumb"></div>'}</td>
          <td><div class="t-title">${esc(p.title)}</div><small style="color:var(--text-3)">${esc(catName(p.category))}${p.plan ? " · " + p.plan : ""}${p.featured ? " · مميّز" : ""}</small></td>
          <td><input class="price-in" type="number" min="0" step="0.01" value="${p.price}" data-price="${p.id}" aria-label="السعر"></td>
          <td><span class="chip ${STATUS[p.status][1]}">${STATUS[p.status][0]}</span></td>
          <td><div class="link-cell" title="${esc(p.paymentUrl || "")}">${p.paymentUrl ? esc(p.paymentUrl) : '<span style="color:var(--err)">— لا يوجد —</span>'}</div></td>
          <td><div class="act" style="justify-content:flex-start"><button class="btn btn-sm btn-icon" data-mv="-1" ${i === 0 ? "disabled" : ""} aria-label="أعلى">${icon("up", "sm")}</button><button class="btn btn-sm btn-icon" data-mv="1" ${i === products.length - 1 ? "disabled" : ""} aria-label="أسفل">${icon("down", "sm")}</button></div></td>
          <td><div class="act"><button class="btn btn-sm" data-edit>${icon("edit", "sm")} تعديل</button><button class="btn btn-sm btn-danger btn-icon" data-rm aria-label="حذف">${icon("trash", "sm")}</button></div></td></tr>`).join("")}
        </tbody></table></div>`;
        $("#add").onclick = () => editor();
    }
    $("#view").addEventListener("click", async e => {
        const tr = e.target.closest("tr[data-id]"); if (!tr || tab !== "products") return; const id = +tr.dataset.id, p = products.find(x => x.id === id);
        if (e.target.closest("[data-edit]")) editor(p);
        else if (e.target.closest("[data-rm]")) { if (await confirmBox("حذف المنتج", `سيتم حذف «${p.title}» وجميع تقييماته نهائياً. هل أنت متأكد؟`, "حذف نهائي")) { try { await A("/products/" + id, { method: "DELETE" }); toast("تم حذف المنتج"); go(); } catch (er) { toast(er.message, "err"); } } }
        else if (e.target.closest("[data-mv]")) {
            const d = +e.target.closest("[data-mv]").dataset.mv, i = products.findIndex(x => x.id === id), j = i + d; if (j < 0 || j >= products.length) return;
            [products[i], products[j]] = [products[j], products[i]];
            try { await Promise.all(products.map((x, k) => x.sortOrder !== k ? A("/products/" + x.id, { method: "PUT", body: { sortOrder: k } }) : null)); go(); } catch (er) { toast(er.message, "err"); }
        }
    });
    $("#view").addEventListener("change", async e => {
        const inp = e.target.closest("[data-price]"); if (!inp) return; const id = +inp.dataset.price, p = products.find(x => x.id === id);
        try { await A("/products/" + id, { method: "PUT", body: { price: inp.value } }); p.price = +inp.value; toast("تم تحديث السعر"); } catch (er) { toast(er.message, "err"); inp.value = p.price; }
    });
    function editor(p) {
        const n = !p; p = p || { title: "", description: "", price: "", oldPrice: "", image: "", category: "fivem", status: "available", plan: "", paymentUrl: "", featured: false, isSupport: false };
        const cats = [...new Set(["fivem", "discord", "subscriptions", "support", ...products.map(x => x.category)])];
        modal(`<h3>${n ? "إضافة منتج جديد" : "تعديل المنتج"}</h3><form id="pf" class="form-grid" style="margin-top:16px" autocomplete="off">
          <div class="fld full"><label>اسم المنتج <span class="req">*</span></label><input class="input" name="title" required value="${esc(p.title)}"></div>
          <div class="fld full"><label>رابط الدفع (PayPal) <span class="req">*</span></label><input class="input ltr" style="width:100%" name="paymentUrl" type="url" placeholder="https://www.paypal.com/ncp/payment/XXXXXXXX" value="${esc(p.paymentUrl || "")}"><small>الرابط نفسه الذي كنت تستخدمه في الكود القديم. مطلوب إذا كان المنتج «متوفر».</small></div>
          <div class="fld"><label>السعر ($) <span class="req">*</span></label><input class="input" name="price" type="number" min="0" step="0.01" required value="${p.price}"></div>
          <div class="fld"><label>السعر القديم (قبل الخصم)</label><input class="input" name="oldPrice" type="number" min="0" step="0.01" value="${p.oldPrice ?? ""}"></div>
          <div class="fld"><label>الحالة</label><select class="select" name="status">${Object.entries(STATUS).map(([k, v]) => `<option value="${k}" ${p.status === k ? "selected" : ""}>${v[0]}</option>`).join("")}</select></div>
          <div class="fld"><label>التصنيف</label><input class="input" name="category" list="cl" value="${esc(p.category)}"><datalist id="cl">${cats.map(c => `<option value="${esc(c)}">`).join("")}</datalist></div>
          <div class="fld"><label>اسم الصورة أو رابطها</label><input class="input ltr" style="width:100%" name="image" value="${esc(p.image || "")}" placeholder="CA-1.png أو https://..."><small>الملفات تُرفع داخل مجلد assets/products</small></div>
          <div class="fld"><label>النسخة (Plan) لتفعيل التقييم والرتبة</label><select class="select" name="plan">${PLANS.map(x => `<option value="${x}" ${p.plan === x || (!p.plan && !x) ? "selected" : ""}>${x || "— بدون —"}</option>`).join("")}</select></div>
          <div class="fld full"><label>الوصف</label><textarea class="textarea" name="description" style="min-height:170px" placeholder="كل سطر في فقرة. الأسطر التي تبدأ بـ 🔹 تظهر كنقاط مميزات.">${esc(p.description || "")}</textarea></div>
          <div class="full checks"><label class="switch"><input type="checkbox" name="featured" ${p.featured ? "checked" : ""}><i></i>منتج مميّز (يظهر في الرئيسية)</label><label class="switch"><input type="checkbox" name="isSupport" ${p.isSupport ? "checked" : ""}><i></i>منتج دعم (تبرّع)</label></div>
          <div class="full" style="display:flex;gap:10px"><button class="btn btn-primary" style="flex:1" type="submit" id="sv">${n ? "إضافة المنتج" : "حفظ التغييرات"}</button><button class="btn" type="button" id="cn">إلغاء</button></div></form>`,
        (ov, close) => {
            ov.firstElementChild.classList.add("wide"); $("#cn", ov).onclick = close;
            $("#pf", ov).onsubmit = async ev => {
                ev.preventDefault(); const f = new FormData(ev.target), body = Object.fromEntries(f.entries());
                body.featured = !!f.get("featured"); body.isSupport = !!f.get("isSupport"); const sv = $("#sv", ov); sv.disabled = true;
                try { await A(n ? "/products" : "/products/" + p.id, { method: n ? "POST" : "PUT", body }); toast(n ? "تمت إضافة المنتج" : "تم حفظ التغييرات"); close(); go(); } catch (er) { toast(er.message, "err"); sv.disabled = false; }
            };
        });
    }

    /* ---------- reviews ---------- */
    async function viewReviews() {
        const { reviews } = await A("/reviews");
        $("#view").innerHTML = reviews.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>العميل</th><th>المنتج</th><th>التقييم</th><th>التعليق</th><th>التاريخ</th><th></th></tr></thead><tbody>${reviews.map(r => `<tr><td><b>${esc(r.username)}</b><br><small class="ltr" style="color:var(--text-3)">${esc(r.discordId || "")}</small></td><td>${esc(r.productTitle || r.productId)}</td><td>${stars(r.rating)}</td><td style="max-width:300px;white-space:normal">${esc(r.comment)}</td><td>${fmtDate(r.createdAt)}</td><td><div class="act"><button class="btn btn-sm btn-danger btn-icon" data-rdel="${r.id}" aria-label="حذف">${icon("trash", "sm")}</button></div></td></tr>`).join("")}</tbody></table></div>` : '<div class="empty"><h3>لا توجد تقييمات</h3></div>';
    }
    $("#view").addEventListener("click", async e => { const b = e.target.closest("[data-rdel]"); if (!b) return; if (await confirmBox("حذف التقييم", "سيتم حذف هذا التقييم نهائياً.", "حذف")) { try { await api("/api/store/reviews/" + b.dataset.rdel, { method: "DELETE" }); toast("تم الحذف"); go(); } catch (er) { toast(er.message, "err"); } } });

    /* ---------- purchases ---------- */
    async function viewPurchases() {
        const [{ purchases }] = [await A("/purchases")]; await loadProducts();
        $("#view").innerHTML = `<form id="mp" class="form-card" style="margin-bottom:20px;display:grid;grid-template-columns:1.2fr 1.4fr auto;gap:12px;align-items:end"><div class="fld"><label>آيدي ديسكورد للعميل</label><input class="input ltr" style="width:100%" name="discordId" inputmode="numeric" placeholder="123456789012345678" required></div><div class="fld"><label>المنتج</label><select class="select" name="productId">${products.map(p => `<option value="${p.id}">${esc(p.title)}</option>`).join("")}</select></div><button class="btn btn-primary" type="submit">${icon("plus", "sm")} تسجيل شراء يدوي</button><small style="grid-column:1/-1;color:var(--text-3)">استخدمها لعميل دفع خارج النظام ليتمكن من تقييم المنتج.</small></form>
        ${purchases.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>العميل (ID)</th><th>المنتج</th><th>المبلغ</th><th>الطريقة</th><th>المصدر</th><th>التاريخ</th><th></th></tr></thead><tbody>${purchases.map(x => `<tr><td class="ltr">${esc(x.discordId)}</td><td>${esc(x.productTitle || x.plan || "—")}</td><td class="ltr">$${esc(x.amount ?? "")}</td><td>${esc(x.method || "")}</td><td>${esc(x.source || "")}</td><td>${fmtDate(x.createdAt)}</td><td><div class="act"><button class="btn btn-sm btn-danger btn-icon" data-pdel="${x.id}" aria-label="حذف">${icon("trash", "sm")}</button></div></td></tr>`).join("")}</tbody></table></div>` : '<div class="empty"><h3>لا توجد مشتريات مسجّلة</h3></div>'}`;
        $("#mp").onsubmit = async ev => { ev.preventDefault(); const b = Object.fromEntries(new FormData(ev.target)); try { await A("/purchases", { method: "POST", body: b }); toast("تم تسجيل الشراء"); go(); } catch (er) { toast(er.message, "err"); } };
    }
    $("#view").addEventListener("click", async e => { const b = e.target.closest("[data-pdel]"); if (!b) return; if (await confirmBox("حذف سجل الشراء", "سيفقد العميل إمكانية التقييم (ما لم يملك الرتبة).", "حذف")) { try { await A("/purchases/" + b.dataset.pdel, { method: "DELETE" }); toast("تم الحذف"); go(); } catch (er) { toast(er.message, "err"); } } });
    go();
})();
