import CONFIG from "../scripts/config.js";

export class AddStoryView {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 3;
    this.cameraStream = null;
    this.map = null;
    this.selectedLocation = null;
    this.capturedPhoto = null;
    this.mapMarker = null;

    this.onFormSubmissionRequested = null;
    this.onCancelRequested = null;
  }

  render() {
    return `
      <main class="add-story-page" role="main">
        <div class="add-story-container">
          <header class="story-header">
            <h1><i class="fas fa-plus-circle"></i> Buat Story Baru</h1>
            <p>Bagikan momen spesial Anda dengan komunitas Dicoding</p>
          </header>

          <form id="add-story-form" class="story-form">
            <section class="form-step active" data-step="1">
              <div class="step-content">
                <h2>Ceritakan Pengalaman Anda</h2>
                <div class="form-group">
                  <label for="story-description">Deskripsi Story *</label>
                  <textarea 
                    id="story-description" 
                    class="form-textarea"
                    placeholder="Ceritakan tentang momen ini..."
                    maxlength="500"
                    required></textarea>
                  <div class="textarea-footer">
                    <small>Minimal 10 karakter</small>
                    <span id="desc-counter">0/500</span>
                  </div>
                </div>
              </div>
            </section>

            <section class="form-step" data-step="2">
              <div class="step-content">
                <h2>Ambil Foto dengan Kamera</h2>
                <div class="camera-container">
                  <div class="camera-viewport" id="camera-viewport">
                    <video id="camera-video" class="camera-preview" autoplay playsinline muted style="display: none;"></video>
                    <div id="camera-placeholder" class="camera-placeholder">
                      <i class="fas fa-video"></i>
                      <h3>Siap Mengambil Foto?</h3>
                      <button type="button" id="start-camera-btn" class="camera-button btn-camera-primary">
                        <i class="fas fa-play"></i> Aktifkan Kamera
                      </button>
                    </div>
                    <div id="photo-preview" class="photo-preview" style="display: none;">
                      <img id="captured-image" alt="Foto yang diambil">
                      <button type="button" id="retake-btn" class="camera-button btn-camera-secondary">
                        <i class="fas fa-redo"></i> Ambil Ulang
                      </button>
                    </div>
                  </div>
                  <div class="camera-controls" id="camera-controls" style="display: none;">
                    <button type="button" id="capture-btn" class="camera-button btn-camera-capture">
                      <i class="fas fa-camera"></i> Ambil Foto
                    </button>
                    <button type="button" id="stop-camera-btn" class="camera-button btn-camera-secondary">
                      <i class="fas fa-stop"></i> Batal
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section class="form-step" data-step="3">
              <div class="step-content">
                <h2>Tandai Lokasi (Opsional)</h2>
                <div class="map-container">
                  <div id="location-map" class="location-map"></div>
                  <div class="map-overlay">
                    <button type="button" id="detect-location-btn" class="map-control-btn">
                      <i class="fas fa-crosshairs"></i> Deteksi Lokasi
                    </button>
                    <button type="button" id="clear-location-btn" class="map-control-btn btn-danger" style="display: none;">
                      <i class="fas fa-times"></i> Hapus
                    </button>
                  </div>
                </div>
                <div id="location-display">
                  <div class="location-status">
                    <i class="fas fa-map-pin"></i>
                    <div>
                      <h4>Belum ada lokasi dipilih</h4>
                      <p>Klik pada peta atau gunakan deteksi otomatis</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <footer class="form-navigation">
              <div class="nav-buttons">
                <button type="button" id="prev-btn" class="nav-button btn-secondary" style="display: none;">
                  <i class="fas fa-arrow-left"></i> Sebelumnya
                </button>
                <button type="button" id="next-btn" class="nav-button btn-primary" disabled>
                  Selanjutnya <i class="fas fa-arrow-right"></i>
                </button>
                <button type="submit" id="submit-btn" class="nav-button btn-submit" style="display: none;">
                  <i class="fas fa-share"></i> Bagikan Story
                </button>
              </div>
              <button type="button" id="cancel-btn" class="cancel-button">
                <i class="fas fa-times"></i> Batalkan
              </button>
            </footer>
          </form>
        </div>
      </main>
    `;
  }

  async afterRender() {
    this.setupNavigation();
    this.setupFormValidation();
    this.setupFormSubmission();
    await this.initializeCurrentStep();
  }

  setupNavigation() {
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");
    const cancelBtn = document.getElementById("cancel-btn");

    nextBtn?.addEventListener("click", () => this.nextStep());
    prevBtn?.addEventListener("click", () => this.prevStep());
    cancelBtn?.addEventListener("click", () => {
      if (this.onCancelRequested) this.onCancelRequested();
    });
  }

  setupFormValidation() {
    const textarea = document.getElementById("story-description");
    const counter = document.getElementById("desc-counter");

    if (textarea && counter) {
      textarea.addEventListener("input", () => {
        const length = textarea.value.length;
        counter.textContent = `${length}/500`;
        this.updateNavigationState();
      });
    }
  }

  setupFormSubmission() {
    const form = document.getElementById("add-story-form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (this.onFormSubmissionRequested) {
          const formData = this.getCurrentFormData();
          await this.onFormSubmissionRequested(formData);
        }
      });
    }
  }

  async nextStep() {
    if (this.currentStep < this.totalSteps && this.validateCurrentStep()) {
      this.currentStep++;
      await this.updateStepDisplay();
      await this.initializeCurrentStep();
    }
  }

  async prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      await this.updateStepDisplay();
      await this.initializeCurrentStep();
    }
  }

  validateCurrentStep() {
    switch (this.currentStep) {
      case 1:
        const textarea = document.getElementById("story-description");
        return textarea?.value.trim().length >= 10;
      case 2:
        return !!this.capturedPhoto;
      case 3:
        return true;
      default:
        return false;
    }
  }

  async updateStepDisplay() {
    document.querySelectorAll(".form-step").forEach((step, index) => {
      step.classList.toggle("active", index === this.currentStep - 1);
    });
    this.updateNavigationState();
  }

  updateNavigationState() {
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");
    const submitBtn = document.getElementById("submit-btn");

    if (prevBtn) {
      prevBtn.style.display = this.currentStep > 1 ? "flex" : "none";
    }

    if (this.currentStep === this.totalSteps) {
      if (nextBtn) nextBtn.style.display = "none";
      if (submitBtn) submitBtn.style.display = "flex";
    } else {
      if (nextBtn) {
        nextBtn.style.display = "flex";
        nextBtn.disabled = !this.validateCurrentStep();
      }
      if (submitBtn) submitBtn.style.display = "none";
    }
  }

  async initializeCurrentStep() {
    switch (this.currentStep) {
      case 1:
        setTimeout(() => {
          const textarea = document.getElementById("story-description");
          if (textarea) textarea.focus();
        }, 100);
        break;
      case 2:
        await this.initializeCamera();
        break;
      case 3:
        await this.initializeMap();
        break;
    }
    this.updateNavigationState();
  }

  async initializeCamera() {
    const startBtn = document.getElementById("start-camera-btn");
    const captureBtn = document.getElementById("capture-btn");
    const retakeBtn = document.getElementById("retake-btn");
    const stopBtn = document.getElementById("stop-camera-btn");

    startBtn?.addEventListener("click", () => this.startCamera());
    captureBtn?.addEventListener("click", () => this.capturePhoto());
    retakeBtn?.addEventListener("click", () => this.retakePhoto());
    stopBtn?.addEventListener("click", () => this.stopCamera());
  }

  async startCamera() {
    try {
      const video = document.getElementById("camera-video");
      const placeholder = document.getElementById("camera-placeholder");
      const controls = document.getElementById("camera-controls");

      this.cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: "environment" },
      });

      video.srcObject = this.cameraStream;
      placeholder.style.display = "none";
      video.style.display = "block";
      controls.style.display = "flex";
    } catch (error) {
      this.showError("Tidak dapat mengakses kamera");
    }
  }

  capturePhoto() {
    const video = document.getElementById("camera-video");
    const canvas = document.createElement("canvas");
    const preview = document.getElementById("photo-preview");
    const capturedImage = document.getElementById("captured-image");
    const controls = document.getElementById("camera-controls");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        this.capturedPhoto = blob;
        capturedImage.src = URL.createObjectURL(blob);
        video.style.display = "none";
        controls.style.display = "none";
        preview.style.display = "block";
        this.stopCamera();
        this.updateNavigationState();
      },
      "image/jpeg",
      0.8
    );
  }

  retakePhoto() {
    this.capturedPhoto = null;
    document.getElementById("photo-preview").style.display = "none";
    document.getElementById("camera-placeholder").style.display = "flex";
    this.updateNavigationState();
  }

  stopCamera() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach((track) => track.stop());
      this.cameraStream = null;
    }
  }

  async initializeMap() {
    if (typeof L === "undefined") return;

    this.map = L.map("location-map").setView([-6.2088, 106.8456], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      this.map
    );

    this.map.on("click", (e) => {
      this.selectedLocation = { lat: e.latlng.lat, lng: e.latlng.lng };
      if (this.mapMarker) this.map.removeLayer(this.mapMarker);
      this.mapMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map);
      this.updateLocationDisplay();
    });

    document
      .getElementById("detect-location-btn")
      ?.addEventListener("click", () => {
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.selectedLocation = { lat, lng };
          this.map.setView([lat, lng], 15);
          if (this.mapMarker) this.map.removeLayer(this.mapMarker);
          this.mapMarker = L.marker([lat, lng]).addTo(this.map);
          this.updateLocationDisplay();
        });
      });

    document
      .getElementById("clear-location-btn")
      ?.addEventListener("click", () => {
        this.selectedLocation = null;
        if (this.mapMarker) {
          this.map.removeLayer(this.mapMarker);
          this.mapMarker = null;
        }
        this.updateLocationDisplay();
      });

    setTimeout(() => this.map.invalidateSize(), 300);
  }

  updateLocationDisplay() {
    const display = document.getElementById("location-display");
    const clearBtn = document.getElementById("clear-location-btn");

    if (this.selectedLocation) {
      display.innerHTML = `
        <div class="location-status selected">
          <i class="fas fa-map-pin"></i>
          <div>
            <h4>Lokasi dipilih</h4>
            <p>${this.selectedLocation.lat.toFixed(
              6
            )}, ${this.selectedLocation.lng.toFixed(6)}</p>
          </div>
        </div>
      `;
      if (clearBtn) clearBtn.style.display = "flex";
    } else {
      display.innerHTML = `
        <div class="location-status">
          <i class="fas fa-map-pin"></i>
          <div>
            <h4>Belum ada lokasi dipilih</h4>
            <p>Klik pada peta atau gunakan deteksi otomatis</p>
          </div>
        </div>
      `;
      if (clearBtn) clearBtn.style.display = "none";
    }
  }

  getCurrentFormData() {
    return {
      description: document.getElementById("story-description")?.value.trim(),
      photo: this.capturedPhoto,
      location: this.selectedLocation,
    };
  }

  showError(message) {
    if (window.showToast) {
      window.showToast(message, "error");
    }
  }

  showLoading() {
    const submitBtn = document.getElementById("submit-btn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    }
  }

  hideLoading() {
    const submitBtn = document.getElementById("submit-btn");
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-share"></i> Bagikan Story';
    }
  }

  navigateToHome() {
    window.location.hash = "#/";
  }

  navigateToLogin() {
    window.location.hash = "#/login";
  }

  showSubmissionSuccess() {
    if (window.showToast) {
      window.showToast("Story berhasil dibagikan!", "success");
    }
  }

  showSubmissionError(message) {
    if (window.showToast) {
      window.showToast(message, "error");
    }
  }

  cleanup() {
    this.stopCamera();
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}
