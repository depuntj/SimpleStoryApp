// src/views/stories-view.js
import { showFormattedDate } from "../scripts/utils/index.js";
import CONFIG from "../scripts/config.js";

export class StoriesView {
  constructor() {
    this.map = null;
    this.markers = [];
    this.mapInitialized = false;
    this.mapInitializationInProgress = false;
    this.mapContainerId = null;
  }

  renderStoriesList(stories) {
    const container = document.getElementById("stories-container");

    if (!container) {
      console.error("Stories container not found");
      return;
    }

    // Render stories list terlebih dahulu
    container.innerHTML = stories
      .map(
        (story) => `
      <article class="story-card" tabindex="0" role="article">
        <div class="story-image">
          <img src="${story.photoUrl}" alt="Story by ${
          story.name
        }" loading="lazy">
        </div>
        <div class="story-content">
          <h3 class="story-author">${story.name}</h3>
          <p class="story-description">${story.description}</p>
          <time class="story-date" datetime="${story.createdAt}">
            ${showFormattedDate(story.createdAt, "id-ID")}
          </time>
          ${
            story.lat && story.lon
              ? `
            <div class="story-location">
              <span class="location-icon">📍</span>
              <span>Lat: ${story.lat}, Lon: ${story.lon}</span>
            </div>
          `
              : ""
          }
        </div>
      </article>
    `
      )
      .join("");

    // PERBAIKAN: Initialize map dengan pengecekan yang lebih ketat
    this.scheduleMapInitialization(stories);
  }

  // PERBAIKAN: Method untuk schedule map initialization dengan protection
  scheduleMapInitialization(stories) {
    // Cancel previous timeout if exists
    if (this.mapInitTimeout) {
      clearTimeout(this.mapInitTimeout);
    }

    this.mapInitTimeout = setTimeout(() => {
      this.safeInitializeMap(stories);
    }, 1000);
  }

