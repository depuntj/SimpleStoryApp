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
  }

  render() {
    return `
      <div class="add-story-page">
        <div class="add-story-header">
          <div class="container">
            <div class="header-content">
              <button class="back-btn" id="back-btn" aria-label="Kembali">
                <i class="fas fa-arrow-left"></i>
              </button>
              <h1>Buat Story Baru</h1>
              <div class="step-indicator">
                <span class="current-step">${this.currentStep}</span>
                <span class="total-steps">/${this.totalSteps}</span>
              </div>
            </div>
            
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${
                (this.currentStep / this.totalSteps) * 100
              }%"></div>
            </div>
          </div>
        </div>

        <div class="add-story-container">
          <div class="container">
            <form id="add-story-form" class="story-form">
              
              <!-- Step 1: Description -->
              <div class="form-step ${
                this.currentStep === 1 ? "active" : ""
              }" data-step="1">
                <div class="step-content">
                  <div class="step-header">
                    <div class="step-icon">
                      <i class="fas fa-edit"></i>
                    </div>
                    <h2>Ceritakan Pengalaman Anda</h2>
                    <p>Tulis deskripsi menarik tentang foto yang akan Anda bagikan</p>
                  </div>

                  <div class="form-group">
                    <label for="story-description" class="form-label">
                      Deskripsi Story
                    </label>
                    <div class="textarea-wrapper">
                      <textarea 
                        id="story-description" 
                        name="description"
                        class="form-textarea"
                        placeholder="Ceritakan tentang momen ini... Apa yang membuatnya spesial?"
                        maxlength="${CONFIG.VALIDATION.MAX_DESCRIPTION_LENGTH}"
                        required
                        aria-describedby="desc-help desc-counter"
                      ></textarea>
                      <div class="textarea-footer">
                        <small id="desc-help" class="form-help">
                          Minimal ${
                            CONFIG.VALIDATION.MIN_DESCRIPTION_LENGTH
                          } karakter
                        </small>
                        <span id="desc-counter" class="char-counter">
                          0/${CONFIG.VALIDATION.MAX_DESCRIPTION_LENGTH}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="form-tips">
                    <h3>💡 Tips menulis deskripsi yang menarik:</h3>
                    <ul>
                      <li>Ceritakan konteks dan suasana saat foto diambil</li>
                      <li>Bagikan pelajaran atau insight yang didapat</li>
                      <li>Gunakan bahasa yang personal dan autentik</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Step 2: Camera -->
              <div class="form-step ${
                this.currentStep === 2 ? "active" : ""
              }" data-step="2">
                <div class="step-content">
                  <div class="step-header">
                    <div class="step-icon">
                      <i class="fas fa-camera"></i>
                    </div>
                    <h2>Ambil Foto dengan Kamera</h2>
                    <p>Gunakan kamera perangkat untuk mengambil foto story Anda</p>
                  </div>

                  <div class="camera-container">
                    <div class="camera-viewport" id="camera-viewport">
                      <video id="camera-video" class="camera-video" autoplay playsinline muted></video>
                      <canvas id="photo-canvas" class="photo-canvas" style="display: none;"></canvas>
                      
                      <div id="camera-placeholder" class="camera-placeholder">
                        <div class="placeholder-content">
                          <i class="fas fa-camera"></i>
                          <h3>Siap Mengambil Foto?</h3>
                          <p>Pastikan pencahayaan cukup dan objek terlihat jelas</p>
                          <button type="button" id="start-camera-btn" class="btn-camera-action">
                            <i class="fas fa-video"></i>
                            Aktifkan Kamera
                          </button>
                        </div>
                      </div>

                      <div id="photo-preview" class="photo-preview" style="display: none;">
                        <img id="captured-image" alt="Foto yang diambil">
                        <div class="photo-overlay">
                          <div class="photo-actions">
                            <button type="button" id="retake-btn" class="btn-photo-action">
                              <i class="fas fa-redo"></i>
                              Ambil Ulang
                            </button>
                          </div>
                        </div>
                      </div>

                      <div class="camera-overlay" id="camera-overlay" style="display: none;">
                        <div class="camera-controls">
                          <button type="button" id="capture-btn" class="btn-capture">
                            <div class="capture-ring">
                              <div class="capture-inner"></div>
                            </div>
                          </button>
                        </div>
                        
                        <div class="camera-info">
                          <div class="camera-tip">
                            <i class="fas fa-lightbulb"></i>
                            <span>Tahan kamera dengan stabil</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="camera-tips">
                      <h3>📸 Tips foto yang bagus:</h3>
                      <div class="tips-grid">
                        <div class="tip-item">
                          <i class="fas fa-sun"></i>
                          <span>Cari pencahayaan yang baik</span>
                        </div>
                        <div class="tip-item">
                          <i class="fas fa-hand-paper"></i>
                          <span>Pegang kamera dengan stabil</span>
                        </div>
                        <div class="tip-item">
                          <i class="fas fa-eye"></i>
                          <span>Fokus pada objek utama</span>
                        </div>
                        <div class="tip-item">
                          <i class="fas fa-mobile-alt"></i>
                          <span>Posisikan dengan baik</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 3: Location -->
              <div class="form-step ${
                this.currentStep === 3 ? "active" : ""
              }" data-step="3">
                <div class="step-content">
                  <div class="step-header">
                    <div class="step-icon">
                      <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <h2>Tandai Lokasi (Opsional)</h2>
                    <p>Tambahkan informasi lokasi untuk memberikan konteks pada story</p>
                  </div>

                  <div class="location-container">
                    <div class="map-wrapper">
                      <div id="location-map" class="location-map"></div>
                      
                      <div class="map-controls">
                        <button type="button" id="detect-location-btn" class="btn-map-control">
                          <i class="fas fa-crosshairs"></i>
                          Deteksi Lokasi Saya
                        </button>
                        <button type="button" id="clear-location-btn" class="btn-map-control secondary" style="display: none;">
                          <i class="fas fa-times"></i>
                          Hapus Lokasi
                        </button>
                      </div>
                    </div>

                    <div class="location-info">
                      <div class="location-display" id="location-display">
                        <div class="location-placeholder">
                          <i class="fas fa-map-pin"></i>
                          <div class="location-text">
                            <p>Belum ada lokasi dipilih</p>
                            <small>Klik pada peta atau gunakan deteksi otomatis</small>
                          </div>
                        </div>
                      </div>

                      <div class="location-notes">
                        <h4>ℹ️ Tentang Lokasi:</h4>
                        <ul>
                          <li>Lokasi bersifat opsional dan dapat dilewati</li>
                          <li>Membantu komunitas menemukan tempat menarik</li>
                          <li>Data lokasi akan ditampilkan di peta stories</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Navigation -->
              <div class="form-navigation">
                <button type="button" id="prev-btn" class="btn-nav secondary" style="display: none;">
                  <i class="fas fa-arrow-left"></i>
                  Sebelumnya
                </button>

                <div class="nav-center">
                  <div class="step-dots">
                    ${Array.from(
                      { length: this.totalSteps },
                      (_, i) =>
                        `<div class="step-dot ${
                          i < this.currentStep ? "completed" : ""
                        } ${i === this.currentStep - 1 ? "active" : ""}"></div>`
                    ).join("")}
                  </div>
                </div>

                <button type="button" id="next-btn" class="btn-nav primary" disabled>
                  <span class="btn-text">
                    Selanjutnya
                    <i class="fas fa-arrow-right"></i>
                  </span>
                </button>

                <button type="submit" id="submit-btn" class="btn-nav submit" style="display: none;">
                  <span class="btn-text">
                    <i class="fas fa-share"></i>
                    Bagikan Story
                  </span>
                  <span class="btn-loading" style="display: none;">
                    <i class="fas fa-spinner fa-spin"></i>
                    Mengirim...
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  async afterRender() {
    this.setupStepNavigation();
    this.setupFormValidation();
    this.setupAccessibility();
    await this.initializeCurrentStep();
  }

  setupStepNavigation() {
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");
    const backBtn = document.getElementById("back-btn");

    nextBtn.addEventListener("click", () => this.nextStep());
    prevBtn.addEventListener("click", () => this.prevStep());

    backBtn.addEventListener("click", () => {
      if (this.currentStep > 1) {
        this.prevStep();
      } else {
        this.handleCancel();
      }
    });
  }

  setupFormValidation() {
    const textarea = document.getElementById("story-description");
    const counter = document.getElementById("desc-counter");

    if (textarea && counter) {
      textarea.addEventListener("input", () => {
        const length = textarea.value.length;
        counter.textContent = `${length}/${CONFIG.VALIDATION.MAX_DESCRIPTION_LENGTH}`;

        const isValid = length >= CONFIG.VALIDATION.MIN_DESCRIPTION_LENGTH;
        textarea.classList.toggle("valid", isValid);

        this.updateNavigationState();
      });
    }
  }

  setupAccessibility() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.handleCancel();
      }
    });

    const form = document.getElementById("add-story-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
    });
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
      this.cleanupCurrentStep();
      this.currentStep--;
      await this.updateStepDisplay();
      await this.initializeCurrentStep();
    }
  }

  validateCurrentStep() {
    switch (this.currentStep) {
      case 1:
        const textarea = document.getElementById("story-description");
        return (
          textarea.value.trim().length >=
          CONFIG.VALIDATION.MIN_DESCRIPTION_LENGTH
        );
      case 2:
        return !!this.capturedPhoto;
      case 3:
        return true; // Location is optional
      default:
        return false;
    }
  }

  async updateStepDisplay() {
    // Update step visibility
    document.querySelectorAll(".form-step").forEach((step, index) => {
      step.classList.toggle("active", index === this.currentStep - 1);
    });

    // Update progress bar
    const progressFill = document.querySelector(".progress-fill");
    if (progressFill) {
      progressFill.style.width = `${
        (this.currentStep / this.totalSteps) * 100
      }%`;
    }

    // Update step indicator
    const currentStepEl = document.querySelector(".current-step");
    if (currentStepEl) {
      currentStepEl.textContent = this.currentStep;
    }

    // Update step dots
    document.querySelectorAll(".step-dot").forEach((dot, index) => {
      dot.classList.toggle("completed", index < this.currentStep);
      dot.classList.toggle("active", index === this.currentStep - 1);
    });

    // Update navigation buttons
    this.updateNavigationState();
  }

  updateNavigationState() {
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");
    const submitBtn = document.getElementById("submit-btn");

    // Previous button
    prevBtn.style.display = this.currentStep > 1 ? "flex" : "none";

    // Next/Submit button
    if (this.currentStep === this.totalSteps) {
      nextBtn.style.display = "none";
      submitBtn.style.display = "flex";
    } else {
      nextBtn.style.display = "flex";
      submitBtn.style.display = "none";
      nextBtn.disabled = !this.validateCurrentStep();
    }
  }

  async initializeCurrentStep() {
    switch (this.currentStep) {
      case 1:
        this.focusDescription();
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

  focusDescription() {
    setTimeout(() => {
      const textarea = document.getElementById("story-description");
      if (textarea) textarea.focus();
    }, 300);
  }

  async initializeCamera() {
    const startBtn = document.getElementById("start-camera-btn");
    const captureBtn = document.getElementById("capture-btn");
    const retakeBtn = document.getElementById("retake-btn");

    if (startBtn) {
      startBtn.addEventListener("click", () => this.startCamera());
    }

    if (captureBtn) {
      captureBtn.addEventListener("click", () => this.capturePhoto());
    }

    if (retakeBtn) {
      retakeBtn.addEventListener("click", () => this.retakePhoto());
    }
  }

  async startCamera() {
    try {
      const video = document.getElementById("camera-video");
      const placeholder = document.getElementById("camera-placeholder");
      const overlay = document.getElementById("camera-overlay");

      this.cameraStream = await navigator.mediaDevices.getUserMedia({
        video: CONFIG.CAMERA_CONSTRAINTS.video,
      });

      video.srcObject = this.cameraStream;

      video.addEventListener("loadedmetadata", () => {
        placeholder.style.display = "none";
        overlay.style.display = "flex";
      });

      this.announceToScreenReader("Kamera berhasil diaktifkan");
    } catch (error) {
      console.error("Camera error:", error);
      this.showError(
        "Tidak dapat mengakses kamera. Pastikan browser memiliki izin kamera."
      );
    }
  }

  capturePhoto() {
    const video = document.getElementById("camera-video");
    const canvas = document.getElementById("photo-canvas");
    const preview = document.getElementById("photo-preview");
    const capturedImage = document.getElementById("captured-image");
    const overlay = document.getElementById("camera-overlay");

    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        this.capturedPhoto = blob;
        capturedImage.src = URL.createObjectURL(blob);

        overlay.style.display = "none";
        preview.style.display = "block";

        this.stopCamera();
        this.updateNavigationState();

        this.announceToScreenReader("Foto berhasil diambil");
      },
      "image/jpeg",
      0.8
    );
  }

  retakePhoto() {
    const preview = document.getElementById("photo-preview");
    const placeholder = document.getElementById("camera-placeholder");
    const capturedImage = document.getElementById("captured-image");

    if (capturedImage.src) {
      URL.revokeObjectURL(capturedImage.src);
    }

    this.capturedPhoto = null;
    preview.style.display = "none";
    placeholder.style.display = "flex";

    this.updateNavigationState();
  }

  stopCamera() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach((track) => track.stop());
      this.cameraStream = null;
    }
  }

  async initializeMap() {
    try {
      const mapContainer = document.getElementById("location-map");
      if (!mapContainer || typeof L === "undefined") return;

      this.map = L.map("location-map", {
        zoomControl: true,
        attributionControl: false,
      }).setView(
        [CONFIG.DEFAULT_LOCATION.lat, CONFIG.DEFAULT_LOCATION.lng],
        13
      );

      L.tileLayer(CONFIG.MAP_TILES.openstreetmap.url, {
        attribution: CONFIG.MAP_TILES.openstreetmap.attribution,
        maxZoom: 18,
      }).addTo(this.map);

      this.map.on("click", (e) => this.handleMapClick(e));

      const detectBtn = document.getElementById("detect-location-btn");
      const clearBtn = document.getElementById("clear-location-btn");

      if (detectBtn) {
        detectBtn.addEventListener("click", () => this.detectCurrentLocation());
      }

      if (clearBtn) {
        clearBtn.addEventListener("click", () => this.clearLocation());
      }

      setTimeout(() => {
        if (this.map) this.map.invalidateSize();
      }, 300);
    } catch (error) {
      console.error("Map initialization error:", error);
    }
  }

  handleMapClick(e) {
    this.selectedLocation = {
      lat: e.latlng.lat,
      lng: e.latlng.lng,
    };

    if (this.mapMarker) {
      this.map.removeLayer(this.mapMarker);
    }

    this.mapMarker = L.marker([e.latlng.lat, e.latlng.lng], {
      icon: L.divIcon({
        className: "custom-map-marker",
        html: '<div class="marker-pin"><i class="fas fa-map-marker-alt"></i></div>',
        iconSize: [30, 40],
        iconAnchor: [15, 40],
      }),
    }).addTo(this.map);

    this.updateLocationDisplay();
    this.announceToScreenReader("Lokasi berhasil dipilih");
  }

  detectCurrentLocation() {
    const detectBtn = document.getElementById("detect-location-btn");
    const originalContent = detectBtn.innerHTML;

    detectBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Mendeteksi...';
    detectBtn.disabled = true;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          this.selectedLocation = { lat, lng };
          this.map.setView([lat, lng], 15);

          if (this.mapMarker) {
            this.map.removeLayer(this.mapMarker);
          }

          this.mapMarker = L.marker([lat, lng], {
            icon: L.divIcon({
              className: "custom-map-marker",
              html: '<div class="marker-pin"><i class="fas fa-map-marker-alt"></i></div>',
              iconSize: [30, 40],
              iconAnchor: [15, 40],
            }),
          }).addTo(this.map);

          this.updateLocationDisplay();

          detectBtn.innerHTML = originalContent;
          detectBtn.disabled = false;

          this.announceToScreenReader("Lokasi berhasil dideteksi");
        },
        (error) => {
          console.error("Geolocation error:", error);
          this.showError(
            "Tidak dapat mendeteksi lokasi. Pastikan izin lokasi diaktifkan."
          );
          detectBtn.innerHTML = originalContent;
          detectBtn.disabled = false;
        }
      );
    } else {
      this.showError("Browser tidak mendukung deteksi lokasi.");
      detectBtn.innerHTML = originalContent;
      detectBtn.disabled = false;
    }
  }

  updateLocationDisplay() {
    const display = document.getElementById("location-display");
    const clearBtn = document.getElementById("clear-location-btn");

    if (this.selectedLocation) {
      display.innerHTML = `
        <div class="location-selected">
          <i class="fas fa-map-pin"></i>
          <div class="location-text">
            <p>Lokasi dipilih</p>
            <small>${this.selectedLocation.lat.toFixed(
              6
            )}, ${this.selectedLocation.lng.toFixed(6)}</small>
          </div>
        </div>
      `;
      clearBtn.style.display = "flex";
    } else {
      display.innerHTML = `
        <div class="location-placeholder">
          <i class="fas fa-map-pin"></i>
          <div class="location-text">
            <p>Belum ada lokasi dipilih</p>
            <small>Klik pada peta atau gunakan deteksi otomatis</small>
          </div>
        </div>
      `;
      clearBtn.style.display = "none";
    }
  }

  clearLocation() {
    this.selectedLocation = null;
    if (this.mapMarker) {
      this.map.removeLayer(this.mapMarker);
      this.mapMarker = null;
    }
    this.updateLocationDisplay();
    this.announceToScreenReader("Lokasi dihapus");
  }

  cleanupCurrentStep() {
    switch (this.currentStep) {
      case 2:
        this.stopCamera();
        break;
    }
  }

  getFormData() {
    const description = document
      .getElementById("story-description")
      .value.trim();

    return {
      description,
      photo: this.capturedPhoto,
      location: this.selectedLocation,
    };
  }

  showLoading() {
    const submitBtn = document.getElementById("submit-btn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.querySelector(".btn-text").style.display = "none";
      submitBtn.querySelector(".btn-loading").style.display = "flex";
    }
  }

  hideLoading() {
    const submitBtn = document.getElementById("submit-btn");
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.querySelector(".btn-text").style.display = "flex";
      submitBtn.querySelector(".btn-loading").style.display = "none";
    }
  }

  showSuccess() {
    if (window.showToast) {
      window.showToast("Story berhasil dibagikan!", "success");
    }

    setTimeout(() => {
      window.location.hash = "#/";
    }, 1500);
  }

  showError(message) {
    if (window.showToast) {
      window.showToast(message, "error");
    }
  }

  handleCancel() {
    const hasData =
      this.capturedPhoto ||
      document.getElementById("story-description")?.value.trim();

    if (hasData) {
      if (
        confirm("Yakin ingin membatalkan? Data yang sudah diisi akan hilang.")
      ) {
        this.cleanup();
        window.location.hash = "#/";
      }
    } else {
      window.location.hash = "#/";
    }
  }

  announceToScreenReader(message) {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.className = "sr-only";
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }

  cleanup() {
    this.stopCamera();

    if (this.capturedPhoto) {
      const capturedImage = document.getElementById("captured-image");
      if (capturedImage && capturedImage.src) {
        URL.revokeObjectURL(capturedImage.src);
      }
      this.capturedPhoto = null;
    }

    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  destroy() {
    this.cleanup();
  }
}
