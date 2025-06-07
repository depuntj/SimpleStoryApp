import CONFIG from "../scripts/config";

export class AddStoryView {
  constructor() {
    this.map = null;
    this.selectedLocation = null;
    this.stream = null;
    this.capturedImage = null;
    this.currentStep = 1;
    this.totalSteps = 3;
  }

  render() {
    return `
      <section class="add-story-page">
        <div class="container">
          <header class="page-header">
            <h1>
              <i class="fas fa-plus-circle"></i>
              Tambah Story Baru
            </h1>
            <p>Bagikan momen berharga Anda dengan komunitas</p>
            
            <div class="progress-bar">
              <div class="progress-step ${
                this.currentStep >= 1 ? "active" : ""
              }" data-step="1">
                <i class="fas fa-edit"></i>
                <span>Deskripsi</span>
              </div>
              <div class="progress-step ${
                this.currentStep >= 2 ? "active" : ""
              }" data-step="2">
                <i class="fas fa-camera"></i>
                <span>Foto</span>
              </div>
              <div class="progress-step ${
                this.currentStep >= 3 ? "active" : ""
              }" data-step="3">
                <i class="fas fa-map-marker-alt"></i>
                <span>Lokasi</span>
              </div>
            </div>
          </header>
          
          <div class="add-story-container">
            <form id="add-story-form" class="story-form" novalidate>
              
              <!-- Step 1: Description -->
              <div class="form-step ${
                this.currentStep === 1 ? "active" : ""
              }" data-step="1">
                <div class="step-header">
                  <h2>
                    <i class="fas fa-edit"></i>
                    Ceritakan tentang foto Anda
                  </h2>
                  <p>Tulis deskripsi yang menarik untuk story Anda</p>
                </div>
                
                <div class="form-group">
                  <label for="description-input" class="form-label">
                    <i class="fas fa-align-left"></i>
                    Deskripsi Story
                  </label>
                  <div class="textarea-group">
                    <textarea 
                      id="description-input" 
                      name="description" 
                      class="form-textarea" 
                      placeholder="Ceritakan tentang foto ini... (minimal 10 karakter)"
                      required
                      aria-describedby="description-help description-counter"
                      maxlength="500"
                    ></textarea>
                    <div class="textarea-footer">
                      <small id="description-help" class="form-help">
                        <i class="fas fa-info-circle"></i>
                        Minimal 10 karakter untuk deskripsi yang baik
                      </small>
                      <span id="description-counter" class="char-counter">0/500</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 2: Photo -->
              <div class="form-step ${
                this.currentStep === 2 ? "active" : ""
              }" data-step="2">
                <div class="step-header">
                  <h2>
                    <i class="fas fa-camera"></i>
                    Ambil foto dengan kamera
                  </h2>
                  <p>Ambil foto yang menarik untuk melengkapi story Anda</p>
                </div>
                
                <div class="form-group">
                  <div class="camera-section">
                    <video id="camera-preview" class="camera-preview" autoplay playsinline style="display: none;"></video>
                    <canvas id="photo-canvas" class="photo-canvas" style="display: none;"></canvas>
                    
                    <div id="photo-preview" class="photo-preview" style="display: none;">
                      <img id="captured-photo" alt="Foto yang diambil">
                      <div class="photo-overlay">
                        <div class="photo-info">
                          <i class="fas fa-check-circle"></i>
                          <span>Foto berhasil diambil</span>
                        </div>
                      </div>
                    </div>
                    
                    <div id="camera-placeholder" class="camera-placeholder">
                      <i class="fas fa-camera"></i>
                      <h3>Siap mengambil foto?</h3>
                      <p>Aktifkan kamera untuk mengambil foto story Anda</p>
                    </div>
                    
                    <div class="camera-controls">
                      <button type="button" id="start-camera" class="camera-button btn-camera-primary">
                        <i class="fas fa-video"></i>
                        <span>Mulai Kamera</span>
                      </button>
                      <button type="button" id="capture-photo" class="camera-button btn-camera-capture" style="display: none;">
                        <i class="fas fa-camera"></i>
                        <span>Ambil Foto</span>
                      </button>
                      <button type="button" id="retake-photo" class="camera-button btn-camera-secondary" style="display: none;">
                        <i class="fas fa-redo"></i>
                        <span>Ambil Ulang</span>
                      </button>
                    </div>
                    
                    <div class="camera-tips">
                      <h4>
                        <i class="fas fa-lightbulb"></i>
                        Tips untuk foto yang bagus:
                      </h4>
                      <ul>
                        <li><i class="fas fa-sun"></i> Pastikan pencahayaan cukup</li>
                        <li><i class="fas fa-hand-paper"></i> Tahan kamera dengan stabil</li>
                        <li><i class="fas fa-eye"></i> Fokus pada objek utama</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 3: Location -->
              <div class="form-step ${
                this.currentStep === 3 ? "active" : ""
              }" data-step="3">
                <div class="step-header">
                  <h2>
                    <i class="fas fa-map-marker-alt"></i>
                    Tandai lokasi (Opsional)
                  </h2>
                  <p>Tambahkan lokasi untuk memberikan konteks pada story Anda</p>
                </div>
                
                <div class="form-group">
                  <div class="location-section">
                    <div class="map-container">
                      <div id="location-map" class="location-map"></div>
                      <div class="map-overlay">
                        <button type="button" id="detect-location" class="detect-location-btn">
                          <i class="fas fa-crosshairs"></i>
                          <span>Deteksi Lokasi Saya</span>
                        </button>
                      </div>
                    </div>
                    
                    <div class="location-info">
                      <div class="location-display">
                        <i class="fas fa-map-pin"></i>
                        <div class="location-text">
                          <p id="location-text">Klik pada peta untuk memilih lokasi</p>
                          <small id="location-coords"></small>
                        </div>
                      </div>
                      
                      <div class="location-actions">
                        <button type="button" id="clear-location" class="btn-location-clear" style="display: none;">
                          <i class="fas fa-times"></i>
                          Hapus Lokasi
                        </button>
                      </div>
                    </div>
                    
                    <div class="location-tips">
                      <h4>
                        <i class="fas fa-info-circle"></i>
                        Tentang lokasi:
                      </h4>
                      <ul>
                        <li><i class="fas fa-shield-alt"></i> Lokasi bersifat opsional dan aman</li>
                        <li><i class="fas fa-users"></i> Membantu komunitas menemukan tempat menarik</li>
                        <li><i class="fas fa-edit"></i> Anda bisa melewati langkah ini</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Navigation & Submit -->
              <div class="form-navigation">
                <div class="nav-buttons">
                  <button type="button" id="prev-button" class="nav-button btn-secondary" style="display: none;">
                    <i class="fas fa-arrow-left"></i>
                    Sebelumnya
                  </button>
                  
                  <button type="button" id="next-button" class="nav-button btn-primary" disabled>
                    <span class="btn-text">
                      Selanjutnya
                      <i class="fas fa-arrow-right"></i>
                    </span>
                  </button>
                  
                  <button type="submit" id="submit-button" class="nav-button btn-submit" style="display: none;">
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
                
                <button type="button" id="cancel-button" class="cancel-button">
                  <i class="fas fa-times"></i>
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    `;
  }

