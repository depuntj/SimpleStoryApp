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
            <h1>
              <i class="fas fa-plus-circle" aria-hidden="true"></i> 
              Buat Story Baru
            </h1>
            <p>Bagikan momen spesial Anda dengan komunitas Dicoding</p>
          </header>

          <section class="progress-section" aria-labelledby="progress-heading">
            <h2 id="progress-heading" class="sr-only">Progress pembuatan story</h2>
            <div class="progress-steps" role="progressbar" aria-valuenow="1" aria-valuemin="1" aria-valuemax="3" aria-labelledby="progress-heading">
              <div class="progress-step active" data-step="1">
                <div class="progress-step-icon" aria-hidden="true">
                  <i class="fas fa-edit"></i>
                </div>
                <span class="progress-step-label">Deskripsi</span>
              </div>
              <div class="progress-step" data-step="2">
                <div class="progress-step-icon" aria-hidden="true">
                  <i class="fas fa-camera"></i>
                </div>
                <span class="progress-step-label">Foto</span>
              </div>
              <div class="progress-step" data-step="3">
                <div class="progress-step-icon" aria-hidden="true">
                  <i class="fas fa-map-marker-alt"></i>
                </div>
                <span class="progress-step-label">Lokasi</span>
              </div>
            </div>
          </section>

          <form id="add-story-form" class="story-form" novalidate>
            <fieldset class="form-step active" data-step="1">
              <legend class="sr-only">Langkah 1: Tulis deskripsi story</legend>
              <div class="step-content">
                <header class="step-header">
                  <h2 class="step-title">
                    <i class="fas fa-edit" aria-hidden="true"></i>
                    Ceritakan Pengalaman Anda
                  </h2>
                  <p class="step-description">Tulis deskripsi yang menarik tentang momen yang ingin Anda bagikan</p>
                </header>

                <div class="form-group">
                  <label for="story-description" class="form-label">
                    <i class="fas fa-pen" aria-hidden="true"></i>
                    Deskripsi Story
                    <span class="label-required" aria-label="wajib diisi">*</span>
                  </label>
                  <textarea 
                    id="story-description" 
                    name="description"
                    class="form-textarea"
                    placeholder="Ceritakan tentang momen ini..."
                    maxlength="500"
                    minlength="10"
                    required
                    aria-describedby="desc-help desc-counter desc-error"
                    aria-invalid="false"></textarea>
                  <div class="textarea-footer">
                    <small id="desc-help" class="form-help">
                      <i class="fas fa-info-circle" aria-hidden="true"></i>
                      Minimal 10 karakter untuk deskripsi yang bermakna
                    </small>
                    <span id="desc-counter" class="char-counter" aria-live="polite">0/500</span>
                  </div>
                  <div id="desc-error" class="field-error" role="alert" aria-live="polite"></div>
                </div>

                <aside class="tips-card">
                  <h3>
                    <i class="fas fa-lightbulb" aria-hidden="true"></i>
                    Tips Menulis Deskripsi
                  </h3>
                  <ul class="tips-list">
                    <li>
                      <i class="fas fa-check" aria-hidden="true"></i>
                      Ceritakan konteks dan latar belakang foto
                    </li>
                    <li>
                      <i class="fas fa-check" aria-hidden="true"></i>
                      Bagikan perasaan atau pembelajaran dari momen tersebut
                    </li>
                    <li>
                      <i class="fas fa-check" aria-hidden="true"></i>
                      Gunakan bahasa yang mudah dipahami dan ramah
                    </li>
                  </ul>
                </aside>
              </div>
            </fieldset>

            <fieldset class="form-step" data-step="2">
              <legend class="sr-only">Langkah 2: Ambil foto dengan kamera</legend>
              <div class="step-content">
                <header class="step-header">
                  <h2 class="step-title">
                    <i class="fas fa-camera" aria-hidden="true"></i>
                    Ambil Foto dengan Kamera
                  </h2>
                  <p class="step-description">Gunakan kamera perangkat untuk mengambil foto yang menarik</p>
                </header>

                <div class="camera-section">
                  <div class="camera-container">
                    <div class="camera-viewport" id="camera-viewport" role="img" aria-labelledby="camera-status">
                      <div id="camera-status" class="sr-only">Kamera belum aktif</div>
                      
                      <video id="camera-video" 
                             class="camera-preview" 
                             autoplay 
                             playsinline 
                             muted 
                             style="display: none;"
                             aria-label="Live camera feed"></video>
                      
                      <div id="camera-placeholder" class="camera-placeholder">
                        <i class="fas fa-video" aria-hidden="true"></i>
                        <h3>Siap Mengambil Foto?</h3>
                        <p>Aktifkan kamera untuk memulai</p>
                        <button type="button" 
                                id="start-camera-btn" 
                                class="camera-button btn-camera-primary"
                                aria-describedby="camera-help">
                          <i class="fas fa-play" aria-hidden="true"></i> 
                          Aktifkan Kamera
                        </button>
                      </div>
                      
                      <div id="photo-preview" class="photo-preview" style="display: none;">
                        <img id="captured-image" 
                             alt="Foto yang berhasil diambil"
                             role="img">
                        <div class="photo-overlay">
                          <button type="button" 
                                  id="retake-btn" 
                                  class="camera-button btn-camera-secondary"
                                  aria-label="Ambil ulang foto">
                            <i class="fas fa-redo" aria-hidden="true"></i> 
                            Ambil Ulang
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div class="camera-controls" id="camera-controls" style="display: none;" role="toolbar" aria-label="Kontrol kamera">
                      <button type="button" 
                              id="capture-btn" 
                              class="camera-button btn-camera-capture"
                              aria-label="Ambil foto sekarang">
                        <i class="fas fa-camera" aria-hidden="true"></i> 
                        Ambil Foto
                      </button>
                      <button type="button" 
                              id="stop-camera-btn" 
                              class="camera-button btn-camera-secondary"
                              aria-label="Hentikan kamera">
                        <i class="fas fa-stop" aria-hidden="true"></i> 
                        Batal
                      </button>
                    </div>
                  </div>

                  <aside class="camera-tips">
                    <h3>
                      <i class="fas fa-camera" aria-hidden="true"></i>
                      Tips Mengambil Foto
                    </h3>
                    <div class="tips-grid">
                      <div class="tip-item">
                        <i class="fas fa-sun" aria-hidden="true"></i>
                        <span>Pastikan pencahayaan cukup</span>
                      </div>
                      <div class="tip-item">
                        <i class="fas fa-hand-paper" aria-hidden="true"></i>
                        <span>Pegang perangkat dengan stabil</span>
                      </div>
                      <div class="tip-item">
                        <i class="fas fa-eye" aria-hidden="true"></i>
                        <span>Fokus pada objek utama</span>
                      </div>
                      <div class="tip-item">
                        <i class="fas fa-crop" aria-hidden="true"></i>
                        <span>Komposisi yang menarik</span>
                      </div>
                    </div>
                  </aside>
                </div>
                <div id="camera-help" class="sr-only">
                  Klik tombol aktifkan kamera untuk memulai. Pastikan browser memiliki izin akses kamera.
                </div>
              </div>
            </fieldset>

            <fieldset class="form-step" data-step="3">
              <legend class="sr-only">Langkah 3: Pilih lokasi (opsional)</legend>
              <div class="step-content">
                <header class="step-header">
                  <h2 class="step-title">
                    <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
                    Tandai Lokasi
                  </h2>
                  <p class="step-description">Tambahkan informasi lokasi untuk story Anda (opsional)</p>
                </header>

                <div class="location-section">
                  <div class="map-container">
                    <div class="map-overlay" role="toolbar" aria-label="Kontrol peta lokasi">
                      <button type="button" 
                              id="detect-location-btn" 
                              class="map-control-btn"
                              aria-label="Deteksi lokasi otomatis menggunakan GPS">
                        <i class="fas fa-crosshairs" aria-hidden="true"></i> 
                        Deteksi Lokasi
                      </button>
                      <button type="button" 
                              id="clear-location-btn" 
                              class="map-control-btn btn-danger" 
                              style="display: none;"
                              aria-label="Hapus lokasi yang dipilih">
                        <i class="fas fa-times" aria-hidden="true"></i> 
                        Hapus
                      </button>
                    </div>
                    <div id="location-map" 
                         class="location-map"
                         role="img"
                         aria-labelledby="map-heading"
                         aria-describedby="map-instructions"></div>
                    <div id="map-heading" class="sr-only">Peta interaktif untuk memilih lokasi</div>
                    <div id="map-instructions" class="sr-only">
                      Klik pada peta untuk memilih lokasi, atau gunakan tombol deteksi lokasi untuk menggunakan GPS
                    </div>
                  </div>
                  
                  <div class="location-info">
                    <div class="location-display">
                      <div id="location-status" class="location-status" role="status" aria-live="polite">
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
                        Catatan Lokasi
                      </h4>
                      <ul>
                        <li>
                          <i class="fas fa-circle" aria-hidden="true"></i>
                          Lokasi bersifat opsional dan dapat membantu orang lain menemukan tempat menarik
                        </li>
                        <li>
                          <i class="fas fa-circle" aria-hidden="true"></i>
                          Anda dapat menggunakan deteksi otomatis atau memilih manual di peta
                        </li>
                        <li>
                          <i class="fas fa-circle" aria-hidden="true"></i>
                          Informasi lokasi akan ditampilkan bersama story Anda
                        </li>
                      </ul>
                    </aside>
                  </div>
                </div>
              </div>
            </fieldset>

            <footer class="form-navigation" role="contentinfo">
              <div class="nav-buttons">
                <button type="button" 
                        id="prev-btn" 
                        class="nav-button btn-secondary" 
                        style="display: none;"
                        aria-label="Kembali ke langkah sebelumnya">
                  <i class="fas fa-arrow-left" aria-hidden="true"></i> 
                  Sebelumnya
                </button>
                <button type="button" 
                        id="next-btn" 
                        class="nav-button btn-primary" 
                        disabled
                        aria-label="Lanjut ke langkah berikutnya">
                  <span class="btn-text">
                    Selanjutnya 
                    <i class="fas fa-arrow-right" aria-hidden="true"></i>
                  </span>
                </button>
                <button type="submit" 
                        id="submit-btn" 
                        class="nav-button btn-submit" 
                        style="display: none;"
                        aria-label="Bagikan story ke komunitas">
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
                <button type="button" 
                        id="cancel-btn" 
                        class="cancel-button"
                        aria-label="Batalkan pembuatan story">
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

  async afterRender() {
    this.setupNavigation();
    this.setupFormValidation();
    this.setupFormSubmission();
    this.setupAccessibility();
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
    const errorElement = document.getElementById("desc-error");

    if (textarea && counter) {
      textarea.addEventListener("input", () => {
        const length = textarea.value.length;
        const isValid = length >= 10 && length <= 500;

        counter.textContent = `${length}/500`;
        counter.setAttribute("aria-label", `${length} dari 500 karakter`);

        if (length > 0) {
          if (isValid) {
            textarea.classList.remove("error");
            textarea.classList.add("valid");
            textarea.setAttribute("aria-invalid", "false");
            errorElement.textContent = "";
          } else if (length < 10) {
            textarea.classList.add("error");
            textarea.classList.remove("valid");
            textarea.setAttribute("aria-invalid", "true");
            errorElement.textContent = `Minimal 10 karakter diperlukan (saat ini ${length})`;
          } else if (length > 500) {
            textarea.classList.add("error");
            textarea.classList.remove("valid");
            textarea.setAttribute("aria-invalid", "true");
            errorElement.textContent = `Maksimal 500 karakter (saat ini ${length})`;
          }
        } else {
          textarea.classList.remove("error", "valid");
          textarea.setAttribute("aria-invalid", "false");
          errorElement.textContent = "";
        }

        this.updateNavigationState();
      });

      textarea.addEventListener("blur", () => {
        if (textarea.value.length > 0 && textarea.value.length < 10) {
          errorElement.textContent = "Deskripsi harus minimal 10 karakter";
        }
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

  setupAccessibility() {
    const form = document.getElementById("add-story-form");
    form?.setAttribute("aria-label", "Form pembuatan story baru");

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (this.onCancelRequested) {
          this.onCancelRequested();
        }
      }
    });
  }

  async nextStep() {
    if (this.currentStep < this.totalSteps && this.validateCurrentStep()) {
      this.currentStep++;
      await this.updateStepDisplay();
      await this.initializeCurrentStep();
      this.announceStepChange();
    }
  }

  async prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      await this.updateStepDisplay();
      await this.initializeCurrentStep();
      this.announceStepChange();
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
    const steps = document.querySelectorAll(".form-step");
    const progressSteps = document.querySelectorAll(".progress-step");
    const progressBar = document.querySelector('[role="progressbar"]');

    steps.forEach((step, index) => {
      step.classList.toggle("active", index === this.currentStep - 1);
    });

    progressSteps.forEach((step, index) => {
      const stepNumber = index + 1;
      if (stepNumber < this.currentStep) {
        step.classList.add("completed");
        step.classList.remove("active");
      } else if (stepNumber === this.currentStep) {
        step.classList.add("active");
        step.classList.remove("completed");
      } else {
        step.classList.remove("active", "completed");
      }
    });

    if (progressBar) {
      progressBar.setAttribute("aria-valuenow", this.currentStep.toString());
      progressBar.setAttribute(
        "aria-valuetext",
        `Langkah ${this.currentStep} dari ${this.totalSteps}`
      );
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
      if (submitBtn) {
        submitBtn.style.display = "flex";
        submitBtn.disabled = !this.validateCurrentStep();
      }
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
          if (textarea) {
            textarea.focus();
            this.updateCameraStatus("Tahap deskripsi aktif");
          }
        }, 100);
        break;
      case 2:
        await this.initializeCamera();
        this.updateCameraStatus("Tahap foto aktif. Siap mengambil foto.");
        break;
      case 3:
        await this.initializeMap();
        this.updateCameraStatus("Tahap lokasi aktif. Pilih lokasi pada peta.");
        break;
    }
    this.updateNavigationState();
  }

  updateCameraStatus(message) {
    const statusElement = document.getElementById("camera-status");
    if (statusElement) {
      statusElement.textContent = message;
    }
  }

  announceStepChange() {
    const stepNames = ["deskripsi", "foto", "lokasi"];
    const currentStepName = stepNames[this.currentStep - 1];
    this.announceToScreenReader(
      `Beralih ke langkah ${this.currentStep}: ${currentStepName}`
    );
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

      this.updateCameraStatus("Kamera aktif. Siap mengambil foto.");
      this.announceToScreenReader("Kamera berhasil diaktifkan");
    } catch (error) {
      this.showError(
        "Tidak dapat mengakses kamera. Pastikan browser memiliki izin akses kamera."
      );
      this.updateCameraStatus("Gagal mengaktifkan kamera");
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
        capturedImage.alt = "Foto yang berhasil diambil untuk story";
        video.style.display = "none";
        controls.style.display = "none";
        preview.style.display = "block";
        this.stopCamera();
        this.updateNavigationState();
        this.updateCameraStatus("Foto berhasil diambil");
        this.announceToScreenReader(
          "Foto berhasil diambil. Anda dapat melanjutkan atau mengambil ulang."
        );
      },
      "image/jpeg",
      0.8
    );
  }

  retakePhoto() {
    this.capturedPhoto = null;
    const preview = document.getElementById("photo-preview");
    const placeholder = document.getElementById("camera-placeholder");

    preview.style.display = "none";
    placeholder.style.display = "flex";
    this.updateNavigationState();
    this.updateCameraStatus("Siap mengambil foto ulang");
    this.announceToScreenReader("Foto dihapus. Siap mengambil foto baru.");
  }

  stopCamera() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach((track) => track.stop());
      this.cameraStream = null;
      this.announceToScreenReader("Kamera dihentikan");
    }
  }

  async initializeMap() {
    if (typeof L === "undefined") {
      this.showError("Library peta tidak tersedia");
      return;
    }

    const mapElement = document.getElementById("location-map");
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map("location-map").setView([-6.2088, 106.8456], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(this.map);

    this.map.on("click", (e) => {
      this.selectedLocation = { lat: e.latlng.lat, lng: e.latlng.lng };
      if (this.mapMarker) this.map.removeLayer(this.mapMarker);
      this.mapMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map);
      this.updateLocationDisplay();
      this.announceToScreenReader(
        `Lokasi dipilih: ${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`
      );
    });

    const detectBtn = document.getElementById("detect-location-btn");
    const clearBtn = document.getElementById("clear-location-btn");

    detectBtn?.addEventListener("click", () => {
      if ("geolocation" in navigator) {
        detectBtn.disabled = true;
        detectBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Mendeteksi...';

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            this.selectedLocation = { lat, lng };
            this.map.setView([lat, lng], 15);
            if (this.mapMarker) this.map.removeLayer(this.mapMarker);
            this.mapMarker = L.marker([lat, lng]).addTo(this.map);
            this.updateLocationDisplay();
            this.announceToScreenReader(
              `Lokasi terdeteksi: ${lat.toFixed(6)}, ${lng.toFixed(6)}`
            );

            detectBtn.disabled = false;
            detectBtn.innerHTML =
              '<i class="fas fa-crosshairs"></i> Deteksi Lokasi';
          },
          (error) => {
            this.showError(
              "Tidak dapat mendeteksi lokasi. Pastikan GPS aktif dan izin lokasi diberikan."
            );
            detectBtn.disabled = false;
            detectBtn.innerHTML =
              '<i class="fas fa-crosshairs"></i> Deteksi Lokasi';
          }
        );
      } else {
        this.showError("Geolocation tidak didukung browser ini");
      }
    });

    clearBtn?.addEventListener("click", () => {
      this.selectedLocation = null;
      if (this.mapMarker) {
        this.map.removeLayer(this.mapMarker);
        this.mapMarker = null;
      }
      this.updateLocationDisplay();
      this.announceToScreenReader("Lokasi dihapus");
    });

    setTimeout(() => {
      this.map.invalidateSize();
      this.announceToScreenReader("Peta lokasi siap digunakan");
    }, 300);
  }

  updateLocationDisplay() {
    const statusElement = document.getElementById("location-status");
    const clearBtn = document.getElementById("clear-location-btn");

    if (this.selectedLocation) {
      statusElement.innerHTML = `
        <i class="fas fa-map-pin location-icon" aria-hidden="true"></i>
        <div class="location-text">
          <h4>Lokasi dipilih</h4>
          <p>${this.selectedLocation.lat.toFixed(
            6
          )}, ${this.selectedLocation.lng.toFixed(6)}</p>
        </div>
      `;
      statusElement.classList.add("selected");
      if (clearBtn) clearBtn.style.display = "flex";
    } else {
      statusElement.innerHTML = `
        <i class="fas fa-map-pin location-icon" aria-hidden="true"></i>
        <div class="location-text">
          <h4>Belum ada lokasi dipilih</h4>
          <p>Klik pada peta atau gunakan deteksi otomatis</p>
        </div>
      `;
      statusElement.classList.remove("selected");
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
    this.announceToScreenReader(message);
  }

  showLoading() {
    const submitBtn = document.getElementById("submit-btn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.querySelector(".btn-text").style.display = "none";
      submitBtn.querySelector(".btn-loading").style.display = "flex";
      submitBtn.setAttribute("aria-busy", "true");
    }
  }

  hideLoading() {
    const submitBtn = document.getElementById("submit-btn");
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.querySelector(".btn-text").style.display = "flex";
      submitBtn.querySelector(".btn-loading").style.display = "none";
      submitBtn.setAttribute("aria-busy", "false");
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
    this.announceToScreenReader(
      "Story berhasil dibagikan dan akan segera muncul di halaman utama"
    );
  }

  showSubmissionError(message) {
    if (window.showToast) {
      window.showToast(message, "error");
    }
    this.announceToScreenReader(`Gagal mengirim story: ${message}`);
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

  cleanup() {
    this.stopCamera();
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    if (this.mapMarker) {
      this.mapMarker = null;
    }
    this.selectedLocation = null;
    this.capturedPhoto = null;
  }
}
