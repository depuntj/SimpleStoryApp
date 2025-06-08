import { StoryModel } from "../../../models/story-model.js";
import { StoriesView } from "../../../views/stories-view.js";
import { StoriesPresenter } from "../../../presenters/stories-presenter.js";

export default class HomePage {
  constructor() {
    this.presenter = null;
    this.view = null;
    this.model = null;
    this.isInitialized = false;
  }

  async render() {
    this.view = new StoriesView();
    return this.view.render();
  }

  async afterRender() {
    if (this.isInitialized) return;

    try {
      await this.waitForElements();

      this.model = new StoryModel();
      this.presenter = new StoriesPresenter(this.model, this.view);

      await this.view.afterRender();
      this.presenter.setupEventHandlers();

      this.isInitialized = true;
      await this.presenter.loadStories();
    } catch (error) {
      console.error("Error initializing home page:", error);
      this.showError();
    }
  }

  async waitForElements() {
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 50;

      const check = () => {
        attempts++;
        const container = document.getElementById("stories-container");
        const mapContainer = document.getElementById("stories-map");

        if (container && mapContainer) {
          resolve();
        } else if (attempts >= maxAttempts) {
          resolve();
        } else {
          setTimeout(check, 50);
        }
      };
      check();
    });
  }

  showError() {
    const container = document.getElementById("stories-container");
    if (container) {
      container.innerHTML = `
        <div class="error-state">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Terjadi Kesalahan</h3>
          <p>Tidak dapat memuat halaman. Silakan refresh halaman.</p>
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
