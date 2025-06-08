import authService from "../services/auth-service.js";

export class AddStoryPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.isSubmitting = false;
  }

  setupEventHandlers() {
    this.checkAuthentication();
    this.setupFormSubmission();
    this.setupNavigationHandlers();
  }

  checkAuthentication() {
    if (!authService.isLoggedIn()) {
      console.log("User not logged in, but allowing guest mode for add story");
    }
  }

  setupFormSubmission() {
    const form = document.getElementById("add-story-form");
    const submitBtn = document.getElementById("submit-btn");

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        await this.handleSubmit();
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        await this.handleSubmit();
      });
    }
  }

  setupNavigationHandlers() {
    const backBtn = document.getElementById("back-btn");

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        this.handleCancel();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.handleCancel();
      }
    });
  }

  async handleSubmit() {
    if (this.isSubmitting) return;

    try {
      this.isSubmitting = true;
      this.view.showLoading();

      const formData = this.view.getFormData();

      if (!this.validateFormData(formData)) {
        return;
      }

      console.log("Submitting story with data:", {
        descriptionLength: formData.description?.length,
        hasPhoto: !!formData.photo,
        hasLocation: !!formData.location,
      });

      await this.model.submitStory(formData);

      this.view.showSuccess();
    } catch (error) {
      console.error("Error submitting story:", error);
      this.handleSubmitError(error);
    } finally {
      this.isSubmitting = false;
      this.view.hideLoading();
    }
  }

  validateFormData(data) {
    if (!data.description || data.description.trim().length < 10) {
      this.view.showError("Deskripsi harus minimal 10 karakter");
      return false;
    }

    if (!data.photo) {
      this.view.showError("Foto harus diambil terlebih dahulu");
      return false;
    }

    return true;
  }

  handleSubmitError(error) {
    let errorMessage = "Terjadi kesalahan saat mengirim story";

    if (error.message.includes("Sesi berakhir")) {
      errorMessage = "Sesi Anda telah berakhir. Silakan login kembali";
      setTimeout(() => {
        window.location.hash = "#/login";
      }, 2000);
    } else if (error.message.includes("Ukuran file")) {
      errorMessage = "Ukuran file terlalu besar. Maksimal 1MB";
    } else if (error.message.includes("Tipe file")) {
      errorMessage = "Tipe file tidak didukung. Gunakan JPEG, PNG, atau WebP";
    } else if (error.message) {
      errorMessage = error.message;
    }

    this.view.showError(errorMessage);
  }

  handleCancel() {
    if (this.view && typeof this.view.handleCancel === "function") {
      this.view.handleCancel();
    } else {
      window.location.hash = "#/";
    }
  }

  async retrySubmit() {
    await this.handleSubmit();
  }
}
