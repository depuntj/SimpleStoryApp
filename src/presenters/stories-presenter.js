import authService from "../services/auth-service.js";

export class StoriesPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async loadStories() {
    try {
      this.view.showLoading();
      const stories = await this.model.getAllStories();

      if (stories.length === 0) {
        this.view.showEmpty();
      } else {
        this.view.renderStoriesList(stories);
      }
    } catch (error) {
      console.error("Error loading stories:", error);

      if (error.message === "SESSION_EXPIRED") {
        this.view.showError("Sesi Anda telah berakhir. Silakan login kembali.");
        setTimeout(() => {
          window.location.hash = "#/login";
        }, 2000);
      } else if (error.message === "STORIES_FAILED_TO_GET") {
        if (authService.isLoggedIn()) {
          this.view.showError(
            "Gagal memuat stories. Periksa koneksi internet Anda."
          );
        } else {
          this.view.showError(
            "Silakan login terlebih dahulu untuk melihat stories."
          );
          setTimeout(() => {
            window.location.hash = "#/login";
          }, 2000);
        }
      } else {
        this.view.showError(
          "Terjadi kesalahan saat memuat stories. Silakan coba lagi."
        );
      }
    }
  }

  setupRetryHandler() {
    document.addEventListener("click", (event) => {
      if (event.target.id === "retry-button") {
        this.loadStories();
      }
    });
  }
}
