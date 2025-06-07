export class AddStoryPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  setupEventHandlers() {
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

      await this.model.addStoryAsGuest(
        formData.description,
        formData.photo,
        formData.lat,
        formData.lon
      );

      this.view.showSuccess();
    } catch (error) {
      console.error("Error adding story:", error);
      this.view.showError("Terjadi kesalahan saat mengirim story.");
    }
  }

  validateForm(formData) {
    if (!formData.description || formData.description.length < 10) {
      alert("Deskripsi harus minimal 10 karakter.");
      return false;
    }

    if (!formData.photo) {
      alert("Foto harus diambil terlebih dahulu.");
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
