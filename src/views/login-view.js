export class LoginView {
  constructor() {
    this.activeTab = "login";
  }

  setupTabSwitching() {
    const loginTab = document.getElementById("login-tab");
    const registerTab = document.getElementById("register-tab");

    loginTab.addEventListener("click", () => {
      this.switchToTab("login");
    });

    registerTab.addEventListener("click", () => {
      this.switchToTab("register");
    });
  }

  switchToTab(tab) {
    const loginTab = document.getElementById("login-tab");
    const registerTab = document.getElementById("register-tab");
    const loginContainer = document.getElementById("login-form-container");
    const registerContainer = document.getElementById(
      "register-form-container"
    );

    // Update active tab
    loginTab.classList.toggle("active", tab === "login");
    registerTab.classList.toggle("active", tab === "register");

    // Show/hide forms
    loginContainer.style.display = tab === "login" ? "block" : "none";
    registerContainer.style.display = tab === "register" ? "block" : "none";

    this.activeTab = tab;
    this.clearMessages();

    // Focus on first input of active form
    setTimeout(() => {
      const firstInput = document.querySelector(`#${tab}-form-container input`);
      if (firstInput) firstInput.focus();
    }, 100);
  }

  getLoginFormData() {
    return {
      email: document.getElementById("login-email").value.trim(),
      password: document.getElementById("login-password").value,
    };
  }

  getRegisterFormData() {
    return {
      name: document.getElementById("register-name").value.trim(),
      email: document.getElementById("register-email").value.trim(),
      password: document.getElementById("register-password").value,
    };
  }

  showLoading(isLogin = true) {
    const submitButton = document.getElementById(
      isLogin ? "login-submit" : "register-submit"
    );
    submitButton.disabled = true;
    submitButton.textContent = isLogin ? "Memproses..." : "Mendaftar...";
  }

  hideLoading(isLogin = true) {
    const submitButton = document.getElementById(
      isLogin ? "login-submit" : "register-submit"
    );
    submitButton.disabled = false;
    submitButton.textContent = isLogin ? "Masuk" : "Daftar";
  }

  showMessage(message, type = "error") {
    const messageElement = document.getElementById("auth-message");
    messageElement.textContent = message;
    messageElement.className = `auth-message ${type}`;
    messageElement.style.display = "block";
    messageElement.setAttribute("aria-live", "polite");
  }

  clearMessages() {
    const messageElement = document.getElementById("auth-message");
    messageElement.style.display = "none";
    messageElement.textContent = "";
  }

  showSuccess(message) {
    this.showMessage(message, "success");
  }

  showError(message) {
    this.showMessage(message, "error");
  }

  clearForms() {
    document.getElementById("login-form").reset();
    document.getElementById("register-form").reset();
  }

  validateLoginForm(data) {
    if (!data.email) {
      this.showError("Email harus diisi");
      document.getElementById("login-email").focus();
      return false;
    }

    if (!data.password) {
      this.showError("Password harus diisi");
      document.getElementById("login-password").focus();
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      this.showError("Format email tidak valid");
      document.getElementById("login-email").focus();
      return false;
    }

    return true;
  }

  validateRegisterForm(data) {
    if (!data.name) {
      this.showError("Nama harus diisi");
      document.getElementById("register-name").focus();
      return false;
    }

    if (!data.email) {
      this.showError("Email harus diisi");
      document.getElementById("register-email").focus();
      return false;
    }

    if (!data.password) {
      this.showError("Password harus diisi");
      document.getElementById("register-password").focus();
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      this.showError("Format email tidak valid");
      document.getElementById("register-email").focus();
      return false;
    }

    if (data.password.length < 8) {
      this.showError("Password harus minimal 8 karakter");
      document.getElementById("register-password").focus();
      return false;
    }

    return true;
  }
}
