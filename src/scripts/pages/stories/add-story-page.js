import { AddStoryModel } from "../../../models/add-story-model.js";
import { AddStoryView } from "../../../views/add-story-view.js";
import { AddStoryPresenter } from "../../../presenters/add-story-presenter.js";
import authService from "../../../services/auth-service.js";

export default class AddStoryPage {
  constructor() {
    this.presenter = null;
    this.view = null;
    this.model = null;
    this.isInitialized = false;
  }

  async render() {
    this.view = new AddStoryView();
    return this.view.render();
  }

  async afterRender() {
    if (this.isInitialized) return;

    try {
      await this.waitForElements();

      this.model = new AddStoryModel();
      this.presenter = new AddStoryPresenter(this.model, this.view);

      await this.view.afterRender();
      this.presenter.setupEventHandlers();

      this.isInitialized = true;

      console.log("AddStoryPage initialized successfully");
    } catch (error) {
      console.error("Error initializing add story page:", error);
      this.showError();
    }
  }

  async waitForElements() {
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 50;

      const check = () => {
        attempts++;
        const form = document.getElementById("add-story-form");
        const container = document.querySelector(".add-story-container");

        if (form && container) {
          resolve();
        } else if (attempts >= maxAttempts) {
          console.warn("Add story elements not found after timeout");
          resolve();
        } else {
          setTimeout(check, 50);
        }
      };
      check();
    });
  }

  showError() {
    const container = document.querySelector(".add-story-container .container");
    if (container) {
      container.innerHTML = `
        <div class="error-state">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Terjadi Kesalahan</h3>
          <p>Tidak dapat memuat halaman tambah story. Silakan coba lagi.</p>
          <button onclick="window.location.reload()" class="btn-retry">
            <i class="fas fa-redo"></i>
            Muat Ulang
          </button>
        </div>
      `;
    }
  }

  destroy() {
    if (this.view && typeof this.view.destroy === "function") {
      this.view.destroy();
    }
    this.presenter = null;
    this.view = null;
    this.model = null;
    this.isInitialized = false;
  }
}
