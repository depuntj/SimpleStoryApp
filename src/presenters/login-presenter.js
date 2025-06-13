export class LoginPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  setupEventHandlers() {
    this.view.onLoginFormSubmit((formData) => this.handleLogin(formData));
    this.view.onRegisterFormSubmit((formData) => this.handleRegister(formData));
    this.view.onEscapePressed(() => this.view.clearMessages());
  }

  async handleLogin(formData) {
    if (!this.view.validateLoginForm(formData)) {
      return;
    }

    try {
      this.view.showLoading(true);
      this.view.clearMessages();

      await authService.login(formData.email, formData.password);

      this.view.showSuccess("Login berhasil! Mengalihkan ke halaman utama...");

      setTimeout(() => {
        window.location.hash = "#/";
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);
      this.view.showError(error.message || "Terjadi kesalahan saat login");
    } finally {
      this.view.hideLoading(true);
    }
  }

  async handleRegister(formData) {
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

      setTimeout(() => {
        this.view.switchToTab("login");
      }, 2000);
    } catch (error) {
      console.error("Register error:", error);
      this.view.showError(error.message || "Terjadi kesalahan saat registrasi");
    } finally {
      this.view.hideLoading(false);
    }
  }
}
