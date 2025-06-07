import authService from "../services/auth-service.js";

export class LoginPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  setupEventHandlers() {
    this.view.setupTabSwitching();

    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await this.handleLogin();
    });

    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await this.handleRegister();
    });

    // Handle keyboard navigation
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.view.clearMessages();
      }
    });
  }

  async handleLogin() {
    const formData = this.view.getLoginFormData();

    if (!this.view.validateLoginForm(formData)) {
      return;
    }

    try {
      this.view.showLoading(true);
      this.view.clearMessages();

      await authService.login(formData.email, formData.password);

      this.view.showSuccess("Login berhasil! Mengalihkan ke halaman utama...");

      // Redirect to home page after successful login
      setTimeout(() => {
        window.location.hash = "#/";
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);
      this.view.showError(this.getErrorMessage(error.message));
    } finally {
      this.view.hideLoading(true);
    }
  }

  async handleRegister() {
    const formData = this.view.getRegisterFormData();

    if (!this.view.validateRegisterForm(formData)) {
      return;
    }

    try {
      this.view.showLoading(false);
      this.view.clearMessages();

      await authService.register(
        formData.name,
        formData.email,
        formData.password
      );

      this.view.showSuccess(
        "Registrasi berhasil! Silakan login dengan akun Anda."
      );
      this.view.clearForms();

      // Switch to login tab after successful registration
      setTimeout(() => {
        this.view.switchToTab("login");
      }, 2000);
    } catch (error) {
      console.error("Register error:", error);
      this.view.showError(this.getErrorMessage(error.message));
    } finally {
      this.view.hideLoading(false);
    }
  }

  getErrorMessage(errorMessage) {
    const errorMap = {
      LOGIN_FAILED: "Email atau password salah",
      REGISTER_FAILED: "Gagal mendaftar. Email mungkin sudah terdaftar",
      "Bad Request": "Data yang dikirim tidak valid",
      "Internal Server Error": "Terjadi kesalahan server. Silakan coba lagi",
      "Failed to fetch":
        "Tidak dapat terhubung ke server. Periksa koneksi internet.",
    };

    return (
      errorMap[errorMessage] ||
      errorMessage ||
      "Terjadi kesalahan yang tidak diketahui"
    );
  }
}
