import { AuthModel } from "../../../models/auth-model.js";
import { LoginView } from "../../../views/login-view.js";
import { LoginPresenter } from "../../../presenters/login-presenter.js";
import authService from "../../../services/auth-service.js";

export default class LoginPage {
  constructor() {
    this.presenter = null;
    this.view = null;
    this.model = null;
  }

  async render() {
    if (authService.isLoggedIn()) {
      window.location.hash = "#/";
      return "<div>Redirecting...</div>";
    }

    this.view = new LoginView();
    return this.view.render();
  }

  async afterRender() {
    if (authService.isLoggedIn()) {
      window.location.hash = "#/";
      return;
    }

    this.model = new AuthModel();
    this.presenter = new LoginPresenter(this.model, this.view);

    this.view.afterRender();
    this.presenter.setupEventHandlers();

    setTimeout(() => {
      const firstInput = document.getElementById("login-email");
      if (firstInput) firstInput.focus();
    }, 100);
  }

  destroy() {
    if (this.presenter) {
      this.presenter = null;
    }
    if (this.view) {
      this.view = null;
    }
    if (this.model) {
      this.model = null;
    }
  }
}
