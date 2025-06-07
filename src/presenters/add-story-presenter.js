import authService from "../services/auth-service.js";

export class AddStoryPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  setupEventHandlers() {
    // Check if user is authenticated
    if (!authService.isLoggedIn()) {
      window.location.hash = "#/login";
      return;
    }

    const form = document.getElementById("add-story-form");
    const cancelButton = document.getElementById("cancel-button");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      await this.handleSubmit();
    });

    cancelButton.addEventListener("click", () => {
      this.handleCancel();
    });

    this.view.setupFormValidation();
  }

  async handleSubmit() {
    const formData = this.view.getFormData();

    if (!this.validateForm(formData)) {
      return;
    }

    try {
      this.view.showLoading();

      // Use authenticated endpoint if user is logged in, otherwise use guest
      if (authService.isLoggedIn()) {
        await this.model.addStory(
          formData.description,
          formData.photo,
          formData.lat,
          formData.lon
        );
      } else {
        await this.model.addStoryAsGuest(
          formData.description,
          formData.photo,
          formData.lat,
          formData.lon
        );
      }

      this.view.showSuccess();
    } catch (error) {
      console.error("Error adding story:", error);

      if (
        error.message === "SESSION_EXPIRED" ||
        error.message === "AUTHENTICATION_REQUIRED"
      ) {
        this.view.showError("Sesi Anda telah berakhir. Silakan login kembali.");
        setTimeout(() => {
          window.location.hash = "#/login";
        }, 2000);
      } else {
        this.view.showError(
          "Terjadi kesalahan saat mengirim story. Silakan coba lagi."
        );
      }
    }
  }

  validateForm(formData) {
    if (!formData.description || formData.description.length < 10) {
      this.view.showError("Deskripsi harus minimal 10 karakter.");
      return false;
    }

    if (!formData.photo) {
      this.view.showError("Foto harus diambil terlebih dahulu.");
      return false;
    }

    return true;
  }

  handleCancel() {
    const confirmed = confirm(
      "Yakin ingin membatalkan? Data yang sudah diisi akan hilang."
    );
    if (confirmed) {
      this.view.cleanup();
      window.location.hash = "#/";
    }
  }
}
