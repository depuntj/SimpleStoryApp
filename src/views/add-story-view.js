import CONFIG from "../scripts/config";

export class AddStoryView {
  constructor() {
    this.map = null;
    this.selectedLocation = null;
    this.stream = null;
    this.capturedImage = null;
  }

  render() {
    return `
      <section class="add-story-container">
        <h1>Tambah Story Baru</h1>
        
        <form id="add-story-form" class="story-form" novalidate>
          <div class="form-group">
            <label for="description-input" class="form-label">Deskripsi Story</label>
            <textarea 
              id="description-input" 
              name="description" 
              class="form-input" 
              placeholder="Ceritakan tentang foto ini..."
              required
              aria-describedby="description-help"
            ></textarea>
            <small id="description-help" class="form-help">Minimal 10 karakter</small>
          </div>

          <div class="form-group">
            <label class="form-label">Foto Story</label>
            <div class="camera-section">
              <video id="camera-preview" class="camera-preview" autoplay playsinline style="display: none;"></video>
              <canvas id="photo-canvas" class="photo-canvas" style="display: none;"></canvas>
              <div id="photo-preview" class="photo-preview" style="display: none;">
                <img id="captured-photo" alt="Foto yang diambil">
              </div>
              
              <div class="camera-controls">
                <button type="button" id="start-camera" class="camera-button">
                  📷 Mulai Kamera
                </button>
                <button type="button" id="capture-photo" class="camera-button" style="display: none;">
                  📸 Ambil Foto
                </button>
                <button type="button" id="retake-photo" class="camera-button" style="display: none;">
                  🔄 Ambil Ulang
                </button>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Lokasi Story (Opsional)</label>
            <div class="location-section">
              <div id="location-map" class="location-map"></div>
              <div class="location-info">
                <p id="location-text">Klik pada peta untuk memilih lokasi</p>
                <button type="button" id="clear-location" class="clear-button" style="display: none;">
                  Hapus Lokasi
                </button>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" id="cancel-button" class="cancel-button">
              Batal
            </button>
            <button type="submit" id="submit-button" class="submit-button" disabled>
              Bagikan Story
            </button>
          </div>
        </form>
      </section>
    `;
  }

  initializeCamera() {
    const startButton = document.getElementById("start-camera");
    const captureButton = document.getElementById("capture-photo");
    const retakeButton = document.getElementById("retake-photo");
    const video = document.getElementById("camera-preview");
    const canvas = document.getElementById("photo-canvas");
    const preview = document.getElementById("photo-preview");
    const capturedPhoto = document.getElementById("captured-photo");

    startButton.addEventListener("click", async () => {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "environment",
          },
        });

        video.srcObject = this.stream;
        video.style.display = "block";
        startButton.style.display = "none";
        captureButton.style.display = "block";
      } catch (error) {
        alert(
          "Tidak dapat mengakses kamera. Pastikan browser memiliki izin kamera."
        );
        console.error("Camera error:", error);
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
          retakeButton.style.display = "block";

          this.stopCamera();
          this.updateSubmitButton();
        },
        "image/jpeg",
        0.8
      );
    });

    retakeButton.addEventListener("click", () => {
      this.capturedImage = null;
      preview.style.display = "none";
      retakeButton.style.display = "none";
      startButton.style.display = "block";

      if (capturedPhoto.src) {
        URL.revokeObjectURL(capturedPhoto.src);
      }

      this.updateSubmitButton();
    });
  }

  initializeMap() {
    this.map = L.map("location-map").setView(
      [CONFIG.DEFAULT_LOCATION.lat, CONFIG.DEFAULT_LOCATION.lng],
      13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(this.map);

    this.map.on("click", (e) => {
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

      document.getElementById(
        "location-text"
      ).textContent = `Lokasi dipilih: ${e.latlng.lat.toFixed(
        6
      )}, ${e.latlng.lng.toFixed(6)}`;
      document.getElementById("clear-location").style.display = "block";
    });

    document.getElementById("clear-location").addEventListener("click", () => {
      this.selectedLocation = null;
      if (this.locationMarker) {
        this.map.removeLayer(this.locationMarker);
      }
      document.getElementById("location-text").textContent =
        "Klik pada peta untuk memilih lokasi";
      document.getElementById("clear-location").style.display = "none";
    });
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  updateSubmitButton() {
    const description = document
      .getElementById("description-input")
      .value.trim();
    const submitButton = document.getElementById("submit-button");

    const isValid = description.length >= 10 && this.capturedImage;
    submitButton.disabled = !isValid;
  }

  setupFormValidation() {
    const descriptionInput = document.getElementById("description-input");

    descriptionInput.addEventListener("input", () => {
      this.updateSubmitButton();
    });
  }

  showLoading() {
    const submitButton = document.getElementById("submit-button");
    submitButton.disabled = true;
    submitButton.textContent = "Mengirim...";
  }

  showSuccess() {
    alert("Story berhasil ditambahkan!");
    window.location.hash = "#/";
  }

  showError(message) {
    alert(`Gagal menambahkan story: ${message}`);
    const submitButton = document.getElementById("submit-button");
    submitButton.disabled = false;
    submitButton.textContent = "Bagikan Story";
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
