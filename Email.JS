
(function() {
    emailjs.init("Xxmf1RVjn0UE85ob9");
})();


function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}


function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('show');
    }
}


function hideError(elementId) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.classList.remove('show');
    }
}


function setButtonLoading(btnId, loading) {
    const btn = document.getElementById(btnId);
    if (btn) {
        if (loading) {
            btn.classList.add('auth-loading');
            btn.disabled = true;
        } else {
            btn.classList.remove('auth-loading');
            btn.disabled = false;
        }
    }
}


function sendCodeEmailJS() {
    const email = document.getElementById("emailInput").value.trim();
    const sendBtn = document.getElementById("sendCodeBtn");

    hideError("emailError");

    if (!email) {
        showError("emailError", "الرجاء إدخال البريد الإلكتروني");
        return;
    }

    if (!isValidEmail(email)) {
        showError("emailError", "البريد الإلكتروني غير صالح");
        return;
    }

    setButtonLoading("sendCodeBtn", true);

    const generatedCode = Math.floor(100000 + Math.random() * 900000);

    localStorage.setItem("verifyCode", generatedCode);
    localStorage.setItem("verifyEmail", email);
    localStorage.setItem("verifyCodeTime", Date.now().toString());

    const params = { to_email: email, code: generatedCode };

    emailjs.send("service_zmn43rn", "template_9io3rt8", params)
        .then(() => {
            document.getElementById("emailStep").style.display = "none";
            document.getElementById("codeStep").style.display = "block";
            document.getElementById("sentEmail").textContent = email;

            startResendTimer();
            showVerifyAlert("تم إرسال رمز التحقق");
            
            // Focus first code input
            setTimeout(() => {
                const firstInput = document.querySelector('.code-input');
                if (firstInput) firstInput.focus();
            }, 100);
        })
        .catch((error) => {
            console.error("EmailJS Error:", error);
            showError("emailError", "حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى");
        })
        .finally(() => {
            setButtonLoading("sendCodeBtn", false);
        });
}


function startResendTimer() {
    const btn = document.getElementById("resendBtn");
    const countdownSpan = document.getElementById("countdown");
    let timeLeft = 60;

    btn.disabled = true;
    countdownSpan.textContent = timeLeft;

    const timer = setInterval(() => {
        timeLeft--;
        countdownSpan.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            btn.disabled = false;
            btn.innerHTML = "إرسال الكود مرة أخرى";
        }
    }, 1000);
}


function resendCodeEmailJS() {
    const email = localStorage.getItem("verifyEmail");

    if (!email) {
        showVerifyAlert("لا يوجد بريد لإعادة الإرسال");
        return;
    }

    setButtonLoading("resendBtn", true);
    hideError("codeError");

    const newCode = Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem("verifyCode", newCode);
    localStorage.setItem("verifyCodeTime", Date.now().toString());

    const params = { to_email: email, code: newCode };

    emailjs.send("service_zmn43rn", "template_9io3rt8", params)
        .then(() => {
            startResendTimer();
            showVerifyAlert("تم إرسال رمز جديد");
            
            // Clear code inputs
            const codeInputs = document.querySelectorAll('.code-input');
            codeInputs.forEach(input => input.value = '');
            codeInputs[0].focus();
        })
        .catch((error) => {
            console.error("EmailJS Error:", error);
            showError("codeError", "حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى");
        })
        .finally(() => {
            setButtonLoading("resendBtn", false);
        });
}


function verifyLoginEmailJS() {
    const entered = getCodeFromInputs();
    const saved = localStorage.getItem("verifyCode");
    const email = localStorage.getItem("verifyEmail");
    const codeTime = localStorage.getItem("verifyCodeTime");

    hideError("codeError");

    if (!entered || entered.length !== 6) {
        showError("codeError", "الرجاء إدخال رمز التحقق المكون من 6 أرقام");
        return;
    }

    // Check if code is expired (10 minutes)
    if (codeTime && Date.now() - parseInt(codeTime) > 10 * 60 * 1000) {
        showError("codeError", "رمز التحقق منتهي، يرجى طلب رمز جديد");
        return;
    }

    if (entered !== saved) {
        showError("codeError", "رمز التحقق غير صحيح");
        
        // Shake animation for wrong code
        const codeInputs = document.querySelectorAll('.code-input');
        codeInputs.forEach(input => {
            input.style.borderColor = 'var(--bad)';
            setTimeout(() => {
                input.style.borderColor = '';
            }, 500);
        });
        return;
    }

    setButtonLoading("verifyBtn", true);

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
            orders: [],
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("loggedUser", JSON.stringify(newUser));

        showVerifyAlert("مرحبًا بك — تم إنشاء حسابك");
    }

    // Clean up verification data
    localStorage.removeItem("verifyCode");
    localStorage.removeItem("verifyEmail");
    localStorage.removeItem("verifyCodeTime");

    // في كل الحالات → صفحة استكمال البيانات
    setTimeout(() => {
        window.location.href = "onboarding.html";
    }, 1200);
}


function showVerifyAlert(msg) {
    const toast = document.getElementById("verifyToast");
    toast.textContent = msg;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}