  // PERBAIKAN: Method terpisah untuk inisialisasi map yang aman
  safeInitializeMap(stories) {
    // Prevent multiple simultaneous initializations
    if (this.mapInitializationInProgress) {
      console.log("Map initialization already in progress, skipping...");
      return;
    }

    this.mapInitializationInProgress = true;

    try {
      const mapContainer = document.getElementById("map-container");
      if (!mapContainer) {
        console.warn("Map container tidak ditemukan");
        this.mapInitializationInProgress = false;
        return;
      }

      // PERBAIKAN: Cek apakah container sudah memiliki map
      if (mapContainer._leaflet_id) {
        console.log("Map container sudah memiliki map, cleanup dulu...");
        this.forceCleanupMap();
      }

      // Pastikan Leaflet sudah loaded
      if (typeof L === "undefined") {
        console.error("Leaflet library belum dimuat");
        this.showMapError();
        this.mapInitializationInProgress = false;
        return;
      }

      console.log("Initializing map...");

      // PERBAIKAN: Reset container state secara paksa
      this.resetMapContainer();

      // Initialize map dengan error handling
      this.map = L.map("map-container", {
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        dragging: true,
      }).setView(
        [CONFIG.DEFAULT_LOCATION.lat, CONFIG.DEFAULT_LOCATION.lng],
        10
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(this.map);

      this.mapInitialized = true;
      this.mapContainerId = this.map._container.id;
      console.log("Map berhasil diinisialisasi");

      // Add markers setelah map ready
      setTimeout(() => {
        if (this.map && this.mapInitialized) {
          this.addMarkersToMap(stories);
        }
        this.mapInitializationInProgress = false;
      }, 500);
    } catch (error) {
      console.error("Error initializing map:", error);
      this.showMapError();
      this.mapInitializationInProgress = false;
    }
  }

  // PERBAIKAN: Reset map container secara paksa
  resetMapContainer() {
    const mapContainer = document.getElementById("map-container");
    if (!mapContainer) return;

    // Remove all Leaflet-related attributes and classes
    delete mapContainer._leaflet_id;
    mapContainer.innerHTML = "";

    // Remove Leaflet classes
    const leafletClasses = [
      "leaflet-container",
      "leaflet-touch",
      "leaflet-retina",
      "leaflet-fade-anim",
      "leaflet-grab",
      "leaflet-touch-zoom",
      "leaflet-touch-drag",
      "leaflet-safari",
    ];

    leafletClasses.forEach((cls) => {
      mapContainer.classList.remove(cls);
    });

    // Reset style
    mapContainer.style.position = "";
    mapContainer.removeAttribute("tabindex");
  }

  addMarkersToMap(stories) {
    if (!this.map || !this.mapInitialized) {
      console.warn("Map belum ready untuk markers");
      return;
    }

    try {
      // Clear existing markers
      this.clearMarkers();

      const validStories = stories.filter(
        (story) =>
          story.lat &&
          story.lon &&
          !isNaN(parseFloat(story.lat)) &&
          !isNaN(parseFloat(story.lon))
      );

      console.log(`Menambahkan ${validStories.length} markers ke map`);

      validStories.forEach((story, index) => {
        try {
          const lat = parseFloat(story.lat);
          const lon = parseFloat(story.lon);

          const marker = L.marker([lat, lon]).addTo(this.map);

          marker.bindPopup(`
            <div class="popup-content">
              <img src="${story.photoUrl}" alt="Story by ${
            story.name
          }" style="width: 200px; height: 150px; object-fit: cover; border-radius: 4px;">
              <h4 style="margin: 10px 0 5px 0;">${story.name}</h4>
              <p style="margin: 5px 0;">${story.description}</p>
              <small style="color: #666;">${showFormattedDate(
                story.createdAt,
                "id-ID"
              )}</small>
            </div>
          `);

          this.markers.push(marker);
        } catch (markerError) {
          console.warn(`Error adding marker ${index}:`, markerError);
        }
      });

      // Fit map bounds jika ada markers
      if (this.markers.length > 0) {
        try {
          const group = new L.featureGroup(this.markers);
          this.map.fitBounds(group.getBounds().pad(0.1));
        } catch (boundsError) {
          console.warn("Error fitting bounds:", boundsError);
        }
      }
    } catch (error) {
      console.error("Error adding markers:", error);
    }
  }

  clearMarkers() {
    this.markers.forEach((marker) => {
      try {
        if (this.map && marker) {
          this.map.removeLayer(marker);
        }
      } catch (error) {
        // Ignore cleanup errors
      }
    });
    this.markers = [];
  }

  // PERBAIKAN: Force cleanup untuk map yang stuck
  forceCleanupMap() {
    console.log("Force cleanup map...");

    // Clear timeout
    if (this.mapInitTimeout) {
      clearTimeout(this.mapInitTimeout);
      this.mapInitTimeout = null;
    }

    // Clear markers
    this.clearMarkers();

    // Force remove map
    if (this.map) {
      try {
        this.map.off();
        this.map.remove();
      } catch (error) {
        console.warn("Error force removing map:", error);
      }
      this.map = null;
    }

    // Reset container
    this.resetMapContainer();

    this.mapInitialized = false;
    this.mapInitializationInProgress = false;
    this.mapContainerId = null;
  }

  cleanupMap() {
    console.log("Cleaning up map...");

    // Cancel any pending initialization
    if (this.mapInitTimeout) {
      clearTimeout(this.mapInitTimeout);
      this.mapInitTimeout = null;
    }

    this.mapInitializationInProgress = false;

    // Clear markers
    this.clearMarkers();

    // Remove map
    if (this.map) {
      try {
        this.map.off();
        this.map.remove();
      } catch (error) {
        console.warn("Error cleaning up map:", error);
      }
      this.map = null;
    }

    // Reset container state
    this.resetMapContainer();

    this.mapInitialized = false;
    this.mapContainerId = null;
  }

  // Method untuk menampilkan error map
  showMapError() {
    const mapContainer = document.getElementById("map-container");
    if (mapContainer) {
      mapContainer.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 400px; background: #f8f9fa; border-radius: 8px; color: #666; flex-direction: column;">
          <p style="margin: 0;">🗺️ Map tidak dapat dimuat</p>
          <small style="margin-top: 5px;">Coba refresh halaman</small>
        </div>
      `;
    }
  }

  showLoading() {
    const container = document.getElementById("stories-container");
    if (container) {
      container.innerHTML = `
        <div class="loading-container" role="status" aria-live="polite">
          <div class="loading-spinner"></div>
          <p>Memuat stories...</p>
        </div>
      `;
    }
  }

  showError(message) {
    const container = document.getElementById("stories-container");
    if (container) {
      container.innerHTML = `
        <div class="error-container" role="alert">
          <h3>Terjadi Kesalahan</h3>
          <p>${message}</p>
          <button id="retry-button" class="retry-button btn btn-primary">Coba Lagi</button>
        </div>
      `;
    }
  }

  showEmpty() {
    const container = document.getElementById("stories-container");
    if (container) {
      container.innerHTML = `
        <div class="empty-container">
          <h3>Belum Ada Stories</h3>
          <p>Jadilah yang pertama membagikan story!</p>
          <a href="#/add" class="add-story-button btn btn-primary">Tambah Story</a>
        </div>
      `;
    }
  }

  destroy() {
    console.log("Destroying StoriesView");
    this.forceCleanupMap();
  }
}
