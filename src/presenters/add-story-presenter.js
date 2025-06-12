import authService from "../services/auth-service.js";

export class AddStoryPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.isSubmitting = false;
    this.currentStepData = {
      description: "",
      photo: null,
      location: null,
    };
  }

  setupEventHandlers() {
    this.checkAuthenticationStatus();
    this.setupViewEventHandlers();
  }

  checkAuthenticationStatus() {
    if (!authService.isLoggedIn()) {
      console.log("User not authenticated, allowing guest mode");
      this.view.showGuestModeInfo();
    } else {
      const user = authService.getCurrentUser();
      this.view.showAuthenticatedUserInfo(user);
    }
  }

  setupViewEventHandlers() {
    this.view.onFormSubmissionRequested((formData) => {
      this.handleFormSubmission(formData);
    });

    this.view.onStepValidationRequested((step, data) => {
      return this.validateStep(step, data);
    });

    this.view.onStepChangeRequested((fromStep, toStep, data) => {
      return this.handleStepChange(fromStep, toStep, data);
    });

    this.view.onCancelRequested(() => {
      this.handleCancellation();
    });

    this.view.onRetryRequested(() => {
      this.handleRetrySubmission();
    });

    this.view.onDescriptionChanged((description) => {
      this.handleDescriptionChange(description);
    });

    this.view.onPhotoChanged((photo) => {
      this.handlePhotoChange(photo);
    });

    this.view.onLocationChanged((location) => {
      this.handleLocationChange(location);
    });
  }

  async handleFormSubmission(formData) {
    if (this.isSubmitting) {
      console.log("Form submission already in progress");
      return;
    }

    try {
      this.isSubmitting = true;
      this.view.setSubmissionState(true);

      const validationResult = this.validateCompleteForm(formData);
      if (!validationResult.isValid) {
        this.view.showValidationErrors(validationResult.errors);
        return;
      }

      console.log("Submitting story with validated data:", {
        descriptionLength: formData.description?.length,
        hasPhoto: !!formData.photo,
        hasLocation: !!formData.location,
        isAuthenticated: authService.isLoggedIn(),
      });

      const result = await this.model.submitStory(formData);

      this.handleSubmissionSuccess(result);
    } catch (error) {
      console.error("Error in form submission:", error);
      this.handleSubmissionError(error);
    } finally {
      this.isSubmitting = false;
      this.view.setSubmissionState(false);
    }
  }

  validateStep(step, data) {
    switch (step) {
      case 1:
        return this.validateDescriptionStep(data.description);
      case 2:
        return this.validatePhotoStep(data.photo);
      case 3:
        return this.validateLocationStep(data.location);
      default:
        return { isValid: false, message: "Invalid step number" };
    }
  }

  validateDescriptionStep(description) {
    if (!description || typeof description !== "string") {
      return {
        isValid: false,
        message: "Deskripsi harus diisi",
      };
    }

    const trimmedDescription = description.trim();

    if (trimmedDescription.length < 10) {
      return {
        isValid: false,
        message: "Deskripsi harus minimal 10 karakter",
      };
    }

    if (trimmedDescription.length > 500) {
      return {
        isValid: false,
        message: "Deskripsi maksimal 500 karakter",
      };
    }

    return { isValid: true };
  }

  validatePhotoStep(photo) {
    if (!photo) {
      return {
        isValid: false,
        message: "Foto harus diambil terlebih dahulu",
      };
    }

    if (!(photo instanceof File || photo instanceof Blob)) {
      return {
        isValid: false,
        message: "Format foto tidak valid",
      };
    }

    if (photo.size > 1024 * 1024) {
      return {
        isValid: false,
        message: "Ukuran file terlalu besar. Maksimal 1MB",
      };
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(photo.type)) {
      return {
        isValid: false,
        message: "Tipe file tidak didukung. Gunakan JPEG, PNG, atau WebP",
      };
    }

    return { isValid: true };
  }

  validateLocationStep(location) {
    if (!location) {
      return { isValid: true };
    }

    if (typeof location !== "object" || !location.lat || !location.lng) {
      return {
        isValid: false,
        message: "Data lokasi tidak valid",
      };
    }

    const lat = parseFloat(location.lat);
    const lng = parseFloat(location.lng);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      return {
        isValid: false,
        message: "Latitude tidak valid",
      };
    }

    if (isNaN(lng) || lng < -180 || lng > 180) {
      return {
        isValid: false,
        message: "Longitude tidak valid",
      };
    }

    return { isValid: true };
  }

  validateCompleteForm(formData) {
    const errors = [];

    const descValidation = this.validateDescriptionStep(formData.description);
    if (!descValidation.isValid) {
      errors.push(descValidation.message);
    }

    const photoValidation = this.validatePhotoStep(formData.photo);
    if (!photoValidation.isValid) {
      errors.push(photoValidation.message);
    }

    const locationValidation = this.validateLocationStep(formData.location);
    if (!locationValidation.isValid) {
      errors.push(locationValidation.message);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  handleStepChange(fromStep, toStep, data) {
    this.currentStepData = { ...this.currentStepData, ...data };

    const validation = this.validateStep(fromStep, data);
    if (!validation.isValid) {
      this.view.showStepValidationError(validation.message);
      return false;
    }

    this.view.clearValidationErrors();

    const progress = this.calculateProgress();
    this.view.updateProgress(progress);

    console.log(`Step changed from ${fromStep} to ${toStep}:`, {
      validation: validation.isValid,
      progress,
      currentData: this.currentStepData,
    });

    return true;
  }

  calculateProgress() {
    let progress = 0;

    if (
      this.currentStepData.description &&
      this.currentStepData.description.trim().length >= 10
    ) {
      progress += 40;
    }

    if (this.currentStepData.photo) {
      progress += 40;
    }

    if (this.currentStepData.location) {
      progress += 20;
    }

    return Math.min(progress, 100);
  }

  handleDescriptionChange(description) {
    this.currentStepData.description = description;

    const validation = this.validateDescriptionStep(description);
    this.view.updateDescriptionValidation(validation);

    const progress = this.calculateProgress();
    this.view.updateProgress(progress);
  }

  handlePhotoChange(photo) {
    this.currentStepData.photo = photo;

    const validation = this.validatePhotoStep(photo);
    this.view.updatePhotoValidation(validation);

    const progress = this.calculateProgress();
    this.view.updateProgress(progress);
  }

  handleLocationChange(location) {
    this.currentStepData.location = location;

    const validation = this.validateLocationStep(location);
    this.view.updateLocationValidation(validation);

    const progress = this.calculateProgress();
    this.view.updateProgress(progress);
  }

  handleCancellation() {
    const hasUnsavedData = this.hasUnsavedData();

    if (hasUnsavedData) {
      this.view.showCancellationConfirmation(() => {
        this.performCancellation();
      });
    } else {
      this.performCancellation();
    }
  }

  hasUnsavedData() {
    return !!(
      (this.currentStepData.description &&
        this.currentStepData.description.trim()) ||
      this.currentStepData.photo ||
      this.currentStepData.location
    );
  }

  performCancellation() {
    this.currentStepData = {
      description: "",
      photo: null,
      location: null,
    };

    this.view.resetForm();
    this.navigateToHome();
  }

  navigateToHome() {
    window.location.hash = "#/";
  }

  async handleRetrySubmission() {
    const currentFormData = this.view.getCurrentFormData();
    await this.handleFormSubmission(currentFormData);
  }

  handleSubmissionSuccess(result) {
    console.log("Story submission successful:", result);

    this.view.showSubmissionSuccess();

    this.currentStepData = {
      description: "",
      photo: null,
      location: null,
    };

    setTimeout(() => {
      this.navigateToHome();
    }, 2000);
  }

  handleSubmissionError(error) {
    console.error("Story submission failed:", error);

    let errorMessage = "Terjadi kesalahan saat mengirim story";
    let shouldRedirectToLogin = false;

    if (
      error.message.includes("SESSION_EXPIRED") ||
      error.message.includes("Sesi berakhir")
    ) {
      errorMessage = "Sesi Anda telah berakhir. Silakan login kembali";
      shouldRedirectToLogin = true;
    } else if (
      error.message.includes("FILE_TOO_LARGE") ||
      error.message.includes("Ukuran file")
    ) {
      errorMessage = "Ukuran file terlalu besar. Maksimal 1MB";
    } else if (
      error.message.includes("INVALID_FILE_TYPE") ||
      error.message.includes("Tipe file")
    ) {
      errorMessage = "Tipe file tidak didukung. Gunakan JPEG, PNG, atau WebP";
    } else if (error.message.includes("DESCRIPTION_TOO_SHORT")) {
      errorMessage = "Deskripsi harus minimal 10 karakter";
    } else if (error.message.includes("PHOTO_REQUIRED")) {
      errorMessage = "Foto harus diambil terlebih dahulu";
    } else if (error.message.includes("NETWORK_ERROR")) {
      errorMessage =
        "Tidak dapat terhubung ke server. Periksa koneksi internet";
    } else if (error.message) {
      errorMessage = error.message;
    }

    this.view.showSubmissionError(errorMessage);

    if (shouldRedirectToLogin) {
      setTimeout(() => {
        window.location.hash = "#/login";
      }, 3000);
    }
  }

  handleCameraError(error) {
    console.error("Camera error:", error);

    let errorMessage = "Tidak dapat mengakses kamera";

    if (error.name === "NotAllowedError") {
      errorMessage =
        "Akses kamera ditolak. Periksa pengaturan browser dan berikan izin kamera.";
    } else if (error.name === "NotFoundError") {
      errorMessage = "Kamera tidak ditemukan pada perangkat ini.";
    } else if (error.name === "NotSupportedError") {
      errorMessage = "Browser tidak mendukung akses kamera.";
    } else if (error.name === "NotReadableError") {
      errorMessage = "Kamera sedang digunakan oleh aplikasi lain.";
    }

    this.view.showCameraError(errorMessage);
  }

  handleLocationError(error) {
    console.error("Location error:", error);

    let errorMessage = "Tidak dapat mendeteksi lokasi";

    if (error.code === error.PERMISSION_DENIED) {
      errorMessage =
        "Akses lokasi ditolak. Periksa pengaturan browser dan berikan izin lokasi.";
    } else if (error.code === error.POSITION_UNAVAILABLE) {
      errorMessage = "Informasi lokasi tidak tersedia saat ini.";
    } else if (error.code === error.TIMEOUT) {
      errorMessage = "Timeout saat mendeteksi lokasi. Silakan coba lagi.";
    }

    this.view.showLocationError(errorMessage);
  }

  getCurrentProgress() {
    return this.calculateProgress();
  }

  getCurrentStepData() {
    return { ...this.currentStepData };
  }

  getValidationState() {
    return {
      description: this.validateDescriptionStep(
        this.currentStepData.description
      ),
      photo: this.validatePhotoStep(this.currentStepData.photo),
      location: this.validateLocationStep(this.currentStepData.location),
    };
  }
}
