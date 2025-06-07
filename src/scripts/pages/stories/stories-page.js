import { StoryModel } from "../../../models/story-model.js";
import { StoriesView } from "../../../views/stories-view.js";
import { StoriesPresenter } from "../../../presenters/stories-presenter.js";

export default class StoriesPage {
  constructor() {
    this.presenter = null;
    this.view = null;
    this.model = null;
    this.isDestroyed = false;
  }

  async render() {
    return `
      <section class="stories-page">
        <div class="container">
          <header class="page-header">
            <h1>Dicoding Stories</h1>
            <p>Kumpulan cerita dari komunitas Dicoding</p>
            <a href="#/add" class="add-story-fab" aria-label="Tambah story baru">
              ➕
            </a>
          </header>
          
          <div class="stories-content">
            <div class="stories-list" id="stories-container" role="main">
            </div>
            
            <div class="map-section">
              <h2>Lokasi Stories</h2>
              <div id="map-container" class="map-container"></div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Prevent double initialization
    if (this.presenter) {
      console.log("StoriesPage already initialized, skipping...");
      return;
    }

    try {
      console.log("Initializing StoriesPage...");

      // Wait a bit to ensure DOM is fully ready
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check if page is still active (not destroyed during wait)
      if (this.isDestroyed) {
        console.log(
          "StoriesPage was destroyed during initialization, aborting..."
        );
        return;
      }

      // Initialize components
      this.model = new StoryModel();
      this.view = new StoriesView();
      this.presenter = new StoriesPresenter(this.model, this.view);

      // Setup event handlers
      this.presenter.setupRetryHandler();

      // Load stories with error handling
      try {
        await this.presenter.loadStories();
      } catch (error) {
        console.error("Error loading stories in afterRender:", error);
        // The presenter should handle the error display
      }

      console.log("StoriesPage initialized successfully");
    } catch (error) {
      console.error("Error in StoriesPage afterRender:", error);

      // Show error in container if possible
      const container = document.getElementById("stories-container");
      if (container) {
        container.innerHTML = `
          <div class="error-container" role="alert">
            <h3>Terjadi Kesalahan</h3>
            <p>Tidak dapat memuat halaman stories. Silakan refresh halaman.</p>
            <button onclick="window.location.reload()" class="retry-button">
              Muat Ulang
            </button>
          </div>
        `;
      }
    }
  }

  // Cleanup method
  destroy() {
    console.log("Destroying StoriesPage...");
    this.isDestroyed = true;

    // Cleanup view (which will cleanup the map)
    if (this.view && typeof this.view.destroy === "function") {
      this.view.destroy();
    }

    // Clear references
    this.presenter = null;
    this.view = null;
    this.model = null;
  }
}
