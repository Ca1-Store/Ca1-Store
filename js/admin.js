(async function () {
    const { $, $$, icon, api, auth, boot, esc, toast, modal, confirmBox, fmtDate, imgSrc, stars, catName } = CA;
    const app = $("#app");
    await boot("");
    if (!auth.user) { app.innerHTML = `<div class="empty guard"><div class="icon-tile">${icon("lock", "lg")}</div><h3>لوحة التحكم للإدارة فقط</h3><p style="margin-bottom:18px">سجّل الدخول بحساب ديسكورد المخوّل.</p><button class="btn btn-primary" id="lg">${icon("discord", "sm")} تسجيل الدخول</button></div>`; $("#lg").onclick = () => auth.login("admin.html"); return; }
    if (!auth.user.isAdmin) { app.innerHTML = `<div class="empty guard"><div class="icon-tile">${icon("shield", "lg")}</div><h3>ليست لديك صلاحية</h3><a class="btn" href="index.html">العودة للرئيسية</a></div>`; return; }

    const perms = auth.user.perms || [], isMain = !!auth.user.isMain, has = p => perms.includes(p);
    const PLANS = ["", "CA-1", "CA-2", "CA-3", "CA-4", "CA-5"];
    const STATUS = { available: ["متوفر", "ok"], out: ["غير متوفر", "err"], hidden: ["مخفي", "warn"] };
    const PERM_LABEL = { products: "المنتجات", reviews: "التقييمات", purchases: "المشتريات", coupons: "أكواد الخصم", settings: "الإعدادات" };
    const TABS = [["overview", "نظرة عامة", "chart", true], ["products", "المنتجات", "bag", has("products")], ["coupons", "أكواد الخصم", "tag", has("coupons")], ["reviews", "التقييمات", "star", has("reviews")], ["purchases", "المشتريات", "card", has("purchases")], ["settings", "الإعدادات", "info", has("settings")], ["admins", "الأدمنز", "users", isMain], ["audit", "سجل العمليات", "file", isMain]].filter(x => x[3]);
    let tab = "overview", products = [];
    const dt = d => { try { return new Date(d).toLocaleString("ar", { dateStyle: "medium", timeStyle: "short" }); } catch { return ""; } };
    const toLocalInput = iso => { if (!iso) return ""; const d = new Date(iso), p = n => String(n).padStart(2, "0"); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`; };
    const fromLocalInput = v => v ? new Date(v).toISOString() : "";

    app.innerHTML = `<div class="adm-head"><div><span class="eyebrow">الإدارة</span><h1 class="page-title">لوحة التحكم</h1></div><a class="btn" href="store.html" target="_blank">${icon("eye", "sm")} عرض المتجر</a></div>
      <div class="adm-tabs" id="tabs"></div><div id="view"></div>`;
    function tabs() { $("#tabs").innerHTML = TABS.map(([k, n, ic]) => `<button class="tab ${k === tab ? "on" : ""}" data-t="${k}">${icon(ic, "sm")} ${n}</button>`).join(""); }
    $("#tabs").onclick = e => { const b = e.target.closest("[data-t]"); if (b) { tab = b.dataset.t; go(); } };
    const A = (p, o) => api("/api/admin/store" + p, o);
    async function loadProducts() { products = (await A("/products")).products; }
    const VIEWS = { overview, products: viewProducts, coupons: viewCoupons, reviews: viewReviews, purchases: viewPurchases, settings: viewSettings, admins: viewAdmins, audit: viewAudit };
    async function go() { tabs(); $("#view").innerHTML = '<div class="skeleton" style="height:240px"></div>'; try { await VIEWS[tab](); } catch (e) { $("#view").innerHTML = `<div class="empty">${esc(e.message)}</div>`; } }
    const empty = (t, ic = "box") => `<div class="empty"><div class="icon-tile">${icon(ic, "lg")}</div><h3>${t}</h3></div>`;
    const act = (a, id, label, ic, cls = "") => `<button class="btn btn-sm ${cls}" data-a="${a}" data-id="${id}">${ic ? icon(ic, "sm") : ""}${label ? " " + label : ""}</button>`;

    /* ---------- overview ---------- */
    async function overview() {
        const { stats: s } = await A("/stats");
        const cards = [["bag", "المنتجات", s.products], ["check", "المتوفرة", s.available], ["card", "المشتريات", s.purchases], ["money", "الإيرادات ($)", CA.fmtPrice(s.revenue)], ["star", "التقييمات", s.reviews], ["sparkle", "متوسط التقييم", s.avgRating || "—"], ["tag", "أكواد فعّالة", s.liveCoupons]];
        $("#view").innerHTML = `<div class="stat-grid">${cards.map(([ic, n, v]) => `<div class="stat"><div class="icon-tile" style="margin:0;width:42px;height:42px">${icon(ic)}</div><b>${v}</b><span>${n}</span></div>`).join("")}</div>
          <div class="notice" style="margin-top:22px">${icon("info")}<div>صلاحياتك: <b>${isMain ? "أدمن أساسي (كل الصلاحيات)" : perms.map(p => PERM_LABEL[p]).join("، ")}</b>.<br>أضف منتجاً من تبويب <b>المنتجات</b> وألصق <b>رابط الدفع</b>، وأنشئ عروضاً بعدّاد من خانة «نهاية العرض»، وأكواد خصم من <b>أكواد الخصم</b>.</div></div>`;
    }

    /* ---------- products ---------- */
    async function viewProducts() {
        await loadProducts();
        $("#view").innerHTML = `<div style="display:flex;justify-content:space-between;margin-bottom:16px;gap:10px;flex-wrap:wrap"><p style="color:var(--text-2)">${products.length} منتج</p><button class="btn btn-primary" data-a="add">${icon("plus", "sm")} إضافة منتج</button></div>
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th></th><th>المنتج</th><th>السعر ($)</th><th>المبيعات</th><th>الحالة</th><th>رابط الدفع</th><th>الترتيب</th><th></th></tr></thead><tbody>
        ${products.map((p, i) => `<tr data-id="${p.id}"><td>${p.image ? `<img class="thumb" src="${esc(imgSrc(p.image))}" alt="" onerror="this.style.visibility='hidden'">` : '<div class="thumb"></div>'}</td>
          <td><div class="t-title">${esc(p.title)}</div><small style="color:var(--text-3)">${esc(catName(p.category))}${p.plan ? " · " + p.plan : ""}${p.featured ? " · مميّز" : ""}</small>
            ${p.rawOfferEndsAt ? `<div><span class="chip ${p.offerExpired ? "err" : "warn"}" style="margin-top:4px">${icon("clock")} ${p.offerExpired ? "عرض منتهٍ — السعر الحالي $" + CA.fmtPrice(p.price) : "عرض حتى " + dt(p.rawOfferEndsAt)}</span></div>` : ""}</td>
          <td><input class="price-in" type="number" min="0" step="0.01" value="${p.rawPrice}" data-price="${p.id}" aria-label="السعر"></td>
          <td>${p.isSupport ? "—" : `<b>${p.sold}</b>`}</td>
          <td><span class="chip ${STATUS[p.status][1]}">${STATUS[p.status][0]}</span></td>
          <td><div class="link-cell" title="${esc(p.paymentUrl || "")}">${p.paymentUrl ? esc(p.paymentUrl) : '<span style="color:var(--err)">— لا يوجد —</span>'}</div></td>
          <td><div class="act" style="justify-content:flex-start"><button class="btn btn-sm btn-icon" data-a="mv" data-d="-1" ${i === 0 ? "disabled" : ""} aria-label="أعلى">${icon("up", "sm")}</button><button class="btn btn-sm btn-icon" data-a="mv" data-d="1" ${i === products.length - 1 ? "disabled" : ""} aria-label="أسفل">${icon("down", "sm")}</button></div></td>
          <td><div class="act"><button class="btn btn-sm" data-a="edit">${icon("edit", "sm")} تعديل</button><button class="btn btn-sm btn-danger btn-icon" data-a="rm" aria-label="حذف">${icon("trash", "sm")}</button></div></td></tr>`).join("")}
        </tbody></table></div>`;
    }
    function editor(p) {
        const n = !p; p = p || { title: "", titleEn: "", description: "", descriptionEn: "", rawPrice: "", rawOldPrice: "", image: "", category: "fivem", status: "available", plan: "", paymentUrl: "", featured: false, isSupport: false, soldBase: 0, rawOfferEndsAt: null, media: {} };
        const cats = [...new Set(["fivem", "discord", "subscriptions", "support", ...products.map(x => x.category)])];
        const m = p.media || {};
        const gal = (m.gallery || []).map(x => x.type === "youtube" ? "https://youtu.be/" + x.url : x.url).join("\n");
        const cmp = (m.compare || []).map(c => [c.before, c.after, c.label || ""].join(" | ").replace(/( \| )+$/, "")).join("\n");
        modal(`<h3>${n ? "إضافة منتج جديد" : "تعديل المنتج"}</h3><form id="pf" class="form-grid" style="margin-top:16px" autocomplete="off">
          <div class="fld full"><label>اسم المنتج <span class="req">*</span></label><input class="input" name="title" required value="${esc(p.title)}"></div>
          <div class="fld full"><label>الاسم بالإنجليزي (اختياري — يظهر في النسخة الإنجليزية)</label><input class="input ltr" style="width:100%" name="titleEn" value="${esc(p.titleEn || "")}"></div>
          <div class="fld full"><label>رابط الدفع (PayPal) <span class="req">*</span></label><input class="input ltr" style="width:100%" name="paymentUrl" type="url" placeholder="https://www.paypal.com/ncp/payment/XXXXXXXX" value="${esc(p.paymentUrl || "")}"><small>الرابط نفسه الذي كنت تستخدمه في الكود القديم. مطلوب إذا كان المنتج «متوفر». يُستخدم كخيار الدفع بالبطاقة، والدفع الأساسي يتم تلقائياً بالسعر أدناه.</small></div>
          <div class="fld"><label>السعر الحالي ($) <span class="req">*</span></label><input class="input" name="price" type="number" min="0" step="0.01" required value="${p.rawPrice}"><small>أثناء العرض هذا هو سعر العرض.</small></div>
          <div class="fld"><label>السعر الأصلي/القديم ($)</label><input class="input" name="oldPrice" type="number" min="0" step="0.01" value="${p.rawOldPrice ?? ""}"><small>يرجع إليه السعر تلقائياً بعد انتهاء العرض.</small></div>
          <div class="fld full"><label>نهاية العرض (عدّاد تنازلي)</label><div style="display:flex;gap:8px;flex-wrap:wrap"><input class="input" style="flex:1;min-width:200px" name="offerEndsAt" type="datetime-local" value="${toLocalInput(p.rawOfferEndsAt)}"><button type="button" class="btn btn-sm" data-off="24">24 ساعة</button><button type="button" class="btn btn-sm" data-off="72">3 أيام</button><button type="button" class="btn btn-sm" data-off="168">7 أيام</button><button type="button" class="btn btn-sm btn-danger" data-off="0">إزالة العرض</button></div><small>يظهر العدّاد للزوار حتى هذا الوقت، ثم يعود السعر تلقائياً للسعر الأصلي. اتركه فارغاً بدون عرض.</small></div>
          <div class="fld"><label>الحالة</label><select class="select" name="status">${Object.entries(STATUS).map(([k, v]) => `<option value="${k}" ${p.status === k ? "selected" : ""}>${v[0]}</option>`).join("")}</select></div>
          <div class="fld"><label>التصنيف</label><input class="input" name="category" list="cl" value="${esc(p.category)}"><datalist id="cl">${cats.map(c => `<option value="${esc(c)}">`).join("")}</datalist></div>
          <div class="fld"><label>اسم الصورة الرئيسية أو رابطها</label><input class="input ltr" style="width:100%" name="image" value="${esc(p.image || "")}" placeholder="CA-1.png أو https://..."><small>الملفات تُرفع داخل مجلد assets/products</small></div>
          <div class="fld"><label>النسخة (Plan) لتفعيل الرتبة والتقييم</label><select class="select" name="plan">${PLANS.map(x => `<option value="${x}" ${p.plan === x || (!p.plan && !x) ? "selected" : ""}>${x || "— بدون —"}</option>`).join("")}</select></div>
          <div class="fld"><label>عدد المبيعات السابقة (يُضاف لعدّاد المبيعات)</label><input class="input" name="soldBase" type="number" min="0" value="${p.soldBase || 0}"></div>
          <div class="fld full"><label>الوصف</label><textarea class="textarea" name="description" style="min-height:150px" placeholder="كل سطر فقرة. الأسطر التي تبدأ بـ 🔹 تظهر كنقاط مميزات.">${esc(p.description || "")}</textarea></div>
          <div class="fld full"><label>الوصف بالإنجليزي (اختياري)</label><textarea class="textarea ltr" style="width:100%;min-height:110px" name="descriptionEn">${esc(p.descriptionEn || "")}</textarea></div>
          <div class="fld full"><label>معرض الصور والفيديو (رابط أو اسم ملف في كل سطر)</label><textarea class="textarea ltr" style="width:100%;min-height:100px" name="gallery" placeholder="shot1.png&#10;https://youtu.be/XXXXXXXXXXX&#10;https://example.com/video.mp4">${esc(gal)}</textarea><small>يدعم صور (png/jpg/webp)، فيديو mp4/webm، ورابط يوتيوب. حتى 12 عنصراً.</small></div>
          <div class="fld full"><label>صور قبل / بعد (سطر لكل مقارنة: قبل | بعد | عنوان اختياري)</label><textarea class="textarea ltr" style="width:100%;min-height:90px" name="compare" placeholder="before1.png | after1.png | مدينة لوس سانتوس">${esc(cmp)}</textarea><small>يظهر للزائر شريط قابل للتحريك. حتى 6 مقارنات.</small></div>
          <div class="full checks"><label class="switch"><input type="checkbox" name="featured" ${p.featured ? "checked" : ""}><i></i>منتج مميّز (يظهر في الرئيسية)</label><label class="switch"><input type="checkbox" name="isSupport" ${p.isSupport ? "checked" : ""}><i></i>منتج دعم (تبرّع)</label></div>
          <div class="full" style="display:flex;gap:10px"><button class="btn btn-primary" style="flex:1" type="submit" id="sv">${n ? "إضافة المنتج" : "حفظ التغييرات"}</button><button class="btn" type="button" id="cn">إلغاء</button></div></form>`,
        (ov, close) => {
            ov.firstElementChild.classList.add("wide"); $("#cn", ov).onclick = close;
            ov.addEventListener("click", e => { const b = e.target.closest("[data-off]"); if (!b) return; const h = +b.dataset.off, inp = $("[name=offerEndsAt]", ov); inp.value = h ? toLocalInput(new Date(Date.now() + h * 3600e3).toISOString()) : ""; });
            $("#pf", ov).onsubmit = async ev => {
                ev.preventDefault(); const f = new FormData(ev.target), body = Object.fromEntries(f.entries());
                body.featured = !!f.get("featured"); body.isSupport = !!f.get("isSupport"); body.offerEndsAt = fromLocalInput(body.offerEndsAt);
                const lines = s => String(s || "").split("\n").map(x => x.trim()).filter(Boolean);
                body.media = { gallery: lines(body.gallery), compare: lines(body.compare).map(l => { const [before, after, label] = l.split("|").map(x => x.trim()); return { before, after, label: label || "" }; }) };
                delete body.gallery; delete body.compare;
                const sv = $("#sv", ov); sv.disabled = true;
                try { await A(n ? "/products" : "/products/" + p.id, { method: n ? "POST" : "PUT", body }); toast(n ? "تمت إضافة المنتج" : "تم حفظ التغييرات"); close(); go(); } catch (er) { toast(er.message, "err"); sv.disabled = false; }
            };
        });
    }

    /* ---------- coupons ---------- */
    let couponsCache = [];
    async function viewCoupons() {
        const [{ coupons }] = [await A("/coupons")]; await loadProducts(); couponsCache = coupons;
        const rnd = () => "CA" + Math.random().toString(36).slice(2, 7).toUpperCase();
        $("#view").innerHTML = `<form id="cpf" class="form-card" style="margin-bottom:20px"><h3 style="margin-bottom:14px">إنشاء كود خصم</h3><div class="form-grid">
          <div class="fld"><label>الكود <span class="req">*</span></label><div style="display:flex;gap:8px"><input class="input ltr" style="flex:1;text-transform:uppercase" name="code" required maxlength="24" placeholder="CA10"><button type="button" class="btn btn-sm" id="gen">توليد</button></div></div>
          <div class="fld"><label>نوع الخصم</label><select class="select" name="type"><option value="percent">نسبة مئوية %</option><option value="fixed">مبلغ ثابت ($)</option></select></div>
          <div class="fld"><label>القيمة <span class="req">*</span></label><input class="input" name="value" type="number" min="0.01" step="0.01" required placeholder="10"></div>
          <div class="fld"><label>أقصى عدد استخدامات</label><input class="input" name="maxUses" type="number" min="1" placeholder="بدون حد"></div>
          <div class="fld"><label>ينتهي في</label><input class="input" name="expiresAt" type="datetime-local"></div>
          <div class="fld"><label>ملاحظة (لك فقط)</label><input class="input" name="note" maxlength="120"></div>
          <div class="fld full"><label>المنتجات المشمولة (اتركها فارغة لكل المنتجات)</label><div class="checks" style="gap:8px 16px">${products.filter(p => !p.isSupport).map(p => `<label class="switch" style="font-size:12.5px"><input type="checkbox" name="pid" value="${p.id}"><i></i>${esc(p.title.length > 28 ? p.title.slice(0, 28) + "…" : p.title)}</label>`).join("")}</div></div>
          <div class="full"><button class="btn btn-primary" type="submit">${icon("plus", "sm")} إنشاء الكود</button></div></div></form>
        ${coupons.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>الكود</th><th>الخصم</th><th>الاستخدام</th><th>ينتهي</th><th>المنتجات</th><th>الحالة</th><th></th></tr></thead><tbody>${coupons.map(c => {
            const exp = c.expiresAt && new Date(c.expiresAt) < new Date(), full = c.maxUses != null && c.used >= c.maxUses;
            return `<tr data-id="${c.id}"><td class="ltr"><b>${esc(c.code)}</b>${c.note ? `<br><small style="color:var(--text-3)">${esc(c.note)}</small>` : ""}</td><td class="ltr">${c.type === "percent" ? c.value + "%" : "$" + c.value}</td><td>${c.used}${c.maxUses != null ? " / " + c.maxUses : ""}</td><td>${c.expiresAt ? dt(c.expiresAt) : "—"}</td><td>${c.productIds.length ? c.productIds.length + " منتج" : "الكل"}</td>
            <td>${exp ? '<span class="chip err">منتهي</span>' : full ? '<span class="chip warn">مستنفد</span>' : `<label class="switch"><input type="checkbox" data-a="cptoggle" ${c.active ? "checked" : ""}><i></i></label>`}</td><td><div class="act">${act("cprm", c.id, "", "trash", "btn-danger btn-icon")}</div></td></tr>`; }).join("")}</tbody></table></div>` : empty("لا توجد أكواد خصم بعد", "tag")}`;
        $("#gen").onclick = () => { $("[name=code]").value = rnd(); };
        $("#cpf").onsubmit = async ev => {
            ev.preventDefault(); const f = new FormData(ev.target);
            const body = { code: f.get("code"), type: f.get("type"), value: f.get("value"), maxUses: f.get("maxUses") || null, expiresAt: fromLocalInput(f.get("expiresAt")) || null, note: f.get("note"), productIds: f.getAll("pid") };
            try { await A("/coupons", { method: "POST", body }); toast("تم إنشاء الكود"); go(); } catch (er) { toast(er.message, "err"); }
        };
    }

    /* ---------- reviews ---------- */
    async function viewReviews() {
        const { reviews } = await A("/reviews");
        $("#view").innerHTML = reviews.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>العميل</th><th>المنتج</th><th>التقييم</th><th>التعليق</th><th>التاريخ</th><th></th></tr></thead><tbody>${reviews.map(r => `<tr><td><b>${esc(r.username)}</b><br><small class="ltr" style="color:var(--text-3)">${esc(r.discordId || "")}</small></td><td>${esc(r.productTitle || r.productId)}</td><td>${stars(r.rating)}</td><td style="max-width:300px;white-space:normal">${esc(r.comment)}</td><td>${fmtDate(r.createdAt)}</td><td><div class="act">${act("rdel", r.id, "", "trash", "btn-danger btn-icon")}</div></td></tr>`).join("")}</tbody></table></div>` : empty("لا توجد تقييمات", "star");
    }

    /* ---------- purchases ---------- */
    async function viewPurchases() {
        const { purchases } = await A("/purchases"); if (has("products")) await loadProducts(); else products = (await api("/api/store/products")).products;
        $("#view").innerHTML = `<form id="mp" class="form-card" style="margin-bottom:20px;display:grid;grid-template-columns:1.2fr 1.4fr auto;gap:12px;align-items:end"><div class="fld"><label>آيدي ديسكورد للعميل</label><input class="input ltr" style="width:100%" name="discordId" inputmode="numeric" placeholder="123456789012345678" required></div><div class="fld"><label>المنتج</label><select class="select" name="productId">${products.map(p => `<option value="${p.id}">${esc(p.title)}</option>`).join("")}</select></div><button class="btn btn-primary" type="submit">${icon("plus", "sm")} تسجيل شراء يدوي</button><small style="grid-column:1/-1;color:var(--text-3)">استخدمها لعميل دفع بالرابط البديل (بطاقة) ليتمكن من التقييم.</small></form>
        ${purchases.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>العميل (ID)</th><th>المنتج</th><th>المبلغ</th><th>الكود</th><th>الطريقة</th><th>المصدر</th><th>التاريخ</th><th></th></tr></thead><tbody>${purchases.map(x => `<tr><td class="ltr">${esc(x.discordId)}</td><td>${esc(x.productTitle || x.plan || "—")}</td><td class="ltr">$${esc(x.amount ?? "")}</td><td class="ltr">${x.couponCode ? esc(x.couponCode) + (x.discount ? ` (−$${esc(x.discount)})` : "") : "—"}</td><td>${esc(x.method || "")}</td><td>${esc(x.source || "")}</td><td>${fmtDate(x.createdAt)}</td><td><div class="act">${act("pdel", x.id, "", "trash", "btn-danger btn-icon")}</div></td></tr>`).join("")}</tbody></table></div>` : empty("لا توجد مشتريات مسجّلة", "card")}`;
        $("#mp").onsubmit = async ev => { ev.preventDefault(); const b = Object.fromEntries(new FormData(ev.target)); try { await A("/purchases", { method: "POST", body: b }); toast("تم تسجيل الشراء"); go(); } catch (er) { toast(er.message, "err"); } };
    }

    /* ---------- settings ---------- */
    async function viewSettings() {
        const { settings } = await A("/settings");
        $("#view").innerHTML = `<form id="sf" class="form-card" style="max-width:560px"><h3 style="margin-bottom:6px">عدّاد العملاء</h3><p style="color:var(--text-2);font-size:13.5px;margin-bottom:14px">عدد العملاء الذين تم خدمتهم قبل الموقع الجديد. يُضاف إليه المشترون الجدد تلقائياً ويظهر في الصفحة الرئيسية.</p>
          <div class="fld"><label>العدد الأساسي</label><input class="input" name="customersBase" type="number" min="0" value="${settings.customersBase}"></div>
          <div class="notice" style="margin-top:14px">${icon("info")}<div>عدد مبيعات كل منتج يُضبط من تعديل المنتج (خانة «عدد المبيعات السابقة»). بداية الحساب التلقائي: ${settings.baseSince ? dt(settings.baseSince) : "—"}</div></div>
          <button class="btn btn-primary" type="submit" style="margin-top:16px">حفظ</button></form>`;
        $("#sf").onsubmit = async ev => { ev.preventDefault(); try { await A("/settings", { method: "PUT", body: { customersBase: $("[name=customersBase]").value } }); toast("تم الحفظ"); } catch (er) { toast(er.message, "err"); } };
    }

    /* ---------- admins (main only) ---------- */
    async function viewAdmins() {
        const { admins, allPerms } = await A("/admins");
        $("#view").innerHTML = `<form id="af" class="form-card" style="margin-bottom:20px"><h3 style="margin-bottom:14px">إضافة أدمن</h3><div class="form-grid">
          <div class="fld full"><label>آيدي ديسكورد</label><input class="input ltr" style="width:100%" name="discordId" inputmode="numeric" placeholder="123456789012345678" required></div>
          <div class="fld full"><label>الصلاحيات</label><div class="checks" style="gap:8px 18px">${allPerms.map(p => `<label class="switch"><input type="checkbox" name="perm" value="${p}"><i></i>${PERM_LABEL[p]}</label>`).join("")}</div></div>
          <div class="full"><button class="btn btn-primary" type="submit">${icon("plus", "sm")} إضافة / تحديث</button></div></div></form>
          ${admins.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>الأدمن</th><th>الصلاحيات</th><th>أضيف</th><th></th></tr></thead><tbody>${admins.map(a => `<tr><td><b>${esc(a.username)}</b><br><small class="ltr" style="color:var(--text-3)">${esc(a.discordId)}</small></td><td>${a.perms.map(p => `<span class="chip" style="margin:2px">${PERM_LABEL[p] || p}</span>`).join("")}</td><td>${fmtDate(a.createdAt)}</td><td><div class="act">${act("adel", a.discordId, "", "trash", "btn-danger btn-icon")}</div></td></tr>`).join("")}</tbody></table></div>` : empty("لا يوجد أدمنز إضافيون — أنت الأدمن الأساسي", "users")}`;
        $("#af").onsubmit = async ev => { ev.preventDefault(); const f = new FormData(ev.target); try { await A("/admins", { method: "POST", body: { discordId: f.get("discordId"), perms: f.getAll("perm") } }); toast("تم الحفظ"); go(); } catch (er) { toast(er.message, "err"); } };
    }

    /* ---------- audit (main only) ---------- */
    async function viewAudit() {
        const { logs } = await A("/audit");
        const draw = q => {
            const l = logs.filter(x => !q || (x.actor + x.action + x.target + x.detail).toLowerCase().includes(q.toLowerCase()));
            $("#auditBody").innerHTML = l.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>الوقت</th><th>الأدمن</th><th>العملية</th><th>الهدف</th><th>التفاصيل</th></tr></thead><tbody>${l.map(x => `<tr><td style="white-space:nowrap">${dt(x.createdAt)}</td><td><b>${esc(x.actor || "")}</b><br><small class="ltr" style="color:var(--text-3)">${esc(x.actorId || "")}</small></td><td><span class="chip">${esc(x.action)}</span></td><td>${esc(x.target)}</td><td style="white-space:normal;max-width:380px;color:var(--text-2)">${esc(x.detail)}</td></tr>`).join("")}</tbody></table></div>` : empty("لا توجد عمليات", "file");
        };
        $("#view").innerHTML = `<div class="notice" style="margin-bottom:16px">${icon("shield")}<div>هذا السجل يظهر لك أنت فقط (الأدمن الأساسي). آخر 300 عملية.</div></div><div class="search" style="max-width:340px;margin-bottom:14px"><span>${icon("search", "sm")}</span><input id="aq" type="search" placeholder="بحث في السجل..."></div><div id="auditBody"></div>`;
        draw(""); $("#aq").oninput = e => draw(e.target.value.trim());
    }

    /* ---------- أحداث مشتركة ---------- */
    $("#view").addEventListener("click", async e => {
        const b = e.target.closest("[data-a]"); if (!b || b.tagName === "INPUT") return; const a = b.dataset.a, tr = b.closest("tr"), id = b.dataset.id || (tr && tr.dataset.id);
        try {
            if (a === "add") return editor();
            if (a === "edit") return editor(products.find(x => x.id === +id));
            if (a === "rm") { const p = products.find(x => x.id === +id); if (await confirmBox("حذف المنتج", `سيتم حذف «${p.title}» وجميع تقييماته نهائياً. هل أنت متأكد؟`, "حذف نهائي")) { await A("/products/" + id, { method: "DELETE" }); toast("تم حذف المنتج"); go(); } }
            else if (a === "mv") {
                const d = +b.dataset.d, i = products.findIndex(x => x.id === +id), j = i + d; if (j < 0 || j >= products.length) return;
                [products[i], products[j]] = [products[j], products[i]];
                await Promise.all(products.map((x, k) => x.sortOrder !== k ? A("/products/" + x.id, { method: "PUT", body: { sortOrder: k } }) : null)); go();
            }
            else if (a === "rdel") { if (await confirmBox("حذف التقييم", "سيتم حذف هذا التقييم نهائياً.", "حذف")) { await api("/api/store/reviews/" + id, { method: "DELETE" }); toast("تم الحذف"); go(); } }
            else if (a === "pdel") { if (await confirmBox("حذف سجل الشراء", "سيفقد العميل إمكانية التقييم (ما لم يملك الرتبة).", "حذف")) { await A("/purchases/" + id, { method: "DELETE" }); toast("تم الحذف"); go(); } }
            else if (a === "cprm") { if (await confirmBox("حذف الكود", "سيتوقف الكود عن العمل نهائياً.", "حذف")) { await A("/coupons/" + id, { method: "DELETE" }); toast("تم الحذف"); go(); } }
            else if (a === "adel") { if (await confirmBox("إزالة الأدمن", "سيفقد هذا الحساب كل صلاحيات اللوحة.", "إزالة")) { await A("/admins/" + id, { method: "DELETE" }); toast("تمت الإزالة"); go(); } }
        } catch (er) { toast(er.message, "err"); }
    });
    $("#view").addEventListener("change", async e => {
        const pi = e.target.closest("[data-price]");
        if (pi) { const id = +pi.dataset.price, p = products.find(x => x.id === id); try { await A("/products/" + id, { method: "PUT", body: { price: pi.value } }); p.rawPrice = +pi.value; toast("تم تحديث السعر"); } catch (er) { toast(er.message, "err"); pi.value = p.rawPrice; } return; }
        const t = e.target.closest('[data-a="cptoggle"]');
        if (t) { const id = t.closest("tr").dataset.id; try { await A("/coupons/" + id, { method: "PUT", body: { active: t.checked } }); toast(t.checked ? "تم تفعيل الكود" : "تم إيقاف الكود"); } catch (er) { toast(er.message, "err"); t.checked = !t.checked; } }
    });
    go();
})();
