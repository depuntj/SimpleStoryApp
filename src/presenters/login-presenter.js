import authService from "../services/auth-service.js";

export class LoginPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  setupEventHandlers() {
    console.log("Setting up login presenter event handlers");

    this.view.onLoginFormSubmit((formData) => {
      console.log("Login form submitted:", formData);
      this.handleLogin(formData);
    });

    this.view.onRegisterFormSubmit((formData) => {
      console.log("Register form submitted:", formData);
      this.handleRegister(formData);
    });

    this.view.onEscapePressed(() => {
      this.view.clearMessages();
    });
  }

  async handleLogin(formData) {
    console.log("Handling login with data:", formData);

    if (!this.view.validateLoginForm(formData)) {
      console.log("Login form validation failed");
      return;
    }

    try {
      console.log("Starting login process...");
      this.view.showLoading(true);
      this.view.clearMessages();

      const result = await authService.login(formData.email, formData.password);
      console.log("Login successful:", result);

      this.view.showSuccess("Login berhasil! Mengalihkan ke halaman utama...");

      setTimeout(() => {
        console.log("Redirecting to home...");
        window.location.hash = "#/";
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Terjadi kesalahan saat login";

      if (error.message.includes("Format email tidak valid")) {
        errorMessage = "Format email tidak valid";
      } else if (error.message.includes("Email atau password salah")) {
        errorMessage = "Email atau password salah";
      } else if (error.message.includes("Password harus diisi")) {
        errorMessage = "Password harus diisi";
      } else if (error.message) {
        errorMessage = error.message;
      }

      this.view.showError(errorMessage);
    } finally {
      this.view.hideLoading(true);
    }
  }

  async handleRegister(formData) {
    console.log("Handling register with data:", formData);

    if (!this.view.validateRegisterForm(formData)) {
      console.log("Register form validation failed");
      return;
    }

    try {
      console.log("Starting register process...");
      this.view.showLoading(false);
      this.view.clearMessages();

      const result = await authService.register(
        formData.name,
        formData.email,
        formData.password
      );
      console.log("Register successful:", result);

      this.view.showSuccess(
        "Registrasi berhasil! Silakan login dengan akun Anda."
      );
      this.view.clearForms();

      setTimeout(() => {
        this.view.switchToTab("login");
      }, 2000);
    } catch (error) {
      console.error("Register error:", error);
      let errorMessage = "Terjadi kesalahan saat registrasi";

      if (error.message.includes("User Created")) {
        this.view.showSuccess(
          "Registrasi berhasil! Silakan login dengan akun Anda."
        );
        this.view.clearForms();
        setTimeout(() => {
          this.view.switchToTab("login");
        }, 2000);
        return;
      } else if (error.message.includes("Email mungkin sudah terdaftar")) {
        errorMessage = "Email sudah terdaftar. Silakan gunakan email lain.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      this.view.showError(errorMessage);
    } finally {
      this.view.hideLoading(false);
    }
  }
}
