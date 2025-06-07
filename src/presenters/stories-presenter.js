// src/presenters/stories-presenter.js
import authService from "../services/auth-service.js";

export class StoriesPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async loadStories() {
    try {
      console.log("Loading stories...");
      this.view.showLoading();

      // PERBAIKAN: Tambahkan delay kecil untuk memastikan UI ready
      await new Promise((resolve) => setTimeout(resolve, 100));

      const stories = await this.model.getAllStories();

      console.log("Stories loaded:", stories?.length || 0);

      if (!stories || stories.length === 0) {
        this.view.showEmpty();
      } else {
        this.view.renderStoriesList(stories);
      }
    } catch (error) {
      console.error("Error loading stories:", error);

      // PERBAIKAN: Error handling yang lebih sederhana
      let errorMessage = "Terjadi kesalahan saat memuat stories.";

      if (error.message === "SESSION_EXPIRED") {
        errorMessage = "Sesi Anda telah berakhir. Silakan login kembali.";
        setTimeout(() => {
          window.location.hash = "#/login";
        }, 2000);
      } else if (error.message === "STORIES_FAILED_TO_GET") {
        if (!authService.isLoggedIn()) {
          errorMessage = "Silakan login terlebih dahulu untuk melihat stories.";
        } else {
          errorMessage = "Gagal memuat stories. Periksa koneksi internet Anda.";
        }
      } else if (error.name === "TypeError") {
        errorMessage =
          "Tidak dapat terhubung ke server. Periksa koneksi internet.";
      }

      this.view.showError(errorMessage);
    }
  }

  setupRetryHandler() {
    // PERBAIKAN: Event delegation yang lebih aman
    document.addEventListener("click", (event) => {
      if (event.target && event.target.id === "retry-button") {
        event.preventDefault();
        console.log("Retry button clicked");
        this.loadStories();
      }
    });
  }
}
