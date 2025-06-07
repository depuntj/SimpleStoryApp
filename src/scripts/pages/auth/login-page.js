import { AuthModel } from "../../../models/auth-model.js";
import { LoginView } from "../../../views/login-view.js";
import { LoginPresenter } from "../../../presenters/login-presenter.js";
import authService from "../../../services/auth-service.js";

export default class LoginPage {
  constructor() {
    this.presenter = null;
  }

  async render() {
    // If user is already logged in, redirect to home
    if (authService.isLoggedIn()) {
      window.location.hash = "#/";
      return "<div>Redirecting...</div>";
    }

    return `
      <section class="login-page">
        <div class="container">
          <div class="auth-container">
            <header class="auth-header">
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
                  Daftar
                </button>
              </div>

              <div id="login-form-container" class="auth-form-container" role="tabpanel" aria-labelledby="login-tab">
                <form id="login-form" class="auth-form" novalidate>
                  <div class="form-group">
                    <label for="login-email" class="form-label">Email</label>
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
                    <small id="login-email-help" class="sr-only">Masukkan alamat email yang valid</small>
                  </div>

                  <div class="form-group">
                    <label for="login-password" class="form-label">Password</label>
                    <input 
                      type="password" 
                      id="login-password" 
                      name="password" 
                      class="form-input" 
                      placeholder="Masukkan password"
                      required
                      autocomplete="current-password"
                    >
                  </div>

                  <button type="submit" id="login-submit" class="auth-submit-button">
                    Masuk
                  </button>
                </form>
              </div>

              <div id="register-form-container" class="auth-form-container" style="display: none;" role="tabpanel" aria-labelledby="register-tab">
                <form id="register-form" class="auth-form" novalidate>
                  <div class="form-group">
                    <label for="register-name" class="form-label">Nama Lengkap</label>
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

                  <div class="form-group">
                    <label for="register-email" class="form-label">Email</label>
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
                    <small id="register-email-help" class="sr-only">Email akan digunakan untuk login</small>
                  </div>

                  <div class="form-group">
                    <label for="register-password" class="form-label">Password</label>
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
                    <small id="register-password-help" class="form-help">Password harus minimal 8 karakter</small>
                  </div>

                  <button type="submit" id="register-submit" class="auth-submit-button">
                    Daftar
                  </button>
                </form>
              </div>

              <div id="auth-message" class="auth-message" style="display: none;" role="status" aria-live="polite"></div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const model = new AuthModel();
    const view = new LoginView();
    this.presenter = new LoginPresenter(model, view);

    this.presenter.setupEventHandlers();

    // Focus on first input
    setTimeout(() => {
      const firstInput = document.getElementById("login-email");
      if (firstInput) firstInput.focus();
    }, 100);
  }
}
