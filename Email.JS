/* ============================
   تهيئة EmailJS
============================ */

(function() {
    emailjs.init("Xxmf1RVjn0UE85ob9");
})();

/* ============================
   التحقق من صحة الإيميل
============================ */

function isValidEmail(email) {
    return /^\S+@\S+\.\S+$/.test(email);
}

/* ============================
   إرسال رمز التحقق
============================ */

function sendCodeEmailJS() {
    const email = document.getElementById("emailInput").value.trim();

    if (!isValidEmail(email)) {
        showVerifyAlert("البريد الإلكتروني غير صالح");
        return;
    }

    const generatedCode = Math.floor(100000 + Math.random() * 900000);

    localStorage.setItem("verifyCode", generatedCode);
    localStorage.setItem("verifyEmail", email);

    const params = { to_email: email, code: generatedCode };

    emailjs.send("service_zmn43rn", "template_9io3rt8", params)
        .then(() => {
            document.getElementById("emailStep").style.display = "none";
            document.getElementById("codeStep").style.display = "block";

            startResendTimer();
            showVerifyAlert("تم إرسال رمز التحقق");
        })
        .catch(() => showVerifyAlert("حدث خطأ أثناء الإرسال"));
}

/* ============================
   عدّاد 60 ثانية
============================ */

function startResendTimer() {
    const btn = document.getElementById("resendBtn");
    let timeLeft = 60;

    btn.disabled = true;
    btn.innerText = `إعادة الإرسال بعد ${timeLeft}s`;

    const timer = setInterval(() => {
        timeLeft--;
        btn.innerText = `إعادة الإرسال بعد ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            btn.disabled = false;
            btn.innerText = "إرسال الكود مرة أخرى";
        }
    }, 1000);
}

/* ============================
   إعادة إرسال الكود
============================ */

function resendCodeEmailJS() {
    const email = localStorage.getItem("verifyEmail");

    if (!email) {
        showVerifyAlert("لا يوجد بريد لإعادة الإرسال");
        return;
    }

    const newCode = Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem("verifyCode", newCode);

    const params = { to_email: email, code: newCode };

    emailjs.send("service_zmn43rn", "template_9io3rt8", params)
        .then(() => {
            startResendTimer();
            showVerifyAlert("تم إرسال رمز جديد");
        })
        .catch(() => showVerifyAlert("حدث خطأ أثناء الإرسال"));
}

/* ============================
   التحقق من الرمز
============================ */

function verifyLoginEmailJS() {
    const entered = document.getElementById("codeInput").value.trim();
    const saved = localStorage.getItem("verifyCode");
    const email = localStorage.getItem("verifyEmail");

    if (!entered) {
        showVerifyAlert("الرجاء إدخال الرمز");
        return;
    }

    if (entered !== saved) {
        showVerifyAlert("رمز التحقق غير صحيح");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users") || "[]");
    let existing = users.find(u => u.email === email);

    if (existing) {
        // مستخدم قديم
        localStorage.setItem("loggedUser", JSON.stringify(existing));
        showVerifyAlert("تم تسجيل الدخول");
    } else {
        // مستخدم جديد
        const newUser = {
            email,
            firstName: "",
            lastName: "",
            orders: []
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("loggedUser", JSON.stringify(newUser));

        showVerifyAlert("مرحبًا بك — تم إنشاء حسابك");
    }

    // في كل الحالات → صفحة استكمال البيانات
    setTimeout(() => {
        window.location.href = "onboarding.html";
    }, 1200);
}

/* ============================
   إشعار
============================ */

function showVerifyAlert(msg) {
    const toast = document.getElementById("verifyToast");
    toast.textContent = msg;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}
