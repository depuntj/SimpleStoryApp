import { showFormattedDate } from "../scripts/utils/index.js";
import CONFIG from "../scripts/config.js";

export class StoriesView {
  constructor() {
    this.map = null;
    this.markers = [];
    this.mapContainerInitialized = false;
  }

  renderStoriesList(stories) {
    const container = document.getElementById("stories-container");

    if (!container) {
      console.error("Stories container not found");
      return;
    }

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

    // Initialize map after rendering stories
    this.initializeMap(stories);
  }

  initializeMap(stories) {
    // Clean up existing map first
    this.cleanupMap();

    const mapContainer = document.getElementById("map-container");
    if (!mapContainer) {
      console.error("Map container not found");
      return;
    }

    try {
      // Reset the container HTML to ensure clean state
      mapContainer.innerHTML = "";

      // Small delay to ensure DOM is ready
      setTimeout(() => {
        try {
          // Check if container is still in DOM and not already initialized
          if (!document.getElementById("map-container")) {
            console.log(
              "Map container removed from DOM, skipping initialization"
            );
            return;
          }

          // Create new map instance
          this.map = L.map("map-container", {
            zoomControl: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            dragging: true,
          }).setView(
            [CONFIG.DEFAULT_LOCATION.lat, CONFIG.DEFAULT_LOCATION.lng],
            10
          );

          // Add tile layer
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
            maxZoom: 19,
          }).addTo(this.map);

          this.mapContainerInitialized = true;

          // Add markers after map is fully initialized
          setTimeout(() => {
            this.addMarkersToMap(stories);
          }, 100);

          console.log("Map initialized successfully");
        } catch (mapError) {
          console.error("Error during map initialization:", mapError);
          this.mapContainerInitialized = false;
        }
      }, 50);
    } catch (error) {
      console.error("Error setting up map initialization:", error);
      this.mapContainerInitialized = false;
    }
  }

  addMarkersToMap(stories) {
    if (!this.map || !this.mapContainerInitialized) {
      console.log("Map not ready for markers");
      return;
    }

    try {
      // Clear existing markers first
      this.clearMarkers();

      const validStories = stories.filter(
        (story) =>
          story.lat &&
          story.lon &&
          !isNaN(story.lat) &&
          !isNaN(story.lon) &&
          story.lat >= -90 &&
          story.lat <= 90 &&
          story.lon >= -180 &&
          story.lon <= 180
      );

      console.log(`Adding ${validStories.length} markers to map`);

      validStories.forEach((story, index) => {
        try {
          const marker = L.marker([
            parseFloat(story.lat),
            parseFloat(story.lon),
          ]).addTo(this.map);

          marker.bindPopup(`
            <div class="popup-content">
              <img src="${story.photoUrl}" alt="Story by ${
            story.name
          }" class="popup-image" loading="lazy">
              <h4>${story.name}</h4>
              <p>${story.description}</p>
              <small>${showFormattedDate(story.createdAt, "id-ID")}</small>
            </div>
          `);

          this.markers.push(marker);
        } catch (markerError) {
          console.error(`Error adding marker ${index}:`, markerError);
        }
      });

      // Auto-fit map to show all markers if there are any
      if (this.markers.length > 0) {
        try {
          const group = new L.featureGroup(this.markers);
          this.map.fitBounds(group.getBounds().pad(0.1));
        } catch (boundsError) {
          console.error("Error fitting bounds:", boundsError);
        }
      }
    } catch (error) {
      console.error("Error adding markers to map:", error);
    }
  }

  clearMarkers() {
    if (this.markers && this.markers.length > 0) {
      this.markers.forEach((marker) => {
        try {
          if (this.map && marker) {
            this.map.removeLayer(marker);
          }
        } catch (error) {
          console.error("Error removing marker:", error);
        }
      });
    }
    this.markers = [];
  }

  cleanupMap() {
    try {
      // Clear markers first
      this.clearMarkers();

      // Remove map instance if it exists
      if (this.map) {
        console.log("Cleaning up existing map instance");
        this.map.off(); // Remove all event listeners
        this.map.remove(); // Properly destroy the map
        this.map = null;
      }

      this.mapContainerInitialized = false;

      // Reset container state
      const mapContainer = document.getElementById("map-container");
      if (mapContainer) {
        // Clear any Leaflet-specific attributes/classes
        mapContainer.className = "map-container";
        mapContainer.innerHTML = "";
        mapContainer.removeAttribute("data-leaflet-id");

        // Remove any Leaflet CSS classes that might interfere
        mapContainer.classList.remove(
          "leaflet-container",
          "leaflet-touch",
          "leaflet-retina",
          "leaflet-fade-anim",
          "leaflet-grab",
          "leaflet-touch-zoom",
          "leaflet-touch-drag"
        );
      }
    } catch (error) {
      console.error("Error during map cleanup:", error);
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
          <button id="retry-button" class="retry-button">Coba Lagi</button>
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
          <a href="#/add" class="add-story-button">Tambah Story</a>
        </div>
      `;
    }
  }

  // Cleanup method to be called when component is destroyed
  destroy() {
    console.log("Destroying StoriesView");
    this.cleanupMap();
  }
}
