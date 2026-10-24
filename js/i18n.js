/* ===== CA Store — i18n (ar / en) — يُحمَّل في <head> ===== */
(function () {
    var L = "ar"; try { L = localStorage.getItem("ca_lang") || "ar"; } catch (e) {}
    if (window.CA_FORCE_LANG) L = window.CA_FORCE_LANG;
    if (L !== "en") L = "ar";
    var de = document.documentElement; de.lang = L; de.dir = L === "ar" ? "rtl" : "ltr";
    var D = {
    ar: {
      nav_home: "الرئيسية", nav_store: "المتجر", nav_reviews: "التقييمات", nav_faq: "الأسئلة الشائعة", nav_orders: "مشترياتي", nav_dashboard: "لوحة التحكم",
      login: "تسجيل الدخول", logout: "تسجيل الخروج", login_discord: "تسجيل الدخول بديسكورد", cancel: "إلغاء", confirm: "تأكيد", delete: "حذف", back_home: "العودة للرئيسية", back_store: "العودة للمتجر",
      lang_btn: "EN", err_generic: "حدث خطأ غير متوقع", err_net: "تعذّر الاتصال بالخادم، تحقق من اتصالك بالإنترنت", err_login_start: "تعذّر بدء تسجيل الدخول",
      ftr_about: "متجر عربي متخصص بحزم الجرافيكس وخدمات ديسكورد. جودة عالية، تسليم سريع، ودعم حقيقي عبر سيرفرنا.",
      ftr_store: "المتجر", ftr_all: "كل المنتجات", ftr_fivem: "جرافيكس FiveM", ftr_discord: "خدمات ديسكورد", ftr_help: "المساعدة", ftr_how: "كيف أشتري؟", ftr_reviews: "آراء العملاء", ftr_contact: "تواصل معنا", ftr_server: "سيرفر الديسكورد", ftr_ticket: "فتح تذكرة", ftr_terms: "الشروط والاسترجاع",
      ftr_rights: "جميع الحقوق محفوظة", ftr_pay: "الدفع عبر PayPal · التسليم عبر Discord",
      cat_fivem: "جرافيكس FiveM", cat_discord: "ديسكورد", cat_subscriptions: "اشتراكات", cat_support: "دعم المتجر", n_products: "{n} منتج",
      hero_eyebrow: "المتجر الرسمي · CA STORE", hero_a: "ارتقِ بتجربتك مع", hero_em: "جرافيكس", hero_b: "بمستوى سينمائي",
      hero_lead: "حزم جرافيكس FiveM مصممة بعناية للواقعية والأداء، مع خدمات ديسكورد موثوقة. اشترِ بأمان وتسلّم منتجك عبر سيرفرنا.",
      browse_store: "تصفّح المتجر", how_q: "كيف أشتري؟", st_customers: "عميل تم خدمتهم", st_sales: "نسخة تم بيعها", st_rating: "متوسط التقييم", st_products: "منتج متاح",
      fc1_t: "دفع آمن", fc1_s: "عبر PayPal", fc2_t: "تسليم سريع", fc2_s: "خلال دقائق", fc3_t: "دعم مباشر", fc3_s: "تذاكر ديسكورد",
      mq1: "جرافيكس FiveM", mq2: "تفعيل فوري", mq3: "دفع آمن عبر PayPal", mq4: "دعم عبر الديسكورد", mq5: "تقييمات موثّقة", mq6: "أداء ثابت بدون FPS drop", mq7: "تحديثات مستمرة",
      feat_eyebrow: "منتجات مختارة", feat_title: "الأكثر طلباً", view_all: "عرض الكل",
      offers_eyebrow: "عروض لفترة محدودة", offers_title: "اغتنم العرض قبل انتهائه",
      diff_eyebrow: "شاهد الفرق", diff_title: "قبل وبعد الجرافيكس", diff_sub: "حرّك الشريط لترى الفرق بنفسك.",
      cats_eyebrow: "الأقسام", cats_title: "اختر ما يناسبك",
      how_eyebrow: "خطوات بسيطة", how_title: "كيف تشتري؟",
      s1_t: "سجّل الدخول", s1_d: "بحساب ديسكورد الخاص بك ليتم ربط الشراء بحسابك.", s2_t: "اختر وادفع", s2_d: "اختر المنتج وأكمل الدفع بأمان عبر PayPal.", s3_t: "استلم منتجك", s3_d: "يتم التفعيل تلقائياً، وإن احتجت مساعدة افتح تذكرة.",
      why_eyebrow: "لماذا نحن", why_title: "ثقة وجودة في كل تفصيل",
      f1_t: "دفع موثوق", f1_d: "جميع العمليات تتم عبر PayPal، بياناتك البنكية لا تصلنا أبداً.", f2_t: "تسليم سريع", f2_d: "نفعّل لك المنتج خلال دقائق من إتمام الدفع.", f3_t: "تقييمات موثّقة", f3_d: "لا يقيّم إلا من اشترى فعلاً، لتقرأ آراء حقيقية.",
      f4_t: "جودة وأداء", f4_d: "حزم محسّنة بصرياً دون التأثير على الـ FPS.", f5_t: "دعم مباشر", f5_d: "فريق جاهز للمساعدة عبر سيرفر الديسكورد.", f6_t: "تحديثات مستمرة", f6_d: "نطوّر حزمنا باستمرار وتصلك التحديثات تلقائياً.",
      rv_eyebrow: "آراء العملاء", rv_title: "تقييمات حقيقية من مشترين فعليين", rv_sub: "كل تقييم موثّق، ولا يستطيع التقييم إلا من اشترى المنتج فعلاً.", rv_all: "كل التقييمات",
      be_first: "كن أول من يقيّم", be_first_s: "اشترِ منتجاً وشاركنا رأيك.", verified: "مشتري موثّق",
      faq_eyebrow: "الأسئلة الشائعة", faq_title: "كل ما تحتاج معرفته",
      q1: "كيف أستلم المنتج بعد الدفع؟", a1: "عند الدفع من الموقع يتم تسجيل شرائك وتفعيل رتبتك في ديسكورد تلقائياً. وإن دفعت عبر الرابط البديل فافتح تذكرة في السيرفر وسنفعّله لك يدوياً.",
      q2: "هل الدفع آمن؟", a2: "نعم، جميع المدفوعات تتم عبر PayPal مباشرة ولا نحتفظ بأي بيانات بنكية.",
      q3: "كيف أضيف تقييماً؟", a3: "سجّل الدخول بحساب ديسكورد الذي اشتريت به، ثم افتح صفحة المنتج وستجد نموذج التقييم متاحاً لك.",
      q4: "هل أستطيع استرجاع المبلغ؟", a4: "المنتجات رقمية، والاسترجاع متاح في حالات محددة مذكورة في صفحة الشروط والاسترجاع.",
      q5: "كيف أستخدم كود الخصم؟", a5: "في صفحة المنتج اكتب الكود في خانة «كود الخصم» واضغط تطبيق، وسيظهر السعر الجديد قبل الدفع.",
      cta_t: "جاهز لتغيير شكل لعبتك؟", cta_s: "انضم لمئات العملاء واختر الحزمة المناسبة لك اليوم.", cta_b: "ابدأ التسوّق",
      store_title: "كل المنتجات", search_ph: "ابحث عن منتج...", sort_def: "الترتيب الافتراضي", sort_pa: "السعر: الأقل أولاً", sort_pd: "السعر: الأعلى أولاً", sort_rt: "الأعلى تقييماً", sort_sold: "الأكثر مبيعاً",
      only_avail: "المتوفر فقط", only_offers: "العروض فقط", all: "الكل", no_results: "لا توجد نتائج", no_results_s: "جرّب تغيير البحث أو التصنيف.",
      available: "متوفر", out_of_stock: "غير متوفر", out_now: "غير متوفر حالياً", details: "التفاصيل", buy_now: "اشترِ الآن", support_us: "ادعمنا", featured: "مميّز", off: "خصم {n}%", save: "وفّر {n}%",
      sold_n: "تم بيع {n} نسخة", sold_short: "{n} مبيعة", no_ratings: "لا توجد تقييمات بعد", n_ratings: "({n} تقييم)", free_amount: "المبلغ حسب رغبتك", currency: "ر.س",
      offer_ends: "ينتهي العرض خلال", cd_d: "يوم", cd_h: "ساعة", cd_m: "دقيقة", cd_s: "ثانية", offer_over: "انتهى العرض",
      buy_paypal: "اشترِ الآن عبر PayPal", donate_btn: "ادعم المتجر", alt_pay: "لا تملك حساب PayPal؟ ادفع ببطاقة",
      usd_note: "يتم الخصم عبر PayPal بالدولار: {usd} (قد يختلف المبلغ بعملتك حسب سعر الصرف)",
      tr1: "دفع آمن", tr2: "تسليم سريع", tr3: "دعم عبر تذكرة",
      gal_title: "الصور والفيديو", cmp_title: "قبل وبعد", cmp_hint: "حرّك الشريط", before: "قبل", after: "بعد",
      coupon_l: "كود الخصم", coupon_ph: "اكتب الكود هنا", coupon_apply: "تطبيق", coupon_remove: "إزالة", coupon_login: "سجّل الدخول لاستخدام كود الخصم", coupon_ok: "تم تطبيق الكود {code} — وفّرت {amt}", coupon_final: "السعر بعد الخصم", coupon_alt_note: "كود الخصم لا يعمل مع الرابط البديل.",
      m_login_t: "سجّل الدخول أولاً", m_login_d: "نربط مشترياتك بحسابك في ديسكورد لنفعّل لك المنتج تلقائياً ونفتح لك التقييم بعد الشراء.",
      m_pay_t: "أنت على وشك الدفع", m_pay_d: "سيتم فتح صفحة PayPal الآمنة في تبويب جديد.", m_pay_go: "متابعة للدفع", no_pay_link: "الدفع غير متاح لهذا المنتج حالياً",
      m_alt_t: "الدفع ببطاقة بدون حساب PayPal", m_alt_d: "سيفتح لك رابط دفع آمن من PayPal تقدر تدفع منه ببطاقتك كضيف.", m_alt_w: "مهم: هذا الرابط لا يعرف حسابك في ديسكورد، لذلك بعد الدفع افتح تذكرة في سيرفرنا وأرسل إثبات الدفع ليتم تفعيل منتجك وفتح التقييم لك يدوياً خلال وقت قصير.",
      rt_eyebrow: "التقييمات", rt_title: "آراء من اشتروا هذا المنتج", rt_login: "سجّل الدخول لتتمكن من تقييم المنتج إن كنت قد اشتريته.", rt_notbuyer: "التقييم متاح فقط لمن اشترى هذا المنتج. إذا اشتريته للتو وما زلت لا ترى النموذج، افتح تذكرة ليتم تأكيد عمليتك.",
      rt_form_new: "قيّم هذا المنتج", rt_form_edit: "عدّل تقييمك", rt_thanks: "شكراً لشرائك! رأيك يساعد الآخرين.", rt_ph: "اكتب تجربتك مع المنتج (اختياري)", rt_send: "إرسال التقييم", rt_save: "حفظ التعديل", rt_del_mine: "حذف تقييمي", rt_pick: "اختر عدد النجوم", rt_saved: "تم حفظ تقييمك، شكراً لك!", rt_deleted: "تم الحذف", rt_count: "{n} تقييم",
      rt_del_t: "حذف التقييم", rt_del_d: "هل تريد حذف هذا التقييم نهائياً؟", pd_missing: "المنتج غير موجود أو لم يعد متاحاً",
      rv_page_eyebrow: "آراء العملاء", rv_page_title: "تقييمات المشترين", rv_page_sub: "جميع التقييمات من عملاء اشتروا المنتجات فعلاً.", rv_page_note: "لكل منتج صفحة تقييمات خاصة به. لإضافة تقييم، افتح صفحة المنتج الذي اشتريته بعد تسجيل الدخول.", rv_none: "لا توجد تقييمات بعد",
      or_title: "مشترياتي", or_sub: "كل ما اشتريته من المتجر في مكان واحد.", or_login_t: "سجّل الدخول لعرض مشترياتك", or_login_d: "سجّل الدخول بنفس حساب ديسكورد الذي اشتريت به.",
      or_active: "اشتراكاتك الفعّالة", or_active_d: "رتب مفعّلة على حسابك في ديسكورد.", or_history: "سجل المشتريات", or_none_t: "لا توجد مشتريات بعد", or_none_d: "عند شرائك أي منتج سيظهر هنا مع إمكانية تقييمه.",
      or_from_role: "مفعّل عبر ديسكورد", or_method: "طريقة الدفع", or_coupon: "كود الخصم", or_rate: "قيّم المنتج", or_edit: "عدّل تقييمك", or_your: "تقييمك", or_support: "تحتاج مساعدة؟ افتح تذكرة", or_paid: "تم الدفع", or_manual: "تسجيل يدوي",
      ret_wait: "جارٍ تأكيد الدفع...", ret_wait_s: "لا تغلق الصفحة", ret_none: "لا يوجد طلب", ret_none_d: "الرابط غير صحيح.", ret_login_t: "سجّل الدخول لإكمال التأكيد", ret_login_d: "سجّل الدخول بنفس حساب ديسكورد الذي بدأت به الشراء.",
      ret_ok_t: "تمت عملية الشراء بنجاح!", ret_ok_d: "شكراً لك على شرائك {title}.", ret_role_ok: "تم تفعيل رتبتك في ديسكورد تلقائياً.", ret_role_fail: "تم الدفع بنجاح، لكن تعذّر منح الرتبة تلقائياً. افتح تذكرة وسنفعّلها فوراً.", ret_ticket: "بعد الشراء افتح تذكرة في سيرفر الديسكورد لاستلام منتجك.",
      ret_rate: "قيّم المنتج", ret_orders: "مشترياتي", ret_fail: "لم يكتمل التأكيد",
      cb_wait: "جارٍ تسجيل الدخول...", cb_wait_s: "لحظات من فضلك", cb_fail: "تعذّر تسجيل الدخول", cb_nocode: "لم يتم استلام رمز التفويض", cb_srv: "تعذّر الاتصال بالخادم",
      tm_title: "الشروط والاسترجاع", tm_updated: "آخر تحديث", tm_html:
        "<h2>1. طبيعة المنتجات</h2><p>جميع منتجات CA Store رقمية (حزم جرافيكس، خدمات وبوتات ديسكورد). تُسلَّم عبر ديسكورد بعد إتمام الدفع، ولا يوجد شحن مادي.</p>" +
        "<h2>2. الدفع</h2><p>تتم المدفوعات عبر PayPal بالدولار الأمريكي (USD). الأسعار المعروضة بالريال تقريبية للتسهيل، والمبلغ المخصوم هو المكتوب بالدولار في صفحة المنتج. لا نحتفظ بأي بيانات بنكية.</p>" +
        "<h2>3. التسليم والتفعيل</h2><p>يتم التفعيل تلقائياً بعد الدفع من الموقع. وفي حال الدفع عبر الرابط البديل أو حدوث أي مشكلة في التفعيل، افتح تذكرة في سيرفر الديسكورد وسنفعّل منتجك بعد التحقق من الدفع.</p>" +
        "<h2>4. سياسة الاسترجاع</h2><p>بسبب طبيعة المنتجات الرقمية، لا يمكن الاسترجاع بعد التفعيل واستخدام المنتج، إلا في الحالات التالية:</p><ul><li>تعذّر تسليم المنتج أو تفعيله بعد الدفع ولم نتمكن من حل المشكلة.</li><li>وجود عطل جوهري في المنتج لا يمكن إصلاحه خلال مدة معقولة.</li><li>الخصم المتكرر بالخطأ لنفس الطلب.</li></ul><p>لطلب الاسترجاع افتح تذكرة خلال <b>7 أيام</b> من الشراء مع إثبات الدفع.</p>" +
        "<h2>5. الاستخدام المسموح</h2><p>المنتج للاستخدام الشخصي. يُمنع إعادة بيعه أو مشاركته أو نشره. مخالفة ذلك قد تؤدي لسحب الرتبة دون استرجاع.</p>" +
        "<h2>6. كود الخصم</h2><p>كل كود صالح حسب شروطه (المنتج، المدة، عدد الاستخدامات) ويُستخدم مرة واحدة لكل حساب، ولا يُستبدل بنقد.</p>" +
        "<h2>7. الدعم</h2><p>للدعم أو أي استفسار تواصل معنا عبر التذاكر في سيرفر الديسكورد.</p>"
    },
    en: {
      nav_home: "Home", nav_store: "Store", nav_reviews: "Reviews", nav_faq: "FAQ", nav_orders: "My Orders", nav_dashboard: "Dashboard",
      login: "Log in", logout: "Log out", login_discord: "Log in with Discord", cancel: "Cancel", confirm: "Confirm", delete: "Delete", back_home: "Back to home", back_store: "Back to store",
      lang_btn: "ع", err_generic: "Something went wrong", err_net: "Couldn't reach the server. Check your connection.", err_login_start: "Couldn't start login",
      ftr_about: "An Arabic store for graphics packs and Discord services. High quality, fast delivery and real support on our server.",
      ftr_store: "Store", ftr_all: "All products", ftr_fivem: "FiveM Graphics", ftr_discord: "Discord services", ftr_help: "Help", ftr_how: "How to buy", ftr_reviews: "Customer reviews", ftr_contact: "Contact", ftr_server: "Discord server", ftr_ticket: "Open a ticket", ftr_terms: "Terms & refunds",
      ftr_rights: "All rights reserved", ftr_pay: "Pay with PayPal · Delivered on Discord",
      cat_fivem: "FiveM Graphics", cat_discord: "Discord", cat_subscriptions: "Subscriptions", cat_support: "Support the store", n_products: "{n} products",
      hero_eyebrow: "OFFICIAL STORE · CA STORE", hero_a: "Upgrade your game with", hero_em: "cinematic", hero_b: "graphics",
      hero_lead: "FiveM graphics packs crafted for realism and performance, plus trusted Discord services. Pay securely and receive your product on our server.",
      browse_store: "Browse the store", how_q: "How to buy?", st_customers: "customers served", st_sales: "copies sold", st_rating: "average rating", st_products: "products available",
      fc1_t: "Secure payment", fc1_s: "via PayPal", fc2_t: "Fast delivery", fc2_s: "within minutes", fc3_t: "Live support", fc3_s: "Discord tickets",
      mq1: "FiveM Graphics", mq2: "Instant activation", mq3: "Secure PayPal payment", mq4: "Discord support", mq5: "Verified reviews", mq6: "Stable performance, no FPS drop", mq7: "Continuous updates",
      feat_eyebrow: "Featured", feat_title: "Most popular", view_all: "View all",
      offers_eyebrow: "Limited-time offers", offers_title: "Grab the deal before it ends",
      diff_eyebrow: "See the difference", diff_title: "Before & after graphics", diff_sub: "Drag the slider to see the difference yourself.",
      cats_eyebrow: "Categories", cats_title: "Pick what suits you",
      how_eyebrow: "Simple steps", how_title: "How to buy",
      s1_t: "Log in", s1_d: "With your Discord account so your purchase is linked to you.", s2_t: "Choose & pay", s2_d: "Pick a product and pay securely with PayPal.", s3_t: "Get your product", s3_d: "Activation is automatic. Need help? Open a ticket.",
      why_eyebrow: "Why us", why_title: "Trust and quality in every detail",
      f1_t: "Trusted payment", f1_d: "Every payment goes through PayPal; we never see your card details.", f2_t: "Fast delivery", f2_d: "Your product is activated within minutes of payment.", f3_t: "Verified reviews", f3_d: "Only real buyers can review, so you read genuine opinions.",
      f4_t: "Quality & performance", f4_d: "Visually enhanced packs without hurting your FPS.", f5_t: "Direct support", f5_d: "A team ready to help on our Discord server.", f6_t: "Continuous updates", f6_d: "We keep improving our packs and updates reach you automatically.",
      rv_eyebrow: "Customer reviews", rv_title: "Real reviews from real buyers", rv_sub: "Every review is verified — only buyers can leave one.", rv_all: "All reviews",
      be_first: "Be the first to review", be_first_s: "Buy a product and share your opinion.", verified: "Verified buyer",
      faq_eyebrow: "FAQ", faq_title: "Everything you need to know",
      q1: "How do I receive my product after paying?", a1: "When you pay on the website, your purchase is recorded and your Discord role is activated automatically. If you paid through the alternative link, open a ticket on our server and we'll activate it manually.",
      q2: "Is payment secure?", a2: "Yes. All payments go through PayPal directly and we never store any card data.",
      q3: "How do I leave a review?", a3: "Log in with the Discord account you bought with, then open the product page — the review form will be available to you.",
      q4: "Can I get a refund?", a4: "Products are digital; refunds are available in specific cases described on the Terms & refunds page.",
      q5: "How do I use a discount code?", a5: "On the product page, type the code in the “Discount code” box and press Apply. The new price shows before you pay.",
      cta_t: "Ready to transform your game?", cta_s: "Join hundreds of customers and pick the right pack today.", cta_b: "Start shopping",
      store_title: "All products", search_ph: "Search for a product...", sort_def: "Default order", sort_pa: "Price: low to high", sort_pd: "Price: high to low", sort_rt: "Top rated", sort_sold: "Best selling",
      only_avail: "In stock only", only_offers: "Offers only", all: "All", no_results: "No results", no_results_s: "Try changing your search or category.",
      available: "In stock", out_of_stock: "Out of stock", out_now: "Currently unavailable", details: "Details", buy_now: "Buy now", support_us: "Support us", featured: "Featured", off: "{n}% off", save: "Save {n}%",
      sold_n: "{n} copies sold", sold_short: "{n} sold", no_ratings: "No reviews yet", n_ratings: "({n} reviews)", free_amount: "Pay what you want", currency: "SAR",
      offer_ends: "Offer ends in", cd_d: "days", cd_h: "hours", cd_m: "min", cd_s: "sec", offer_over: "Offer ended",
      buy_paypal: "Buy now with PayPal", donate_btn: "Support the store", alt_pay: "No PayPal account? Pay by card",
      usd_note: "Charged by PayPal in US dollars: {usd}",
      tr1: "Secure payment", tr2: "Fast delivery", tr3: "Ticket support",
      gal_title: "Photos & video", cmp_title: "Before & after", cmp_hint: "Drag the slider", before: "Before", after: "After",
      coupon_l: "Discount code", coupon_ph: "Enter code", coupon_apply: "Apply", coupon_remove: "Remove", coupon_login: "Log in to use a discount code", coupon_ok: "Code {code} applied — you save {amt}", coupon_final: "Price after discount", coupon_alt_note: "Discount codes don't work with the alternative link.",
      m_login_t: "Log in first", m_login_d: "We link your purchase to your Discord account so we can activate your product automatically and let you review it afterwards.",
      m_pay_t: "You're about to pay", m_pay_d: "The secure PayPal page will open in a new tab.", m_pay_go: "Continue to payment", no_pay_link: "Payment isn't available for this product right now",
      m_alt_t: "Pay by card without PayPal", m_alt_d: "A secure PayPal payment link will open where you can pay with your card as a guest.", m_alt_w: "Important: this link doesn't know your Discord account, so after paying please open a ticket on our server and send your proof of payment so we can activate your product and unlock reviews manually.",
      rt_eyebrow: "Reviews", rt_title: "What buyers say about this product", rt_login: "Log in to review this product if you've bought it.", rt_notbuyer: "Reviews are only for people who bought this product. If you just bought it and still don't see the form, open a ticket so we can confirm your order.",
      rt_form_new: "Rate this product", rt_form_edit: "Edit your review", rt_thanks: "Thanks for your purchase! Your opinion helps others.", rt_ph: "Tell us about your experience (optional)", rt_send: "Submit review", rt_save: "Save changes", rt_del_mine: "Delete my review", rt_pick: "Choose a star rating", rt_saved: "Review saved, thank you!", rt_deleted: "Deleted", rt_count: "{n} reviews",
      rt_del_t: "Delete review", rt_del_d: "Delete this review permanently?", pd_missing: "Product not found or no longer available",
      rv_page_eyebrow: "Customer reviews", rv_page_title: "Buyer reviews", rv_page_sub: "All reviews come from customers who actually bought the products.", rv_page_note: "Each product has its own reviews page. To leave a review, log in and open the product you bought.", rv_none: "No reviews yet",
      or_title: "My orders", or_sub: "Everything you bought from the store in one place.", or_login_t: "Log in to see your orders", or_login_d: "Log in with the same Discord account you bought with.",
      or_active: "Your active plans", or_active_d: "Roles currently active on your Discord account.", or_history: "Purchase history", or_none_t: "No purchases yet", or_none_d: "When you buy a product it will show up here, ready to review.",
      or_from_role: "Active via Discord", or_method: "Payment method", or_coupon: "Discount code", or_rate: "Rate product", or_edit: "Edit your review", or_your: "Your rating", or_support: "Need help? Open a ticket", or_paid: "Paid", or_manual: "Manual entry",
      ret_wait: "Confirming your payment...", ret_wait_s: "Please don't close this page", ret_none: "No order found", ret_none_d: "The link is invalid.", ret_login_t: "Log in to finish confirming", ret_login_d: "Log in with the Discord account you started the purchase with.",
      ret_ok_t: "Purchase successful!", ret_ok_d: "Thanks for buying {title}.", ret_role_ok: "Your Discord role was activated automatically.", ret_role_fail: "Payment succeeded, but we couldn't assign your role automatically. Open a ticket and we'll activate it right away.", ret_ticket: "After purchase, open a ticket on our Discord server to receive your product.",
      ret_rate: "Rate product", ret_orders: "My orders", ret_fail: "Couldn't confirm",
      cb_wait: "Logging you in...", cb_wait_s: "One moment please", cb_fail: "Login failed", cb_nocode: "No authorization code received", cb_srv: "Couldn't reach the server",
      tm_title: "Terms & refunds", tm_updated: "Last updated", tm_html:
        "<h2>1. Nature of products</h2><p>All CA Store products are digital (graphics packs, Discord services and bots). They are delivered on Discord after payment; nothing is shipped.</p>" +
        "<h2>2. Payment</h2><p>Payments are processed by PayPal in US dollars (USD). Prices shown in riyals are approximate for convenience; the amount charged is the USD price on the product page. We never store card data.</p>" +
        "<h2>3. Delivery & activation</h2><p>Activation is automatic after paying on the website. If you paid through the alternative link or have any activation issue, open a ticket on our Discord server and we'll activate your product after verifying payment.</p>" +
        "<h2>4. Refund policy</h2><p>Because products are digital, refunds are not possible once a product has been activated and used, except when:</p><ul><li>We couldn't deliver or activate the product after payment and couldn't solve the issue.</li><li>The product has a major defect that can't be fixed within a reasonable time.</li><li>You were charged more than once for the same order.</li></ul><p>To request a refund, open a ticket within <b>7 days</b> of purchase with proof of payment.</p>" +
        "<h2>5. Permitted use</h2><p>Products are for personal use. Reselling, sharing or publishing them is prohibited and may lead to role removal without refund.</p>" +
        "<h2>6. Discount codes</h2><p>Each code is valid according to its terms (product, duration, number of uses), can be used once per account, and has no cash value.</p>" +
        "<h2>7. Support</h2><p>For support or questions, reach us through tickets on our Discord server.</p>"
    } };
    window.CA_I18N = { lang: L, D: D, t: function (k, v) { var s = (D[L] && D[L][k]) != null ? D[L][k] : (D.ar[k] != null ? D.ar[k] : k); if (v) for (var n in v) s = s.split("{" + n + "}").join(v[n]); return s; },
        set: function (l) { try { localStorage.setItem("ca_lang", l); } catch (e) {} location.reload(); } };
    document.addEventListener("DOMContentLoaded", function () {
        var t = window.CA_I18N.t;
        document.querySelectorAll("[data-i]").forEach(function (e) { e.textContent = t(e.getAttribute("data-i")); });
        document.querySelectorAll("[data-ih]").forEach(function (e) { e.innerHTML = t(e.getAttribute("data-ih")); });
        document.querySelectorAll("[data-iph]").forEach(function (e) { e.setAttribute("placeholder", t(e.getAttribute("data-iph"))); });
    });
})();
