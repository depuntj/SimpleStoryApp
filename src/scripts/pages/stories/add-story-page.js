import { AddStoryModel } from "../../../models/add-story-model.js";
import { AddStoryView } from "../../../views/add-story-view.js";
import { AddStoryPresenter } from "../../../presenters/add-story-presenter.js";
import authService from "../../../services/auth-service.js";

export default class AddStoryPage {
  constructor() {
    this.presenter = null;
    this.view = null;
    this.model = null;
    this.isInitialized = false;
  }

  async render() {
    this.view = new AddStoryView();
    return this.view.render();
  }

  async afterRender() {
    if (this.isInitialized) return;

    try {
      await this.waitForElements();

      this.model = new AddStoryModel();
      this.presenter = new AddStoryPresenter(this.model, this.view);

      await this.view.afterRender();
      this.setupPresenterCallbacks();

      this.isInitialized = true;

      console.log("AddStoryPage initialized successfully");
    } catch (error) {
      console.error("Error initializing add story page:", error);
      this.handleInitializationError(error);
    }
  }

  setupPresenterCallbacks() {
    // Setup communication antara presenter dan view
    this.view.onFormSubmissionRequested = (formData) => {
      return this.presenter.handleFormSubmission(formData);
    };

    this.view.onStepValidationRequested = (step, data) => {
      return this.presenter.validateStep(step, data);
    };

    this.view.onStepChangeRequested = (fromStep, toStep, data) => {
      return this.presenter.handleStepChange(fromStep, toStep, data);
    };

    this.view.onCancelRequested = () => {
      this.presenter.handleCancellation();
    };

    this.view.onRetryRequested = () => {
      this.presenter.handleRetrySubmission();
    };

    this.view.onDescriptionChanged = (description) => {
      this.presenter.handleDescriptionChange(description);
    };

    this.view.onPhotoChanged = (photo) => {
      this.presenter.handlePhotoChange(photo);
    };

    this.view.onLocationChanged = (location) => {
      this.presenter.handleLocationChange(location);
    };

    // Setup event handlers setelah callbacks terdaftar
    this.presenter.setupEventHandlers();
  }

  async waitForElements() {
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 50;

      const check = () => {
        attempts++;
        const form = document.getElementById("add-story-form");
        const container = document.querySelector(".add-story-container");

        if (form && container) {
          resolve();
        } else if (attempts >= maxAttempts) {
          console.warn("Add story elements not found after timeout");
          resolve();
        } else {
          setTimeout(check, 50);
        }
      };
      check();
    });
  }

  handleInitializationError(error) {
    // Tidak ada DOM manipulation langsung - delegate ke view jika tersedia
    if (this.view && typeof this.view.showInitializationError === "function") {
      this.view.showInitializationError(error.message);
    } else {
      // Fallback hanya jika view tidak tersedia
      this.showFallbackError();
    }
  }

  showFallbackError() {
    // Minimal DOM manipulation dengan accessibility
    const container = document.querySelector(".add-story-container");
    if (container) {
      container.innerHTML = `
        <div class="error-container" role="alert" aria-live="assertive">
          <div class="error-state">
            <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
            <h3>Terjadi Kesalahan</h3>
            <p>Tidak dapat memuat halaman tambah story. Silakan coba lagi.</p>
            <button onclick="window.location.reload()" 
                    class="btn-retry"
                    type="button"
                    aria-label="Muat ulang halaman">
              <i class="fas fa-redo" aria-hidden="true"></i>
              Muat Ulang
            </button>
          </div>
        </div>
      `;

      // Announce error to screen readers
      this.announceToScreenReader(
        "Terjadi kesalahan saat memuat halaman tambah story"
      );
    }
  }

  announceToScreenReader(message) {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.className = "sr-only";
    announcement.textContent = message;
    document.body.appendChild(announcement);

    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }

  // Authentication check method
  checkAuthenticationStatus() {
    if (!authService.isLoggedIn()) {
      console.log("User not authenticated, allowing guest mode for add story");
      if (this.presenter) {
        this.presenter.handleGuestMode();
      }
    } else {
      const user = authService.getCurrentUser();
      console.log("Authenticated user accessing add story:", user?.name);
    }
  }

  // Cleanup method
  destroy() {
    try {
      // Proper cleanup dengan error handling
      if (this.presenter && typeof this.presenter.cleanup === "function") {
        this.presenter.cleanup();
      }

      if (this.view && typeof this.view.destroy === "function") {
        this.view.destroy();
      }

      // Clear references
      this.presenter = null;
      this.view = null;
      this.model = null;
      this.isInitialized = false;

      console.log("AddStoryPage destroyed successfully");
    } catch (error) {
      console.warn("Error during AddStoryPage cleanup:", error);
    }
  }

  getCurrentFormState() {
    if (
      this.presenter &&
      typeof this.presenter.getCurrentStepData === "function"
    ) {
      return this.presenter.getCurrentStepData();
    }
    return null;
  }

  validateCurrentStep() {
    if (
      this.presenter &&
      typeof this.presenter.getValidationState === "function"
    ) {
      return this.presenter.getValidationState();
    }
    return { isValid: false };
  }
}
