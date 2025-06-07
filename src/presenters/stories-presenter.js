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
      this.view.showError(
        "Gagal memuat stories. Periksa koneksi internet Anda."
      );
      console.error("Error loading stories:", error);
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
