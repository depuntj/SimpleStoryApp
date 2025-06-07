// src/scripts/pages/stories/stories-page.js
import { StoryModel } from "../../../models/story-model.js";
import { StoriesView } from "../../../views/stories-view.js";
import { StoriesPresenter } from "../../../presenters/stories-presenter.js";

export default class StoriesPage {
  constructor() {
    this.presenter = null;
    this.view = null;
    this.model = null;
    this.isInitialized = false;
    this.isInitializing = false;
    this.instanceId = Math.random().toString(36).substr(2, 9);
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
              <!-- Stories akan dimuat di sini -->
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
    // PERBAIKAN: Prevent double/multiple initialization
    if (this.isInitialized || this.isInitializing) {
      console.log(
        `StoriesPage[${this.instanceId}] sudah diinisialisasi/sedang inisialisasi, skip...`
      );
      return;
    }

    this.isInitializing = true;

    try {
      console.log(`Menginisialisasi StoriesPage[${this.instanceId}]...`);

      // Tunggu sebentar untuk memastikan DOM ready
      await this.waitForDOM();

      // Check if this instance is still valid (not destroyed during wait)
      if (!this.isInitializing) {
        console.log(`StoriesPage[${this.instanceId}] dibatalkan selama wait`);
        return;
      }

      // Check if containers exist
      const storiesContainer = document.getElementById("stories-container");
      const mapContainer = document.getElementById("map-container");

      if (!storiesContainer || !mapContainer) {
        throw new Error("Required containers not found in DOM");
      }

      // Initialize components
      this.model = new StoryModel();
      this.view = new StoriesView();
      this.presenter = new StoriesPresenter(this.model, this.view);

      // Setup event handlers
      this.presenter.setupRetryHandler();

      // Mark as initialized
      this.isInitialized = true;
      this.isInitializing = false;

      // Load stories dengan error handling
      console.log(`Memuat stories[${this.instanceId}]...`);
      await this.presenter.loadStories();

      console.log(`StoriesPage[${this.instanceId}] berhasil diinisialisasi`);
    } catch (error) {
      console.error(
        `Error di StoriesPage[${this.instanceId}] afterRender:`,
        error
      );
      this.isInitializing = false;
      this.showInitError();
    }
  }

  // Method untuk menunggu DOM ready
  async waitForDOM() {
    return new Promise((resolve) => {
      // Check every 50ms for up to 2 seconds
      let attempts = 0;
      const maxAttempts = 40;

      const checkDOM = () => {
        attempts++;

        const storiesContainer = document.getElementById("stories-container");
        const mapContainer = document.getElementById("map-container");

        if (storiesContainer && mapContainer) {
          resolve();
        } else if (attempts >= maxAttempts) {
          console.warn("DOM containers tidak ditemukan setelah timeout");
          resolve();
        } else {
          setTimeout(checkDOM, 50);
        }
      };

      checkDOM();
    });
  }

  // Method untuk menampilkan error initialization
  showInitError() {
    const container = document.getElementById("stories-container");
    if (container) {
      container.innerHTML = `
        <div class="error-container" role="alert">
          <h3>Terjadi Kesalahan</h3>
          <p>Tidak dapat memuat halaman stories. Silakan refresh halaman.</p>
          <button onclick="window.location.reload()" class="retry-button btn btn-primary">
            Muat Ulang Halaman
          </button>
        </div>
      `;
    }
  }

  // PERBAIKAN: Cleanup method yang lebih robust
  destroy() {
    console.log(`Destroying StoriesPage[${this.instanceId}]...`);

    // Stop any ongoing initialization
    this.isInitializing = false;

    try {
      if (this.view && typeof this.view.destroy === "function") {
        this.view.destroy();
      }
    } catch (error) {
      console.warn("Error destroying view:", error);
    }

    // Clear references
    this.presenter = null;
    this.view = null;
    this.model = null;
    this.isInitialized = false;
  }
}
