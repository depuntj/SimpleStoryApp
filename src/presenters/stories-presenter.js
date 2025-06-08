import authService from "../services/auth-service.js";

export class StoriesPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.retryAttempts = 0;
    this.maxRetryAttempts = 3;
  }

  setupEventHandlers() {
    this.setupRetryHandler();
    this.setupRefreshHandler();
  }

  async loadStories() {
    try {
      this.view.showLoading();
      this.retryAttempts = 0;

      await new Promise((resolve) => setTimeout(resolve, 100));

      const stories = await this.model.getAllStories();

      if (!stories || stories.length === 0) {
        this.view.showEmptyState();
      } else {
        this.view.renderStoriesList(stories);
      }
    } catch (error) {
      console.error("Error loading stories:", error);
      this.handleLoadError(error);
    }
  }

  handleLoadError(error) {
    let errorMessage = "Terjadi kesalahan saat memuat stories.";

    switch (error.message) {
      case "SESSION_EXPIRED":
        errorMessage = "Sesi Anda telah berakhir. Silakan login kembali.";
        setTimeout(() => {
          window.location.hash = "#/login";
        }, 2000);
        break;

      case "STORIES_FAILED_TO_GET":
        if (!authService.isLoggedIn()) {
          errorMessage = "Silakan login terlebih dahulu untuk melihat stories.";
        } else {
          errorMessage = "Gagal memuat stories. Periksa koneksi internet Anda.";
        }
        break;

      case "NETWORK_ERROR":
        errorMessage =
          "Tidak dapat terhubung ke server. Periksa koneksi internet.";
        break;

      default:
        if (error.name === "TypeError") {
          errorMessage =
            "Tidak dapat terhubung ke server. Periksa koneksi internet.";
        }
        break;
    }

    this.view.showError(errorMessage);
  }

  async retryLoadStories() {
    if (this.retryAttempts < this.maxRetryAttempts) {
      this.retryAttempts++;
      await this.loadStories();
    } else {
      this.view.showError(
        "Gagal memuat stories setelah beberapa percobaan. Silakan refresh halaman."
      );
    }
  }

  setupRetryHandler() {
    document.addEventListener("click", (event) => {
      if (
        event.target &&
        (event.target.classList.contains("btn-retry") ||
          event.target.closest(".btn-retry"))
      ) {
        event.preventDefault();
        this.retryLoadStories();
      }
    });
  }

  setupRefreshHandler() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "F5" || (event.ctrlKey && event.key === "r")) {
        event.preventDefault();
        this.loadStories();
      }
    });
  }

  async refreshStories() {
    try {
      const stories = await this.model.getAllStories();
      this.view.renderStoriesList(stories);

      if (typeof window.showToast === "function") {
        window.showToast("Stories berhasil diperbarui", "success");
      }
    } catch (error) {
      console.error("Error refreshing stories:", error);
      if (typeof window.showToast === "function") {
        window.showToast("Gagal memperbarui stories", "error");
      }
    }
  }

  async searchStories(query) {
    try {
      const stories = this.model.searchStories(query);
      this.view.renderStoriesList(stories);
    } catch (error) {
      console.error("Error searching stories:", error);
      this.view.showError("Gagal mencari stories");
    }
  }

  getStoriesStats() {
    return {
      total: this.model.getStoriesCount(),
      withLocation: this.model.getStoriesWithLocationCount(),
      uniqueAuthors: this.model.getUniqueAuthorsCount(),
    };
  }
}
