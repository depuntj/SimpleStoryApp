export class LoginView {
  constructor() {
    this.activeTab = "login";
    this.isLoading = false;
    this.formValidationEnabled = true;
  }

  render() {
    return `
      <main class="auth-page" role="main">
        <div class="auth-background">
          <div class="auth-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
          </div>
        </div>
        
        <div class="container">
          <article class="auth-container">
            <header class="auth-header">
              <div class="auth-logo">
                <i class="fas fa-book-open" aria-hidden="true"></i>
              </div>
              <h1>Dicoding Stories</h1>
              <p>Bergabunglah dengan komunitas untuk berbagi cerita</p>
            </header>
            
            <section class="auth-content">
              <div class="auth-tabs" role="tablist">
                <button 
                  id="login-tab" 
                  class="auth-tab active" 
                  type="button"
                  role="tab"
                  aria-selected="true"
                  aria-controls="login-form-container"
                  aria-describedby="login-description"
                >
                  <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
                  Masuk
                </button>
                <button 
                  id="register-tab" 
                  class="auth-tab" 
                  type="button"
                  role="tab"
                  aria-selected="false"
                  aria-controls="register-form-container"
                  aria-describedby="register-description"
                >
                  <i class="fas fa-user-plus" aria-hidden="true"></i>
                  Daftar
                </button>
              </div>
  
              <div id="login-form-container" 
                   class="auth-form-container" 
                   role="tabpanel" 
                   aria-labelledby="login-tab"
                   aria-describedby="login-description">
                <div id="login-description" class="sr-only">
                  Form untuk masuk ke akun Dicoding Stories
                </div>
                <form id="login-form" class="auth-form" novalidate>
                  <fieldset>
                    <legend class="sr-only">Informasi Login</legend>
                    
                    <div class="form-group">
                      <label for="login-email" class="form-label">
                        <i class="fas fa-envelope" aria-hidden="true"></i>
                        Email
                        <span class="required-indicator" aria-label="wajib diisi">*</span>
                      </label>
                      <div class="input-group">
                        <span class="input-icon" aria-hidden="true">
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
                          aria-describedby="login-email-help login-email-error"
                          aria-invalid="false"
                        >
                      </div>
                      <small id="login-email-help" class="form-help">
                        Masukkan alamat email yang valid
                      </small>
                      <div id="login-email-error" class="field-error" role="alert" aria-live="polite"></div>
                    </div>
  
                    <div class="form-group">
                      <label for="login-password" class="form-label">
                        <i class="fas fa-lock" aria-hidden="true"></i>
                        Password
                        <span class="required-indicator" aria-label="wajib diisi">*</span>
                      </label>
                      <div class="input-group">
                        <span class="input-icon" aria-hidden="true">
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
                          aria-describedby="login-password-help login-password-error"
                          aria-invalid="false"
                        >
                        <button type="button" 
                                class="password-toggle" 
                                aria-label="Tampilkan password"
                                aria-pressed="false"
                                aria-describedby="password-toggle-help">
                          <i class="fas fa-eye" aria-hidden="true"></i>
                        </button>
                      </div>
                      <small id="login-password-help" class="form-help">
                        Masukkan password akun Anda
                      </small>
                      <small id="password-toggle-help" class="sr-only">
                        Klik untuk menampilkan atau menyembunyikan password
                      </small>
                      <div id="login-password-error" class="field-error" role="alert" aria-live="polite"></div>
                    </div>
  
                    <button type="submit" id="login-submit" class="auth-submit-button">
                      <span class="btn-text">
                        <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
                        Masuk
                      </span>
                      <span class="btn-loading" style="display: none;">
                        <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>
                        Memproses...
                      </span>
                    </button>
                  </fieldset>
                </form>
              </div>
  
              <div id="register-form-container" 
                   class="auth-form-container" 
                   style="display: none;" 
                   role="tabpanel" 
                   aria-labelledby="register-tab"
                   aria-describedby="register-description">
                <div id="register-description" class="sr-only">
                  Form untuk mendaftar akun baru Dicoding Stories
                </div>
                <form id="register-form" class="auth-form" novalidate>
                  <fieldset>
                    <legend class="sr-only">Informasi Pendaftaran</legend>
                    
                    <div class="form-group">
                      <label for="register-name" class="form-label">
                        <i class="fas fa-user" aria-hidden="true"></i>
                        Nama Lengkap
                        <span class="required-indicator" aria-label="wajib diisi">*</span>
                      </label>
                      <div class="input-group">
                        <span class="input-icon" aria-hidden="true">
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
                          minlength="2"
                          aria-describedby="register-name-help register-name-error"
                          aria-invalid="false"
                        >
                      </div>
                      <small id="register-name-help" class="form-help">
                        Nama akan ditampilkan di profil Anda
                      </small>
                      <div id="register-name-error" class="field-error" role="alert" aria-live="polite"></div>
                    </div>
  
                    <div class="form-group">
                      <label for="register-email" class="form-label">
                        <i class="fas fa-envelope" aria-hidden="true"></i>
                        Email
                        <span class="required-indicator" aria-label="wajib diisi">*</span>
                      </label>
                      <div class="input-group">
                        <span class="input-icon" aria-hidden="true">
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
                          aria-describedby="register-email-help register-email-error"
                          aria-invalid="false"
                        >
                      </div>
                      <small id="register-email-help" class="form-help">
                        Email akan digunakan untuk login
                      </small>
                      <div id="register-email-error" class="field-error" role="alert" aria-live="polite"></div>
                    </div>
  
                    <div class="form-group">
                      <label for="register-password" class="form-label">
                        <i class="fas fa-lock" aria-hidden="true"></i>
                        Password
                        <span class="required-indicator" aria-label="wajib diisi">*</span>
                      </label>
                      <div class="input-group">
                        <span class="input-icon" aria-hidden="true">
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
                          aria-describedby="register-password-help register-password-error"
                          aria-invalid="false"
                        >
                        <button type="button" 
                                class="password-toggle" 
                                aria-label="Tampilkan password"
                                aria-pressed="false">
                          <i class="fas fa-eye" aria-hidden="true"></i>
                        </button>
                      </div>
                      <small id="register-password-help" class="form-help">
                        Password harus minimal 8 karakter
                      </small>
                      <div id="register-password-error" class="field-error" role="alert" aria-live="polite"></div>
                    </div>
  
                    <button type="submit" id="register-submit" class="auth-submit-button">
                      <span class="btn-text">
                        <i class="fas fa-user-plus" aria-hidden="true"></i>
                        Daftar
                      </span>
                      <span class="btn-loading" style="display: none;">
                        <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>
                        Mendaftar...
                      </span>
                    </button>
                  </fieldset>
                </form>
              </div>
  
              <div id="auth-message" class="auth-message" style="display: none;" role="status" aria-live="polite" aria-atomic="true"></div>
              
              <aside class="auth-footer">
                <p class="guest-info">
                  <i class="fas fa-info-circle" aria-hidden="true"></i>
                  Atau gunakan mode tamu untuk melihat stories tanpa login
                </p>
                <a href="#/" class="guest-link">
                  <i class="fas fa-eye" aria-hidden="true"></i>
                  Lihat sebagai Tamu
                </a>
              </aside>
            </section>
          </article>
        </div>
      </main>
    `;
  }

  afterRender() {
    this.setupTabSwitching();
    this.setupPasswordToggle();
    this.setupFormValidation();
    this.setupAccessibility();
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

    loginTab.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.switchToTab("login");
      }
    });

    registerTab.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.switchToTab("register");
      }
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
          toggle.setAttribute("aria-label", "Sembunyikan password");
        } else {
          input.type = "password";
          icon.className = "fas fa-eye";
          toggle.setAttribute("aria-label", "Tampilkan password");
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

  setupAccessibility() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.clearMessages();
      }
    });

    const firstInput = document.getElementById("login-email");
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }

  validateField(input) {
    if (!this.formValidationEnabled) return true;

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
    } else if (input.name === "name" && input.value && input.value.length < 2) {
      isValid = false;
      errorMessage = "Nama minimal 2 karakter";
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
    input.setAttribute("aria-invalid", "true");
  }

  clearFieldError(input) {
    const group = input.closest(".form-group");
    const errorElement = group.querySelector(".field-error");
    if (errorElement) {
      errorElement.remove();
    }
    input.classList.remove("error");
    input.removeAttribute("aria-invalid");
  }

  switchToTab(tab) {
    if (this.isLoading) return;

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

    document
      .querySelectorAll(".field-error")
      .forEach((error) => error.remove());
    document.querySelectorAll(".form-input.error").forEach((input) => {
      input.classList.remove("error");
      input.removeAttribute("aria-invalid");
    });
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

    this.clearMessages();
  }

  validateLoginForm(data) {
    this.formValidationEnabled = false;

    let isValid = true;
    const errors = [];

    if (!data.email) {
      errors.push("Email harus diisi");
      const emailInput = document.getElementById("login-email");
      if (emailInput) {
        emailInput.focus();
        this.showFieldError(emailInput, "Email harus diisi");
      }
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push("Format email tidak valid");
      const emailInput = document.getElementById("login-email");
      if (emailInput) {
        emailInput.focus();
        this.showFieldError(emailInput, "Format email tidak valid");
      }
      isValid = false;
    }

    if (!data.password) {
      errors.push("Password harus diisi");
      const passwordInput = document.getElementById("login-password");
      if (passwordInput && isValid) {
        passwordInput.focus();
        this.showFieldError(passwordInput, "Password harus diisi");
      }
      isValid = false;
    }

    if (!isValid) {
      this.showError(errors[0]);
    }

    this.formValidationEnabled = true;
    return isValid;
  }

  validateRegisterForm(data) {
    this.formValidationEnabled = false;

    let isValid = true;
    const errors = [];

    if (!data.name) {
      errors.push("Nama harus diisi");
      const nameInput = document.getElementById("register-name");
      if (nameInput) {
        nameInput.focus();
        this.showFieldError(nameInput, "Nama harus diisi");
      }
      isValid = false;
    } else if (data.name.length < 2) {
      errors.push("Nama harus minimal 2 karakter");
      const nameInput = document.getElementById("register-name");
      if (nameInput) {
        nameInput.focus();
        this.showFieldError(nameInput, "Nama harus minimal 2 karakter");
      }
      isValid = false;
    }

    if (!data.email) {
      errors.push("Email harus diisi");
      const emailInput = document.getElementById("register-email");
      if (emailInput && isValid) {
        emailInput.focus();
        this.showFieldError(emailInput, "Email harus diisi");
      }
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push("Format email tidak valid");
      const emailInput = document.getElementById("register-email");
      if (emailInput && isValid) {
        emailInput.focus();
        this.showFieldError(emailInput, "Format email tidak valid");
      }
      isValid = false;
    }

    if (!data.password) {
      errors.push("Password harus diisi");
      const passwordInput = document.getElementById("register-password");
      if (passwordInput && isValid) {
        passwordInput.focus();
        this.showFieldError(passwordInput, "Password harus diisi");
      }
      isValid = false;
    } else if (data.password.length < 8) {
      errors.push("Password harus minimal 8 karakter");
      const passwordInput = document.getElementById("register-password");
      if (passwordInput && isValid) {
        passwordInput.focus();
        this.showFieldError(passwordInput, "Password harus minimal 8 karakter");
      }
      isValid = false;
    }

    if (!isValid) {
      this.showError(errors[0]);
    }

    this.formValidationEnabled = true;
    return isValid;
  }
}
