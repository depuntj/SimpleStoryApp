export class LoginView {
  constructor() {
    this.activeTab = "login";
    this.isLoading = false;
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
    // Don't switch tabs while loading
    if (this.isLoading) {
      return;
    }

    const loginTab = document.getElementById("login-tab");
    const registerTab = document.getElementById("register-tab");
    const loginContainer = document.getElementById("login-form-container");
    const registerContainer = document.getElementById(
      "register-form-container"
    );

    // Update active tab
    loginTab.classList.toggle("active", tab === "login");
    registerTab.classList.toggle("active", tab === "register");

    // Update ARIA attributes
    loginTab.setAttribute("aria-selected", tab === "login");
    registerTab.setAttribute("aria-selected", tab === "register");

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
    try {
      console.log(
        `LoginView: Showing loading for ${isLogin ? "login" : "register"}`
      );

      this.isLoading = true;
      const submitButton = document.getElementById(
        isLogin ? "login-submit" : "register-submit"
      );

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = isLogin ? "Memproses..." : "Mendaftar...";
        submitButton.setAttribute("aria-busy", "true");
      }

      // Disable form inputs during loading
      const formInputs = document.querySelectorAll(
        `#${isLogin ? "login" : "register"}-form input`
      );
      formInputs.forEach((input) => {
        input.disabled = true;
      });

      // Disable tab switching during loading
      const tabs = document.querySelectorAll(".auth-tab");
      tabs.forEach((tab) => {
        tab.disabled = true;
      });
    } catch (error) {
      console.error("LoginView: Error showing loading:", error);
    }
  }

  hideLoading(isLogin = true) {
    try {
      console.log(
        `LoginView: Hiding loading for ${isLogin ? "login" : "register"}`
      );

      this.isLoading = false;
      const submitButton = document.getElementById(
        isLogin ? "login-submit" : "register-submit"
      );

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = isLogin ? "Masuk" : "Daftar";
        submitButton.setAttribute("aria-busy", "false");
      }

      // Re-enable form inputs
      const formInputs = document.querySelectorAll(
        `#${isLogin ? "login" : "register"}-form input`
      );
      formInputs.forEach((input) => {
        input.disabled = false;
      });

      // Re-enable tab switching
      const tabs = document.querySelectorAll(".auth-tab");
      tabs.forEach((tab) => {
        tab.disabled = false;
      });
    } catch (error) {
      console.error("LoginView: Error hiding loading:", error);
    }
  }

  showMessage(message, type = "error") {
    try {
      const messageElement = document.getElementById("auth-message");
      if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `auth-message ${type}`;
        messageElement.style.display = "block";
        messageElement.setAttribute("aria-live", "polite");

        // Scroll message into view if needed
        messageElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    } catch (error) {
      console.error("LoginView: Error showing message:", error);
      // Fallback to alert if message element not found
      alert(message);
    }
  }

  clearMessages() {
    try {
      const messageElement = document.getElementById("auth-message");
      if (messageElement) {
        messageElement.style.display = "none";
        messageElement.textContent = "";
        messageElement.className = "auth-message";
      }
    } catch (error) {
      console.error("LoginView: Error clearing messages:", error);
    }
  }

  showSuccess(message) {
    this.showMessage(message, "success");
  }

  showError(message) {
    this.showMessage(message, "error");
  }

  clearForms() {
    try {
      const loginForm = document.getElementById("login-form");
      const registerForm = document.getElementById("register-form");

      if (loginForm) loginForm.reset();
      if (registerForm) registerForm.reset();
    } catch (error) {
      console.error("LoginView: Error clearing forms:", error);
    }
  }

  validateLoginForm(data) {
    if (!data.email) {
      this.showError("Email harus diisi");
      const emailInput = document.getElementById("login-email");
      if (emailInput) emailInput.focus();
      return false;
    }

    if (!data.password) {
      this.showError("Password harus diisi");
      const passwordInput = document.getElementById("login-password");
      if (passwordInput) passwordInput.focus();
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      this.showError("Format email tidak valid");
      const emailInput = document.getElementById("login-email");
      if (emailInput) emailInput.focus();
      return false;
    }

    return true;
  }

  validateRegisterForm(data) {
    if (!data.name) {
      this.showError("Nama harus diisi");
      const nameInput = document.getElementById("register-name");
      if (nameInput) nameInput.focus();
      return false;
    }

    if (data.name.length < 2) {
      this.showError("Nama harus minimal 2 karakter");
      const nameInput = document.getElementById("register-name");
      if (nameInput) nameInput.focus();
      return false;
    }

    if (!data.email) {
      this.showError("Email harus diisi");
      const emailInput = document.getElementById("register-email");
      if (emailInput) emailInput.focus();
      return false;
    }

    if (!data.password) {
      this.showError("Password harus diisi");
      const passwordInput = document.getElementById("register-password");
      if (passwordInput) passwordInput.focus();
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      this.showError("Format email tidak valid");
      const emailInput = document.getElementById("register-email");
      if (emailInput) emailInput.focus();
      return false;
    }

    if (data.password.length < 8) {
      this.showError("Password harus minimal 8 karakter");
      const passwordInput = document.getElementById("register-password");
      if (passwordInput) passwordInput.focus();
      return false;
    }

    return true;
  }
}
