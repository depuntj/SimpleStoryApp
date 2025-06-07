export class LoginView {
  constructor() {
    this.activeTab = "login";
    this.isLoading = false;
  }

  render() {
    return `
        <section class="auth-page">
          <div class="auth-background">
            <div class="auth-shapes">
              <div class="shape shape-1"></div>
              <div class="shape shape-2"></div>
              <div class="shape shape-3"></div>
            </div>
          </div>
          
          <div class="container">
            <div class="auth-container">
              <header class="auth-header">
                <div class="auth-logo">
                  <i class="fas fa-book-open"></i>
                </div>
                <h1>Dicoding Stories</h1>
                <p>Bergabunglah dengan komunitas untuk berbagi cerita</p>
              </header>
              
              <div class="auth-content">
                <div class="auth-tabs" role="tablist">
                  <button 
                    id="login-tab" 
                    class="auth-tab active" 
                    type="button"
                    role="tab"
                    aria-selected="true"
                    aria-controls="login-form-container"
                  >
                    <i class="fas fa-sign-in-alt"></i>
                    Masuk
                  </button>
                  <button 
                    id="register-tab" 
                    class="auth-tab" 
                    type="button"
                    role="tab"
                    aria-selected="false"
                    aria-controls="register-form-container"
                  >
                    <i class="fas fa-user-plus"></i>
                    Daftar
                  </button>
                </div>
  
                <div id="login-form-container" class="auth-form-container" role="tabpanel" aria-labelledby="login-tab">
                  <form id="login-form" class="auth-form" novalidate>
                    <div class="form-group">
                      <label for="login-email" class="form-label">
                        <i class="fas fa-envelope"></i>
                        Email
                      </label>
                      <div class="input-group">
                        <span class="input-icon">
                          <i class="fas fa-envelope"></i>
                        </span>
                        <input 
                          type="email" 
                          id="login-email" 
                          name="email" 
                          class="form-input" 
                          placeholder="example@email.com"
                          required
                          autocomplete="email"
                          aria-describedby="login-email-help"
                        >
                      </div>
                      <small id="login-email-help" class="sr-only">Masukkan alamat email yang valid</small>
                    </div>
  
                    <div class="form-group">
                      <label for="login-password" class="form-label">
                        <i class="fas fa-lock"></i>
                        Password
                      </label>
                      <div class="input-group">
                        <span class="input-icon">
                          <i class="fas fa-lock"></i>
                        </span>
                        <input 
                          type="password" 
                          id="login-password" 
                          name="password" 
                          class="form-input" 
                          placeholder="Masukkan password"
                          required
                          autocomplete="current-password"
                        >
                        <button type="button" class="password-toggle" aria-label="Toggle password visibility">
                          <i class="fas fa-eye"></i>
                        </button>
                      </div>
                    </div>
  
                    <button type="submit" id="login-submit" class="auth-submit-button">
                      <span class="btn-text">
                        <i class="fas fa-sign-in-alt"></i>
                        Masuk
                      </span>
                      <span class="btn-loading" style="display: none;">
                        <i class="fas fa-spinner fa-spin"></i>
                        Memproses...
                      </span>
                    </button>
                  </form>
                </div>
  
                <div id="register-form-container" class="auth-form-container" style="display: none;" role="tabpanel" aria-labelledby="register-tab">
                  <form id="register-form" class="auth-form" novalidate>
                    <div class="form-group">
                      <label for="register-name" class="form-label">
                        <i class="fas fa-user"></i>
                        Nama Lengkap
                      </label>
                      <div class="input-group">
                        <span class="input-icon">
                          <i class="fas fa-user"></i>
                        </span>
                        <input 
                          type="text" 
                          id="register-name" 
                          name="name" 
                          class="form-input" 
                          placeholder="Masukkan nama lengkap"
                          required
                          autocomplete="name"
                        >
                      </div>
                    </div>
  
                    <div class="form-group">
                      <label for="register-email" class="form-label">
                        <i class="fas fa-envelope"></i>
                        Email
                      </label>
                      <div class="input-group">
                        <span class="input-icon">
                          <i class="fas fa-envelope"></i>
                        </span>
                        <input 
                          type="email" 
                          id="register-email" 
                          name="email" 
                          class="form-input" 
                          placeholder="example@email.com"
                          required
                          autocomplete="email"
                          aria-describedby="register-email-help"
                        >
                      </div>
                      <small id="register-email-help" class="form-help">Email akan digunakan untuk login</small>
                    </div>
  
                    <div class="form-group">
                      <label for="register-password" class="form-label">
                        <i class="fas fa-lock"></i>
                        Password
                      </label>
                      <div class="input-group">
                        <span class="input-icon">
                          <i class="fas fa-lock"></i>
                        </span>
                        <input 
                          type="password" 
                          id="register-password" 
                          name="password" 
                          class="form-input" 
                          placeholder="Minimal 8 karakter"
                          required
                          autocomplete="new-password"
                          minlength="8"
                          aria-describedby="register-password-help"
                        >
                        <button type="button" class="password-toggle" aria-label="Toggle password visibility">
                          <i class="fas fa-eye"></i>
                        </button>
                      </div>
                      <small id="register-password-help" class="form-help">Password harus minimal 8 karakter</small>
                    </div>
  
                    <button type="submit" id="register-submit" class="auth-submit-button">
                      <span class="btn-text">
                        <i class="fas fa-user-plus"></i>
                        Daftar
                      </span>
                      <span class="btn-loading" style="display: none;">
                        <i class="fas fa-spinner fa-spin"></i>
                        Mendaftar...
                      </span>
                    </button>
                  </form>
                </div>
  
                <div id="auth-message" class="auth-message" style="display: none;" role="status" aria-live="polite"></div>
                
                <div class="auth-footer">
                  <p class="guest-info">
                    <i class="fas fa-info-circle"></i>
                    Atau gunakan mode tamu untuk melihat stories tanpa login
                  </p>
                  <a href="#/" class="guest-link">
                    <i class="fas fa-eye"></i>
                    Lihat sebagai Tamu
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
  }

  afterRender() {
    this.setupTabSwitching();
    this.setupPasswordToggle();
    this.setupFormValidation();
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

  setupPasswordToggle() {
    document.querySelectorAll(".password-toggle").forEach((toggle) => {
      toggle.addEventListener("click", (e) => {
        const input = e.target.closest(".input-group").querySelector("input");
        const icon = toggle.querySelector("i");

        if (input.type === "password") {
          input.type = "text";
          icon.className = "fas fa-eye-slash";
          toggle.setAttribute("aria-label", "Hide password");
        } else {
          input.type = "password";
          icon.className = "fas fa-eye";
          toggle.setAttribute("aria-label", "Show password");
        }
      });
    });
  }

  setupFormValidation() {
    const inputs = document.querySelectorAll(".form-input");
    inputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input));
      input.addEventListener("input", () => this.clearFieldError(input));
    });
  }

  validateField(input) {
    const group = input.closest(".form-group");
    const errorElement = group.querySelector(".field-error");

    if (errorElement) {
      errorElement.remove();
    }

    let isValid = true;
    let errorMessage = "";

    if (input.hasAttribute("required") && !input.value.trim()) {
      isValid = false;
      errorMessage = "Field ini wajib diisi";
    } else if (input.type === "email" && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        isValid = false;
        errorMessage = "Format email tidak valid";
      }
    } else if (
      input.name === "password" &&
      input.value &&
      input.value.length < 8
    ) {
      isValid = false;
      errorMessage = "Password minimal 8 karakter";
    }

    if (!isValid) {
      this.showFieldError(input, errorMessage);
    }

    return isValid;
  }

  showFieldError(input, message) {
    const group = input.closest(".form-group");
    const errorElement = document.createElement("small");
    errorElement.className = "field-error";
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    group.appendChild(errorElement);
    input.classList.add("error");
  }

  clearFieldError(input) {
    const group = input.closest(".form-group");
    const errorElement = group.querySelector(".field-error");
    if (errorElement) {
      errorElement.remove();
    }
    input.classList.remove("error");
  }

  switchToTab(tab) {
    if (this.isLoading) {
      return;
    }

    const loginTab = document.getElementById("login-tab");
    const registerTab = document.getElementById("register-tab");
    const loginContainer = document.getElementById("login-form-container");
    const registerContainer = document.getElementById(
      "register-form-container"
    );

    loginTab.classList.toggle("active", tab === "login");
    registerTab.classList.toggle("active", tab === "register");

    loginTab.setAttribute("aria-selected", tab === "login");
    registerTab.setAttribute("aria-selected", tab === "register");

    loginContainer.style.display = tab === "login" ? "block" : "none";
    registerContainer.style.display = tab === "register" ? "block" : "none";

    this.activeTab = tab;
    this.clearMessages();

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
    this.isLoading = true;
    const button = document.getElementById(
      isLogin ? "login-submit" : "register-submit"
    );

    if (button) {
      button.disabled = true;
      button.querySelector(".btn-text").style.display = "none";
      button.querySelector(".btn-loading").style.display = "flex";
      button.setAttribute("aria-busy", "true");
    }

    const formInputs = document.querySelectorAll(
      `#${isLogin ? "login" : "register"}-form input, #${
        isLogin ? "login" : "register"
      }-form button`
    );
    formInputs.forEach((input) => {
      if (input !== button) input.disabled = true;
    });

    const tabs = document.querySelectorAll(".auth-tab");
    tabs.forEach((tab) => {
      tab.disabled = true;
    });
  }

  hideLoading(isLogin = true) {
    this.isLoading = false;
    const button = document.getElementById(
      isLogin ? "login-submit" : "register-submit"
    );

    if (button) {
      button.disabled = false;
      button.querySelector(".btn-text").style.display = "flex";
      button.querySelector(".btn-loading").style.display = "none";
      button.setAttribute("aria-busy", "false");
    }

    const formInputs = document.querySelectorAll(
      `#${isLogin ? "login" : "register"}-form input, #${
        isLogin ? "login" : "register"
      }-form button`
    );
    formInputs.forEach((input) => {
      input.disabled = false;
    });

    const tabs = document.querySelectorAll(".auth-tab");
    tabs.forEach((tab) => {
      tab.disabled = false;
    });
  }

  showMessage(message, type = "error") {
    const messageElement = document.getElementById("auth-message");
    if (messageElement) {
      const icons = {
        success: "fas fa-check-circle",
        error: "fas fa-exclamation-circle",
        warning: "fas fa-exclamation-triangle",
        info: "fas fa-info-circle",
      };

      messageElement.innerHTML = `
          <i class="${icons[type]}"></i>
          <span>${message}</span>
        `;
      messageElement.className = `auth-message ${type}`;
      messageElement.style.display = "flex";
      messageElement.setAttribute("aria-live", "polite");

      messageElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  clearMessages() {
    const messageElement = document.getElementById("auth-message");
    if (messageElement) {
      messageElement.style.display = "none";
      messageElement.innerHTML = "";
      messageElement.className = "auth-message";
    }
  }

  showSuccess(message) {
    this.showMessage(message, "success");
    if (typeof window.showToast === "function") {
      window.showToast(message, "success");
    }
  }

  showError(message) {
    this.showMessage(message, "error");
    if (typeof window.showToast === "function") {
      window.showToast(message, "error");
    }
  }

  clearForms() {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    if (loginForm) loginForm.reset();
    if (registerForm) registerForm.reset();

    // Clear field errors
    document
      .querySelectorAll(".field-error")
      .forEach((error) => error.remove());
    document
      .querySelectorAll(".form-input.error")
      .forEach((input) => input.classList.remove("error"));
  }

  validateLoginForm(data) {
    let isValid = true;

    if (!data.email) {
      this.showError("Email harus diisi");
      const emailInput = document.getElementById("login-email");
      if (emailInput) {
        emailInput.focus();
        this.showFieldError(emailInput, "Email harus diisi");
      }
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      this.showError("Format email tidak valid");
      const emailInput = document.getElementById("login-email");
      if (emailInput) {
        emailInput.focus();
        this.showFieldError(emailInput, "Format email tidak valid");
      }
      isValid = false;
    }

    if (!data.password) {
      this.showError("Password harus diisi");
      const passwordInput = document.getElementById("login-password");
      if (passwordInput) {
        passwordInput.focus();
        this.showFieldError(passwordInput, "Password harus diisi");
      }
      isValid = false;
    }

    return isValid;
  }

  validateRegisterForm(data) {
    let isValid = true;

    if (!data.name) {
      this.showError("Nama harus diisi");
      const nameInput = document.getElementById("register-name");
      if (nameInput) {
        nameInput.focus();
        this.showFieldError(nameInput, "Nama harus diisi");
      }
      isValid = false;
    } else if (data.name.length < 2) {
      this.showError("Nama harus minimal 2 karakter");
      const nameInput = document.getElementById("register-name");
      if (nameInput) {
        nameInput.focus();
        this.showFieldError(nameInput, "Nama harus minimal 2 karakter");
      }
      isValid = false;
    }

    if (!data.email) {
      this.showError("Email harus diisi");
      const emailInput = document.getElementById("register-email");
      if (emailInput) {
        emailInput.focus();
        this.showFieldError(emailInput, "Email harus diisi");
      }
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      this.showError("Format email tidak valid");
      const emailInput = document.getElementById("register-email");
      if (emailInput) {
        emailInput.focus();
        this.showFieldError(emailInput, "Format email tidak valid");
      }
      isValid = false;
    }

    if (!data.password) {
      this.showError("Password harus diisi");
      const passwordInput = document.getElementById("register-password");
      if (passwordInput) {
        passwordInput.focus();
        this.showFieldError(passwordInput, "Password harus diisi");
      }
      isValid = false;
    } else if (data.password.length < 8) {
      this.showError("Password harus minimal 8 karakter");
      const passwordInput = document.getElementById("register-password");
      if (passwordInput) {
        passwordInput.focus();
        this.showFieldError(passwordInput, "Password harus minimal 8 karakter");
      }
      isValid = false;
    }

    return isValid;
  }
}
