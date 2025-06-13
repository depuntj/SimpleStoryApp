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
    this.onStepValidationRequested = null;
    this.onStepChangeRequested = null;
    this.onCancelRequested = null;
    this.onRetryRequested = null;
    this.onDescriptionChanged = null;
    this.onPhotoChanged = null;
    this.onLocationChanged = null;
  }

  async afterRender() {
    this.setupStepNavigation();
    this.setupFormValidation();
    this.setupFormSubmission();
    this.setupAccessibility();
    this.setupBeforeUnloadHandler();
    this.setupVisibilityHandler();
    await this.initializeCurrentStep();
  }

  render() {
    return `
      <main class="add-story-page" role="main">
        <div class="add-story-container">
          <header class="story-header">
            <div class="story-header-content">
              <h1>
                <i class="fas fa-plus-circle" aria-hidden="true"></i>
                Buat Story Baru
              </h1>
              <p>Bagikan momen spesial Anda dengan komunitas Dicoding</p>
            </div>
          </header>
  
          <nav class="progress-section" aria-label="Progress pembuatan story">
            <ol class="progress-steps" role="list">
              <li class="progress-step ${
                this.currentStep >= 1 ? "active" : ""
              } ${this.currentStep > 1 ? "completed" : ""}" 
                  data-step="1" role="listitem">
                <div class="progress-step-icon" aria-hidden="true">
                  <i class="fas fa-edit"></i>
                </div>
                <span class="progress-step-label">Deskripsi</span>
              </li>
              
              <li class="progress-step ${
                this.currentStep >= 2 ? "active" : ""
              } ${this.currentStep > 2 ? "completed" : ""}" 
                  data-step="2" role="listitem">
                <div class="progress-step-icon" aria-hidden="true">
                  <i class="fas fa-camera"></i>
                </div>
                <span class="progress-step-label">Foto</span>
              </li>
              
              <li class="progress-step ${
                this.currentStep >= 3 ? "active" : ""
              }" 
                  data-step="3" role="listitem">
                <div class="progress-step-icon" aria-hidden="true">
                  <i class="fas fa-map-marker-alt"></i>
                </div>
                <span class="progress-step-label">Lokasi</span>
              </li>
            </ol>
            
            <div class="progress-line" role="progressbar" 
                 aria-valuenow="${this.currentStep}" 
                 aria-valuemin="1" 
                 aria-valuemax="3"
                 aria-label="Progress langkah ${this.currentStep} dari 3">
              <div class="progress-fill" style="width: ${
                (this.currentStep / this.totalSteps) * 100
              }%"></div>
            </div>
          </nav>
  
          <form id="add-story-form" class="story-form" role="form" aria-label="Form pembuatan story">
            <section class="form-step ${
              this.currentStep === 1 ? "active" : ""
            }" 
                     data-step="1" 
                     aria-labelledby="step-1-title"
                     role="tabpanel">
              <div class="step-content">
                <header class="step-header">
                  <h2 class="step-title" id="step-1-title">
                    <i class="fas fa-pen-fancy" aria-hidden="true"></i>
                    Ceritakan Pengalaman Anda
                  </h2>
                  <p class="step-description">
                    Tulis deskripsi menarik tentang momen yang akan Anda bagikan
                  </p>
                </header>
  
                <div class="description-section">
                  <fieldset>
                    <legend class="sr-only">Informasi Deskripsi Story</legend>
                    
                    <div class="form-group">
                      <label for="story-description" class="form-label">
                        <i class="fas fa-comment-dots" aria-hidden="true"></i>
                        Deskripsi Story
                        <span class="label-required">*Wajib</span>
                      </label>
                      <div class="textarea-container">
                        <textarea 
                          id="story-description" 
                          name="description"
                          class="form-textarea"
                          placeholder="Ceritakan tentang momen ini... Apa yang membuatnya spesial? Bagikan pengalaman atau pelajaran yang didapat..."
                          maxlength="${
                            CONFIG.VALIDATION.MAX_DESCRIPTION_LENGTH
                          }"
                          required
                          aria-describedby="desc-help desc-counter"
                          aria-invalid="false"
                        ></textarea>
                        <div class="textarea-footer">
                          <small id="desc-help" class="form-help">
                            <i class="fas fa-info-circle" aria-hidden="true"></i>
                            Minimal ${
                              CONFIG.VALIDATION.MIN_DESCRIPTION_LENGTH
                            } karakter
                          </small>
                          <span id="desc-counter" class="char-counter" aria-live="polite">
                            0/${CONFIG.VALIDATION.MAX_DESCRIPTION_LENGTH}
                          </span>
                        </div>
                      </div>
                    </div>
                  </fieldset>
  
                  <aside class="tips-card">
                    <h3>
                      <i class="fas fa-lightbulb" aria-hidden="true"></i>
                      Tips menulis deskripsi yang menarik
                    </h3>
                    <ul class="tips-list" role="list">
                      <li role="listitem">
                        <i class="fas fa-camera" aria-hidden="true"></i>
                        Ceritakan konteks dan suasana saat foto diambil
                      </li>
                      <li role="listitem">
                        <i class="fas fa-graduation-cap" aria-hidden="true"></i>
                        Bagikan pelajaran atau insight yang didapat
                      </li>
                      <li role="listitem">
                        <i class="fas fa-heart" aria-hidden="true"></i>
                        Gunakan bahasa yang personal dan autentik
                      </li>
                      <li role="listitem">
                        <i class="fas fa-users" aria-hidden="true"></i>
                        Buat konten yang relatable untuk komunitas
                      </li>
                    </ul>
                  </aside>
                </div>
              </div>
            </section>
  
            <section class="form-step ${
              this.currentStep === 2 ? "active" : ""
            }" 
                     data-step="2"
                     aria-labelledby="step-2-title"
                     role="tabpanel">
              <div class="step-content">
                <header class="step-header">
                  <h2 class="step-title" id="step-2-title">
                    <i class="fas fa-camera-retro" aria-hidden="true"></i>
                    Ambil Foto dengan Kamera
                  </h2>
                  <p class="step-description">
                    Gunakan kamera perangkat untuk mengambil foto story Anda
                  </p>
                </header>
  
                <div class="camera-section">
                  <div class="camera-container">
                    <div class="camera-viewport" id="camera-viewport" role="img" aria-live="polite">
                      <video id="camera-video" 
                             class="camera-preview" 
                             autoplay 
                             playsinline 
                             muted 
                             style="display: none;"
                             aria-label="Preview kamera untuk mengambil foto"></video>
                      <canvas id="photo-canvas" 
                              class="photo-canvas" 
                              style="display: none;"
                              aria-label="Canvas untuk memproses foto"></canvas>
                      
                      <div id="camera-placeholder" class="camera-placeholder">
                        <i class="fas fa-video" aria-hidden="true"></i>
                        <h3>Siap Mengambil Foto?</h3>
                        <p>Pastikan pencahayaan cukup dan objek terlihat jelas dalam frame</p>
                        <button type="button" id="start-camera-btn" class="camera-button btn-camera-primary">
                          <i class="fas fa-play" aria-hidden="true"></i>
                          Aktifkan Kamera
                        </button>
                      </div>
  
                      <div id="photo-preview" class="photo-preview" style="display: none;">
                        <img id="captured-image" alt="Foto yang baru saja diambil">
                        <div class="photo-overlay">
                          <button type="button" id="retake-btn" class="camera-button btn-camera-secondary">
                            <i class="fas fa-redo" aria-hidden="true"></i>
                            Ambil Ulang
                          </button>
                        </div>
                      </div>
                    </div>
  
                    <div class="camera-controls" id="camera-controls" style="display: none;" role="toolbar" aria-label="Kontrol kamera">
                      <button type="button" id="capture-btn" class="camera-button btn-camera-capture pulse">
                        <i class="fas fa-camera" aria-hidden="true"></i>
                        Ambil Foto
                      </button>
                      <button type="button" id="stop-camera-btn" class="camera-button btn-camera-secondary">
                        <i class="fas fa-stop" aria-hidden="true"></i>
                        Batal
                      </button>
                    </div>
                  </div>
  
                  <aside class="camera-tips">
                    <h3>
                      <i class="fas fa-camera" aria-hidden="true"></i>
                      Tips foto yang bagus
                    </h3>
                    <ul class="tips-grid" role="list">
                      <li class="tip-item" role="listitem">
                        <i class="fas fa-sun" aria-hidden="true"></i>
                        <span>Cari pencahayaan yang baik</span>
                      </li>
                      <li class="tip-item" role="listitem">
                        <i class="fas fa-hand-paper" aria-hidden="true"></i>
                        <span>Pegang kamera dengan stabil</span>
                      </li>
                      <li class="tip-item" role="listitem">
                        <i class="fas fa-eye" aria-hidden="true"></i>
                        <span>Fokus pada objek utama</span>
                      </li>
                      <li class="tip-item" role="listitem">
                        <i class="fas fa-mobile-alt" aria-hidden="true"></i>
                        <span>Posisikan frame dengan baik</span>
                      </li>
                    </ul>
                  </aside>
                </div>
              </div>
            </section>
  
            <section class="form-step ${
              this.currentStep === 3 ? "active" : ""
            }" 
                     data-step="3"
                     aria-labelledby="step-3-title"
                     role="tabpanel">
              <div class="step-content">
                <header class="step-header">
                  <h2 class="step-title" id="step-3-title">
                    <i class="fas fa-map-marked-alt" aria-hidden="true"></i>
                    Tandai Lokasi
                  </h2>
                  <p class="step-description">
                    Tambahkan informasi lokasi untuk memberikan konteks pada story
                    <span class="label-optional">(Opsional)</span>
                  </p>
                </header>
  
                <div class="location-section">
                  <div class="map-container">
                    <div id="location-map" 
                         class="location-map" 
                         role="application" 
                         aria-label="Peta interaktif untuk memilih lokasi"
                         tabindex="0"></div>
                    
                    <div class="map-overlay" role="toolbar" aria-label="Kontrol peta">
                      <button type="button" id="detect-location-btn" class="map-control-btn">
                        <i class="fas fa-crosshairs" aria-hidden="true"></i>
                        Deteksi Lokasi Saya
                      </button>
                      <button type="button" id="clear-location-btn" class="map-control-btn btn-danger" style="display: none;">
                        <i class="fas fa-times" aria-hidden="true"></i>
                        Hapus Lokasi
                      </button>
                    </div>
                  </div>
  
                  <div class="location-info">
                    <div class="location-display" id="location-display" aria-live="polite">
                      <div class="location-status">
                        <i class="fas fa-map-pin location-icon" aria-hidden="true"></i>
                        <div class="location-text">
                          <h4>Belum ada lokasi dipilih</h4>
                          <p>Klik pada peta atau gunakan deteksi otomatis</p>
                        </div>
                      </div>
                    </div>
  
                    <aside class="location-notes">
                      <h4>
                        <i class="fas fa-info-circle" aria-hidden="true"></i>
                        Tentang Lokasi
                      </h4>
                      <ul role="list">
                        <li role="listitem">
                          <i class="fas fa-check" aria-hidden="true"></i>
                          Lokasi bersifat opsional dan dapat dilewati
                        </li>
                        <li role="listitem">
                          <i class="fas fa-map" aria-hidden="true"></i>
                          Membantu komunitas menemukan tempat menarik
                        </li>
                        <li role="listitem">
                          <i class="fas fa-globe" aria-hidden="true"></i>
                          Data lokasi akan ditampilkan di peta stories
                        </li>
                        <li role="listitem">
                          <i class="fas fa-shield-alt" aria-hidden="true"></i>
                          Lokasi disimpan dengan aman dan dapat dihapus
                        </li>
                      </ul>
                    </aside>
                  </div>
                </div>
              </div>
            </section>
  
            <footer class="form-navigation">
              <div class="nav-buttons" role="group" aria-label="Navigasi form">
                <button type="button" id="prev-btn" class="nav-button btn-secondary" style="display: none;">
                  <i class="fas fa-arrow-left" aria-hidden="true"></i>
                  <span class="btn-text">Sebelumnya</span>
                </button>
  
                <button type="button" id="next-btn" class="nav-button btn-primary" disabled>
                  <span class="btn-text">
                    Selanjutnya
                    <i class="fas fa-arrow-right" aria-hidden="true"></i>
                  </span>
                </button>
  
                <button type="submit" id="submit-btn" class="nav-button btn-submit" style="display: none;">
                  <span class="btn-text">
                    <i class="fas fa-share" aria-hidden="true"></i>
                    Bagikan Story
                  </span>
                  <span class="btn-loading" style="display: none;">
                    <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>
                    Mengirim...
                  </span>
                </button>
              </div>
  
              <div class="cancel-area">
                <button type="button" id="cancel-btn" class="cancel-button">
                  <i class="fas fa-times" aria-hidden="true"></i>
                  Batalkan
                </button>
              </div>
            </footer>
          </form>
        </div>
      </main>
    `;
  }

  setupStepNavigation() {
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");
    const cancelBtn = document.getElementById("cancel-btn");

    nextBtn?.addEventListener("click", () => this.nextStep());
    prevBtn?.addEventListener("click", () => this.prevStep());
    cancelBtn?.addEventListener("click", () => this.handleCancel());
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
        textarea.classList.toggle("error", length > 0 && !isValid);

        this.updateNavigationState();
      });

      textarea.addEventListener("blur", () => {
        const length = textarea.value.length;
        if (length > 0 && length < CONFIG.VALIDATION.MIN_DESCRIPTION_LENGTH) {
          textarea.classList.add("error");
        }
      });

      textarea.addEventListener("focus", () => {
        textarea.classList.remove("error");
      });
    }
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
        textarea.classList.toggle("error", length > 0 && !isValid);

        if (this.onDescriptionChanged) {
          this.onDescriptionChanged(textarea.value);
        }

        this.updateNavigationState();
      });

      textarea.addEventListener("blur", () => {
        const length = textarea.value.length;
        if (length > 0 && length < CONFIG.VALIDATION.MIN_DESCRIPTION_LENGTH) {
          textarea.classList.add("error");
        }
      });

      textarea.addEventListener("focus", () => {
        textarea.classList.remove("error");
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
          textarea?.value.trim().length >=
          CONFIG.VALIDATION.MIN_DESCRIPTION_LENGTH
        );
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

    document.querySelectorAll(".progress-step").forEach((step, index) => {
      step.classList.toggle("active", index === this.currentStep - 1);
      step.classList.toggle("completed", index < this.currentStep - 1);
    });

    const progressFill = document.querySelector(".progress-fill");
    if (progressFill) {
      progressFill.style.width = `${
        (this.currentStep / this.totalSteps) * 100
      }%`;
    }

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
        video: CONFIG.CAMERA_CONSTRAINTS.video,
      });

      video.srcObject = this.cameraStream;

      video.addEventListener("loadedmetadata", () => {
        placeholder.style.display = "none";
        video.style.display = "block";
        controls.style.display = "flex";
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
    const controls = document.getElementById("camera-controls");

    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        this.capturedPhoto = blob;
        capturedImage.src = URL.createObjectURL(blob);

        video.style.display = "none";
        controls.style.display = "none";
        preview.style.display = "block";

        this.stopCamera();

        if (this.onPhotoChanged) {
          this.onPhotoChanged(blob);
        }

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
    try {
      if (this.cameraStream) {
        this.cameraStream.getTracks().forEach((track) => {
          track.stop();
          track.enabled = false;
        });
        this.cameraStream = null;
      }

      const video = document.getElementById("camera-video");
      const placeholder = document.getElementById("camera-placeholder");
      const controls = document.getElementById("camera-controls");

      if (video) {
        video.style.display = "none";
        video.srcObject = null;
      }
      if (controls) controls.style.display = "none";
      if (placeholder) placeholder.style.display = "flex";

      this.announceToScreenReader("Kamera dinonaktifkan");
    } catch (error) {
      console.warn("Error stopping camera:", error);
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

      detectBtn?.addEventListener("click", () => this.detectCurrentLocation());
      clearBtn?.addEventListener("click", () => this.clearLocation());

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

    if (this.onLocationChanged) {
      this.onLocationChanged(this.selectedLocation);
    }

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
        <div class="location-status selected">
          <i class="fas fa-map-pin location-icon"></i>
          <div class="location-text">
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
          <i class="fas fa-map-pin location-icon"></i>
          <div class="location-text">
            <h4>Belum ada lokasi dipilih</h4>
            <p>Klik pada peta atau gunakan deteksi otomatis</p>
          </div>
        </div>
      `;
      if (clearBtn) clearBtn.style.display = "none";
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
      ?.value.trim();

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
      const btnText = submitBtn.querySelector(".btn-text");
      const btnLoading = submitBtn.querySelector(".btn-loading");
      if (btnText) btnText.style.display = "none";
      if (btnLoading) btnLoading.style.display = "flex";
    }
  }

  hideLoading() {
    const submitBtn = document.getElementById("submit-btn");
    if (submitBtn) {
      submitBtn.disabled = false;
      const btnText = submitBtn.querySelector(".btn-text");
      const btnLoading = submitBtn.querySelector(".btn-loading");
      if (btnText) btnText.style.display = "flex";
      if (btnLoading) btnLoading.style.display = "none";
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
    if (this.onCancelRequested) {
      this.onCancelRequested();
    }
  }
  getCurrentFormData() {
    const description = document
      .getElementById("story-description")
      ?.value.trim();

    return {
      description,
      photo: this.capturedPhoto,
      location: this.selectedLocation,
    };
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

  setupStepNavigation() {
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");
    const cancelBtn = document.getElementById("cancel-btn");

    nextBtn?.addEventListener("click", () => this.nextStep());
    prevBtn?.addEventListener("click", () => this.prevStep());
    cancelBtn?.addEventListener("click", () => this.handleCancel());
  }

  announceToScreenReader(message) {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.className = "sr-only";
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }
  setupBeforeUnloadHandler() {
    this.beforeUnloadHandler = (e) => {
      const hasUnsavedData =
        this.capturedPhoto ||
        document.getElementById("story-description")?.value.trim();

      if (hasUnsavedData) {
        e.preventDefault();
        e.returnValue =
          "Anda memiliki perubahan yang belum disimpan. Yakin ingin meninggalkan halaman?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", this.beforeUnloadHandler);
  }

  handleVisibilityChange() {
    if (document.hidden && this.cameraStream) {
      this.stopCamera();
      this.announceToScreenReader(
        "Kamera dihentikan karena aplikasi tidak aktif"
      );
    }
  }

  setupVisibilityHandler() {
    this.visibilityHandler = () => this.handleVisibilityChange();
    document.addEventListener("visibilitychange", this.visibilityHandler);
  }

  validateImageFile(file) {
    if (!file) {
      return { isValid: false, error: "Tidak ada file yang dipilih" };
    }

    if (file.size > CONFIG.VALIDATION.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `Ukuran file terlalu besar. Maksimal ${this.formatFileSize(
          CONFIG.VALIDATION.MAX_FILE_SIZE
        )}`,
      };
    }

    if (!CONFIG.VALIDATION.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: "Format file tidak didukung. Gunakan JPEG, PNG, atau WebP",
      };
    }

    return { isValid: true };
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  async startCamera() {
    try {
      if (this.cameraStream) {
        this.stopCamera();
      }

      const video = document.getElementById("camera-video");
      const placeholder = document.getElementById("camera-placeholder");
      const controls = document.getElementById("camera-controls");

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("CAMERA_NOT_SUPPORTED");
      }

      this.cameraStream = await navigator.mediaDevices.getUserMedia({
        video: CONFIG.CAMERA_CONSTRAINTS.video,
        audio: false,
      });

      if (video) {
        video.srcObject = this.cameraStream;

        video.addEventListener("loadedmetadata", () => {
          if (placeholder) placeholder.style.display = "none";
          video.style.display = "block";
          if (controls) controls.style.display = "flex";
        });

        video.addEventListener("error", (e) => {
          console.error("Video error:", e);
          this.showError("Terjadi kesalahan pada video kamera");
        });
      }

      this.announceToScreenReader("Kamera berhasil diaktifkan");
    } catch (error) {
      console.error("Camera error:", error);

      let errorMessage = "Tidak dapat mengakses kamera.";

      if (error.name === "NotAllowedError") {
        errorMessage =
          "Akses kamera ditolak. Pastikan Anda memberikan izin kamera di browser.";
      } else if (error.name === "NotFoundError") {
        errorMessage =
          "Kamera tidak ditemukan. Pastikan perangkat memiliki kamera.";
      } else if (error.name === "NotSupportedError") {
        errorMessage = "Browser tidak mendukung akses kamera.";
      } else if (error.message === "CAMERA_NOT_SUPPORTED") {
        errorMessage = "Browser tidak mendukung fitur kamera.";
      }

      this.showError(errorMessage);
    }
  }

  cleanup() {
    try {
      this.stopCamera();

      if (this.capturedPhoto) {
        const capturedImage = document.getElementById("captured-image");
        if (capturedImage?.src && capturedImage.src.startsWith("blob:")) {
          URL.revokeObjectURL(capturedImage.src);
        }
        this.capturedPhoto = null;
      }

      if (this.map) {
        try {
          this.map.remove();
        } catch (mapError) {
          console.warn("Error removing map:", mapError);
        }
        this.map = null;
      }

      if (this.mapMarker) {
        this.mapMarker = null;
      }

      this.selectedLocation = null;
      this.currentStep = 1;

      const form = document.getElementById("add-story-form");
      if (form) {
        form.reset();
      }

      document.removeEventListener("keydown", this.keydownHandler);
      window.removeEventListener("beforeunload", this.beforeUnloadHandler);
    } catch (error) {
      console.warn("Error during cleanup:", error);
    }
  }
  navigateToHome() {
    window.location.hash = "#/";
  }

  navigateToLogin() {
    window.location.hash = "#/login";
  }

  resetForm() {
    try {
      this.stopCamera();

      if (this.capturedPhoto) {
        const capturedImage = document.getElementById("captured-image");
        if (capturedImage?.src && capturedImage.src.startsWith("blob:")) {
          URL.revokeObjectURL(capturedImage.src);
        }
        this.capturedPhoto = null;
      }

      if (this.map) {
        try {
          this.map.remove();
        } catch (mapError) {
          console.warn("Error removing map:", mapError);
        }
        this.map = null;
      }

      if (this.mapMarker) {
        this.mapMarker = null;
      }

      this.selectedLocation = null;
      this.currentStep = 1;

      const form = document.getElementById("add-story-form");
      if (form) {
        form.reset();
      }

      this.updateStepDisplay();
    } catch (error) {
      console.warn("Error during form reset:", error);
    }
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
}