  afterRender() {
    this.setupStepNavigation();
    this.setupFormValidation();
  }

  setupStepNavigation() {
    const nextButton = document.getElementById("next-button");
    const prevButton = document.getElementById("prev-button");

    nextButton.addEventListener("click", () => this.nextStep());
    prevButton.addEventListener("click", () => this.prevStep());

    this.updateStepDisplay();
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      if (this.validateCurrentStep()) {
        this.currentStep++;
        this.updateStepDisplay();
        this.initializeStepFeatures();
      }
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateStepDisplay();
    }
  }

  validateCurrentStep() {
    switch (this.currentStep) {
      case 1:
        const description = document
          .getElementById("description-input")
          .value.trim();
        if (description.length < 10) {
          this.showStepError("Deskripsi harus minimal 10 karakter");
          return false;
        }
        return true;
      case 2:
        if (!this.capturedImage) {
          this.showStepError("Foto harus diambil terlebih dahulu");
          return false;
        }
        return true;
      case 3:
        return true; // Location is optional
      default:
        return true;
    }
  }

  updateStepDisplay() {
    // Update progress bar
    document.querySelectorAll(".progress-step").forEach((step, index) => {
      step.classList.toggle("active", index < this.currentStep);
      step.classList.toggle("current", index === this.currentStep - 1);
    });

    // Update form steps
    document.querySelectorAll(".form-step").forEach((step, index) => {
      step.classList.toggle("active", index === this.currentStep - 1);
    });

    // Update navigation buttons
    const nextButton = document.getElementById("next-button");
    const prevButton = document.getElementById("prev-button");
    const submitButton = document.getElementById("submit-button");

    prevButton.style.display = this.currentStep > 1 ? "flex" : "none";

    if (this.currentStep === this.totalSteps) {
      nextButton.style.display = "none";
      submitButton.style.display = "flex";
    } else {
      nextButton.style.display = "flex";
      submitButton.style.display = "none";
    }

    this.updateNextButtonState();
  }

  updateNextButtonState() {
    const nextButton = document.getElementById("next-button");
    let isValid = false;

    switch (this.currentStep) {
      case 1:
        const description = document
          .getElementById("description-input")
          .value.trim();
        isValid = description.length >= 10;
        break;
      case 2:
        isValid = !!this.capturedImage;
        break;
      case 3:
        isValid = true; // Location is optional
        break;
    }

    nextButton.disabled = !isValid;
  }

  initializeStepFeatures() {
    switch (this.currentStep) {
      case 2:
        if (!this.cameraInitialized) {
          this.initializeCamera();
          this.cameraInitialized = true;
        }
        break;
      case 3:
        if (!this.mapInitialized) {
          setTimeout(() => this.initializeMap(), 100);
          this.mapInitialized = true;
        }
        break;
    }
  }

  setupFormValidation() {
    const descriptionInput = document.getElementById("description-input");
    const counter = document.getElementById("description-counter");

    descriptionInput.addEventListener("input", () => {
      const length = descriptionInput.value.length;
      counter.textContent = `${length}/500`;

      if (length >= 10) {
        descriptionInput.classList.remove("error");
        descriptionInput.classList.add("valid");
      } else {
        descriptionInput.classList.remove("valid");
      }

      this.updateNextButtonState();
    });

    this.initializeStepFeatures();
  }

  initializeCamera() {
    const startButton = document.getElementById("start-camera");
    const captureButton = document.getElementById("capture-photo");
    const retakeButton = document.getElementById("retake-photo");
    const video = document.getElementById("camera-preview");
    const canvas = document.getElementById("photo-canvas");
    const preview = document.getElementById("photo-preview");
    const placeholder = document.getElementById("camera-placeholder");
    const capturedPhoto = document.getElementById("captured-photo");

    startButton.addEventListener("click", async () => {
      try {
        startButton.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i><span>Mengaktifkan...</span>';
        startButton.disabled = true;

        this.stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "environment",
          },
        });

        video.srcObject = this.stream;
        video.style.display = "block";
        placeholder.style.display = "none";
        startButton.style.display = "none";
        captureButton.style.display = "flex";

        if (typeof window.showToast === "function") {
          window.showToast("Kamera berhasil diaktifkan", "success");
        }
      } catch (error) {
        console.error("Camera error:", error);
        this.showStepError(
          "Tidak dapat mengakses kamera. Pastikan browser memiliki izin kamera."
        );
        startButton.innerHTML =
          '<i class="fas fa-video"></i><span>Coba Lagi</span>';
        startButton.disabled = false;
      }
    });

    captureButton.addEventListener("click", () => {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);

      canvas.toBlob(
        (blob) => {
          this.capturedImage = blob;
          capturedPhoto.src = URL.createObjectURL(blob);

          video.style.display = "none";
          preview.style.display = "block";
          captureButton.style.display = "none";
          retakeButton.style.display = "flex";

          this.stopCamera();
          this.updateNextButtonState();

          if (typeof window.showToast === "function") {
            window.showToast("Foto berhasil diambil", "success");
          }
        },
        "image/jpeg",
        0.8
      );
    });

    retakeButton.addEventListener("click", () => {
      this.capturedImage = null;
      preview.style.display = "none";
      placeholder.style.display = "flex";
      retakeButton.style.display = "none";
      startButton.style.display = "flex";
      startButton.innerHTML =
        '<i class="fas fa-video"></i><span>Mulai Kamera</span>';
      startButton.disabled = false;

      if (capturedPhoto.src) {
        URL.revokeObjectURL(capturedPhoto.src);
      }

      this.updateNextButtonState();
    });
  }

  initializeMap() {
    const mapContainer = document.getElementById("location-map");
    if (!mapContainer) return;

    this.map = L.map("location-map").setView(
      [CONFIG.DEFAULT_LOCATION.lat, CONFIG.DEFAULT_LOCATION.lng],
      13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(this.map);

    this.map.on("click", (e) => this.handleMapClick(e));

    const detectLocationBtn = document.getElementById("detect-location");
    detectLocationBtn.addEventListener("click", () =>
      this.detectCurrentLocation()
    );

    const clearLocationBtn = document.getElementById("clear-location");
    clearLocationBtn.addEventListener("click", () => this.clearLocation());
  }

  handleMapClick(e) {
    this.selectedLocation = {
      lat: e.latlng.lat,
      lng: e.latlng.lng,
    };

    if (this.locationMarker) {
      this.map.removeLayer(this.locationMarker);
    }

    this.locationMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(
      this.map
    );

    this.updateLocationDisplay();
  }

  detectCurrentLocation() {
    const detectBtn = document.getElementById("detect-location");
    const originalContent = detectBtn.innerHTML;

    detectBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i><span>Mendeteksi...</span>';
    detectBtn.disabled = true;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          this.selectedLocation = { lat, lng };
          this.map.setView([lat, lng], 15);

          if (this.locationMarker) {
            this.map.removeLayer(this.locationMarker);
          }

          this.locationMarker = L.marker([lat, lng]).addTo(this.map);
          this.updateLocationDisplay();

          detectBtn.innerHTML = originalContent;
          detectBtn.disabled = false;

          if (typeof window.showToast === "function") {
            window.showToast("Lokasi berhasil dideteksi", "success");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          this.showStepError(
            "Tidak dapat mendeteksi lokasi. Pastikan izin lokasi diaktifkan."
          );
          detectBtn.innerHTML = originalContent;
          detectBtn.disabled = false;
        }
      );
    } else {
      this.showStepError("Browser tidak mendukung deteksi lokasi.");
      detectBtn.innerHTML = originalContent;
      detectBtn.disabled = false;
    }
  }

  updateLocationDisplay() {
    const locationText = document.getElementById("location-text");
    const locationCoords = document.getElementById("location-coords");
    const clearButton = document.getElementById("clear-location");

    if (this.selectedLocation) {
      locationText.textContent = "Lokasi dipilih";
      locationCoords.textContent = `${this.selectedLocation.lat.toFixed(
        6
      )}, ${this.selectedLocation.lng.toFixed(6)}`;
      clearButton.style.display = "flex";
    } else {
      locationText.textContent = "Klik pada peta untuk memilih lokasi";
      locationCoords.textContent = "";
      clearButton.style.display = "none";
    }
  }

  clearLocation() {
    this.selectedLocation = null;
    if (this.locationMarker) {
      this.map.removeLayer(this.locationMarker);
    }
    this.updateLocationDisplay();

    if (typeof window.showToast === "function") {
      window.showToast("Lokasi dihapus", "info");
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  showStepError(message) {
    if (typeof window.showToast === "function") {
      window.showToast(message, "error");
    } else {
      alert(message);
    }
  }

  showLoading() {
    const submitButton = document.getElementById("submit-button");
    submitButton.disabled = true;
    submitButton.querySelector(".btn-text").style.display = "none";
    submitButton.querySelector(".btn-loading").style.display = "flex";
  }

  hideLoading() {
    const submitButton = document.getElementById("submit-button");
    submitButton.disabled = false;
    submitButton.querySelector(".btn-text").style.display = "flex";
    submitButton.querySelector(".btn-loading").style.display = "none";
  }

  showSuccess() {
    if (typeof window.showToast === "function") {
      window.showToast("Story berhasil ditambahkan!", "success");
    }
    setTimeout(() => {
      window.location.hash = "#/";
    }, 1500);
  }

  showError(message) {
    this.hideLoading();
    if (typeof window.showToast === "function") {
      window.showToast(`Gagal menambahkan story: ${message}`, "error");
    } else {
      alert(`Gagal menambahkan story: ${message}`);
    }
  }

  getFormData() {
    const description = document
      .getElementById("description-input")
      .value.trim();

    return {
      description,
      photo: this.capturedImage,
      lat: this.selectedLocation?.lat || null,
      lon: this.selectedLocation?.lng || null,
    };
  }

  cleanup() {
    this.stopCamera();
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}
