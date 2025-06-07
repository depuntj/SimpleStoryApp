import { showFormattedDate } from "../scripts/utils/index.js";
import CONFIG from "../scripts/config.js";

export class StoriesView {
  constructor() {
    this.map = null;
    this.markers = [];
    this.mapInitialized = false;
    this.mapInitializationInProgress = false;
    this.mapContainerId = null;
    this.currentViewMode = "grid";
    this.storiesData = [];
  }

  render() {
    return `
      <section class="stories-page">
        <div class="container">
          <header class="page-header">
            <div class="header-content">
              <h1>
                <i class="fas fa-book-open"></i>
                Dicoding Stories
              </h1>
              <p>Kumpulan cerita dari komunitas Dicoding</p>
            </div>
            
            <div class="header-actions">
              <div class="view-toggle">
                <button id="grid-view" class="view-btn active" aria-label="Tampilan grid">
                  <i class="fas fa-th"></i>
                </button>
                <button id="list-view" class="view-btn" aria-label="Tampilan list">
                  <i class="fas fa-list"></i>
                </button>
              </div>
              
              <a href="#/add" class="add-story-fab" aria-label="Tambah story baru">
                <i class="fas fa-plus"></i>
                <span>Tambah Story</span>
              </a>
            </div>
          </header>
          
          <div class="stories-stats" id="stories-stats" style="display: none;">
            <div class="stat-item">
              <i class="fas fa-images"></i>
              <div>
                <span class="stat-number" id="total-stories">0</span>
                <span class="stat-label">Total Stories</span>
              </div>
            </div>
            <div class="stat-item">
              <i class="fas fa-map-marker-alt"></i>
              <div>
                <span class="stat-number" id="stories-with-location">0</span>
                <span class="stat-label">Dengan Lokasi</span>
              </div>
            </div>
            <div class="stat-item">
              <i class="fas fa-users"></i>
              <div>
                <span class="stat-number" id="unique-authors">0</span>
                <span class="stat-label">Kontributor</span>
              </div>
            </div>
          </div>
          
          <div class="stories-content">
            <div class="stories-section">
              <div class="section-header">
                <h2>
                  <i class="fas fa-images"></i>
                  Stories Terbaru
                </h2>
                <div class="filter-controls">
                  <button id="filter-all" class="filter-btn active">
                    <i class="fas fa-globe"></i>
                    Semua
                  </button>
                  <button id="filter-location" class="filter-btn">
                    <i class="fas fa-map-marker-alt"></i>
                    Dengan Lokasi
                  </button>
                </div>
              </div>
              
              <div id="stories-container" class="stories-list grid-view" role="main">
                <!-- Stories akan dimuat di sini -->
              </div>
            </div>
            
            <div class="map-section">
              <div class="section-header">
                <h2>
                  <i class="fas fa-map"></i>
                  Peta Lokasi Stories
                </h2>
                <div class="map-controls">
                  <button id="center-map" class="map-control-btn" title="Pusatkan peta">
                    <i class="fas fa-crosshairs"></i>
                  </button>
                  <button id="fullscreen-map" class="map-control-btn" title="Layar penuh">
                    <i class="fas fa-expand"></i>
                  </button>
                </div>
              </div>
              
              <div class="map-container">
                <div id="map-container" class="location-map"></div>
                <div class="map-info" id="map-info">
                  <i class="fas fa-info-circle"></i>
                  <span>Klik marker untuk melihat detail story</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  afterRender() {
    this.setupViewToggle();
    this.setupFilters();
    this.setupMapControls();
  }

  setupViewToggle() {
    const gridBtn = document.getElementById("grid-view");
    const listBtn = document.getElementById("list-view");
    const container = document.getElementById("stories-container");

    gridBtn.addEventListener("click", () => {
      this.currentViewMode = "grid";
      container.className = "stories-list grid-view";
      gridBtn.classList.add("active");
      listBtn.classList.remove("active");
    });

    listBtn.addEventListener("click", () => {
      this.currentViewMode = "list";
      container.className = "stories-list list-view";
      listBtn.classList.add("active");
      gridBtn.classList.remove("active");
    });
  }

  setupFilters() {
    const allBtn = document.getElementById("filter-all");
    const locationBtn = document.getElementById("filter-location");

    allBtn.addEventListener("click", () => {
      this.filterStories("all");
      allBtn.classList.add("active");
      locationBtn.classList.remove("active");
    });

    locationBtn.addEventListener("click", () => {
      this.filterStories("location");
      locationBtn.classList.add("active");
      allBtn.classList.remove("active");
    });
  }

  setupMapControls() {
    const centerBtn = document.getElementById("center-map");
    const fullscreenBtn = document.getElementById("fullscreen-map");

    centerBtn.addEventListener("click", () => {
      if (this.map && this.markers.length > 0) {
        const group = new L.featureGroup(this.markers);
        this.map.fitBounds(group.getBounds().pad(0.1));
      }
    });

    fullscreenBtn.addEventListener("click", () => {
      this.toggleMapFullscreen();
    });
  }

  filterStories(type) {
    const stories = document.querySelectorAll(".story-card");

    stories.forEach((story) => {
      const hasLocation = story.querySelector(".story-location");

      if (type === "all") {
        story.style.display = "block";
      } else if (type === "location") {
        story.style.display = hasLocation ? "block" : "none";
      }
    });

    this.updateVisibleCount();
  }

  updateVisibleCount() {
    const visible = document.querySelectorAll(
      '.story-card[style*="block"], .story-card:not([style])'
    ).length;
    const mapInfo = document.getElementById("map-info");
    if (mapInfo && visible > 0) {
      mapInfo.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>Menampilkan ${visible} stories</span>
      `;
    }
  }

  renderStoriesList(stories) {
    const container = document.getElementById("stories-container");
    const statsContainer = document.getElementById("stories-stats");

    if (!container) {
      console.error("Stories container not found");
      return;
    }

    this.storiesData = stories;
    this.updateStats(stories);

    if (statsContainer) {
      statsContainer.style.display = "grid";
    }

    container.innerHTML = stories
      .map((story) => this.renderStoryCard(story))
      .join("");

    this.scheduleMapInitialization(stories);
    this.setupStoryInteractions();
  }

  renderStoryCard(story) {
    const hasLocation = story.lat && story.lon;

    return `
      <article class="story-card ${hasLocation ? "has-location" : ""}" 
               tabindex="0" 
               role="article"
               data-story-id="${story.id}">
        <div class="story-image">
          <img src="${story.photoUrl}" 
               alt="Story by ${story.name}" 
               loading="lazy"
               onerror="this.src='data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 400 300\"><rect width=\"100%\" height=\"100%\" fill=\"%23f3f4f6\"/><text x=\"50%\" y=\"50%\" text-anchor=\"middle\" fill=\"%23d1d5db\" font-family=\"Arial\">No Image</text></svg>'">
          <div class="story-overlay">
            <button class="story-action" aria-label="Lihat detail">
              <i class="fas fa-eye"></i>
            </button>
            ${
              hasLocation
                ? `
              <button class="story-location-btn" aria-label="Lihat di peta">
                <i class="fas fa-map-marker-alt"></i>
              </button>
            `
                : ""
            }
          </div>
        </div>
        
        <div class="story-content">
          <div class="story-header">
            <h3 class="story-author">
              <i class="fas fa-user-circle"></i>
              ${story.name}
            </h3>
            <time class="story-date" datetime="${story.createdAt}">
              <i class="fas fa-calendar-alt"></i>
              ${showFormattedDate(story.createdAt, "id-ID")}
            </time>
          </div>
          
          <p class="story-description">${story.description}</p>
          
          <div class="story-footer">
            ${
              hasLocation
                ? `
              <div class="story-location">
                <i class="fas fa-map-pin"></i>
                <span class="location-coords">
                  ${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}
                </span>
              </div>
            `
                : `
              <div class="story-no-location">
                <i class="fas fa-globe"></i>
                <span>Lokasi tidak tersedia</span>
              </div>
            `
            }
            
            <div class="story-actions">
              <button class="action-btn like-btn" aria-label="Suka story ini">
                <i class="far fa-heart"></i>
              </button>
              <button class="action-btn share-btn" aria-label="Bagikan story">
                <i class="fas fa-share-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  setupStoryInteractions() {
    document.querySelectorAll(".story-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (
          !e.target.closest(".story-actions") &&
          !e.target.closest(".story-overlay")
        ) {
          this.showStoryDetail(card.dataset.storyId);
        }
      });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.showStoryDetail(card.dataset.storyId);
        }
      });
    });

    document.querySelectorAll(".story-location-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const card = e.target.closest(".story-card");
        this.focusStoryOnMap(card.dataset.storyId);
      });
    });

    document.querySelectorAll(".like-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleLike(btn);
      });
    });

    document.querySelectorAll(".share-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.shareStory(btn.closest(".story-card").dataset.storyId);
      });
    });
  }

  showStoryDetail(storyId) {
    const story = this.storiesData.find((s) => s.id === storyId);
    if (!story) return;

    const modal = document.createElement("div");
    modal.className = "story-modal";
    modal.innerHTML = `
      <div class="modal-backdrop" role="dialog" aria-labelledby="modal-title" aria-modal="true">
        <div class="modal-content">
          <header class="modal-header">
            <h2 id="modal-title">
              <i class="fas fa-user-circle"></i>
              ${story.name}
            </h2>
            <button class="modal-close" aria-label="Tutup">
              <i class="fas fa-times"></i>
            </button>
          </header>
          
          <div class="modal-body">
            <img src="${story.photoUrl}" alt="Story by ${
      story.name
    }" class="modal-image">
            
            <div class="modal-info">
              <p class="modal-description">${story.description}</p>
              
              <div class="modal-meta">
                <div class="meta-item">
                  <i class="fas fa-calendar-alt"></i>
                  <span>${showFormattedDate(story.createdAt, "id-ID")}</span>
                </div>
                ${
                  story.lat && story.lon
                    ? `
                  <div class="meta-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${story.lat.toFixed(6)}, ${story.lon.toFixed(
                        6
                      )}</span>
                  </div>
                `
                    : ""
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".modal-close").addEventListener("click", () => {
      modal.remove();
    });

    modal.querySelector(".modal-backdrop").addEventListener("click", (e) => {
      if (e.target === e.currentTarget) {
        modal.remove();
      }
    });

    document.addEventListener("keydown", function closeOnEscape(e) {
      if (e.key === "Escape") {
        modal.remove();
        document.removeEventListener("keydown", closeOnEscape);
      }
    });

    modal.querySelector(".modal-close").focus();
  }

  focusStoryOnMap(storyId) {
    const story = this.storiesData.find((s) => s.id === storyId);
    if (!story || !story.lat || !story.lon || !this.map) return;

    this.map.setView([story.lat, story.lon], 15);

    const marker = this.markers.find((m) => {
      const pos = m.getLatLng();
      return (
        Math.abs(pos.lat - story.lat) < 0.0001 &&
        Math.abs(pos.lng - story.lon) < 0.0001
      );
    });

    if (marker) {
      marker.openPopup();
    }

    document.querySelector(".map-section").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  toggleLike(btn) {
    const icon = btn.querySelector("i");
    const isLiked = icon.classList.contains("fas");

    if (isLiked) {
      icon.className = "far fa-heart";
      btn.classList.remove("liked");
    } else {
      icon.className = "fas fa-heart";
      btn.classList.add("liked");
    }

    btn.style.transform = "scale(1.2)";
    setTimeout(() => {
      btn.style.transform = "";
    }, 150);
  }

  shareStory(storyId) {
    const story = this.storiesData.find((s) => s.id === storyId);
    if (!story) return;

    if (navigator.share) {
      navigator.share({
        title: `Story by ${story.name}`,
        text: story.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        if (typeof window.showToast === "function") {
          window.showToast("Link disalin ke clipboard", "success");
        }
      });
    }
  }

  updateStats(stories) {
    const totalStories = stories.length;
    const storiesWithLocation = stories.filter((s) => s.lat && s.lon).length;
    const uniqueAuthors = new Set(stories.map((s) => s.name)).size;

    this.animateNumber("total-stories", totalStories);
    this.animateNumber("stories-with-location", storiesWithLocation);
    this.animateNumber("unique-authors", uniqueAuthors);
  }

  animateNumber(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let currentValue = 0;
    const increment = Math.ceil(targetValue / 20);
    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= targetValue) {
        currentValue = targetValue;
        clearInterval(timer);
      }
      element.textContent = currentValue;
    }, 50);
  }

  scheduleMapInitialization(stories) {
    if (this.mapInitTimeout) {
      clearTimeout(this.mapInitTimeout);
    }

    this.mapInitTimeout = setTimeout(() => {
      this.safeInitializeMap(stories);
    }, 1000);
  }

  safeInitializeMap(stories) {
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

      if (mapContainer._leaflet_id) {
        console.log("Map container sudah memiliki map, cleanup dulu...");
        this.forceCleanupMap();
      }

      if (typeof L === "undefined") {
        console.error("Leaflet library belum dimuat");
        this.showMapError();
        this.mapInitializationInProgress = false;
        return;
      }

      console.log("Initializing map...");
      this.resetMapContainer();

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
      console.log("Map berhasil diinisialisasi");

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

  addMarkersToMap(stories) {
    if (!this.map || !this.mapInitialized) {
      console.warn("Map belum ready untuk markers");
      return;
    }

    try {
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

          const customIcon = L.divIcon({
            className: "custom-marker",
            html: `<div class="marker-pin">
                     <i class="fas fa-map-marker-alt"></i>
                   </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
          });

          const marker = L.marker([lat, lon], { icon: customIcon }).addTo(
            this.map
          );

          marker.bindPopup(
            `
            <div class="popup-content">
              <img src="${story.photoUrl}" alt="Story by ${
              story.name
            }" class="popup-image">
              <div class="popup-info">
                <h4 class="popup-author">
                  <i class="fas fa-user-circle"></i>
                  ${story.name}
                </h4>
                <p class="popup-description">${story.description}</p>
                <small class="popup-date">
                  <i class="fas fa-calendar-alt"></i>
                  ${showFormattedDate(story.createdAt, "id-ID")}
                </small>
              </div>
            </div>
          `,
            {
              maxWidth: 300,
              className: "custom-popup",
            }
          );

          this.markers.push(marker);
        } catch (markerError) {
          console.warn(`Error adding marker ${index}:`, markerError);
        }
      });

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

  toggleMapFullscreen() {
    const mapSection = document.querySelector(".map-section");
    const btn = document.getElementById("fullscreen-map");
    const icon = btn.querySelector("i");

    if (mapSection.classList.contains("fullscreen")) {
      mapSection.classList.remove("fullscreen");
      icon.className = "fas fa-expand";
      btn.title = "Layar penuh";
    } else {
      mapSection.classList.add("fullscreen");
      icon.className = "fas fa-compress";
      btn.title = "Keluar dari layar penuh";
    }

    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 300);
  }

  resetMapContainer() {
    const mapContainer = document.getElementById("map-container");
    if (!mapContainer) return;

    delete mapContainer._leaflet_id;
    mapContainer.innerHTML = "";

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

    mapContainer.style.position = "";
    mapContainer.removeAttribute("tabindex");
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

  forceCleanupMap() {
    console.log("Force cleanup map...");

    if (this.mapInitTimeout) {
      clearTimeout(this.mapInitTimeout);
      this.mapInitTimeout = null;
    }

    this.clearMarkers();

    if (this.map) {
      try {
        this.map.off();
        this.map.remove();
      } catch (error) {
        console.warn("Error force removing map:", error);
      }
      this.map = null;
    }

    this.resetMapContainer();
    this.mapInitialized = false;
    this.mapInitializationInProgress = false;
  }

  showMapError() {
    const mapContainer = document.getElementById("map-container");
    if (mapContainer) {
      mapContainer.innerHTML = `
        <div class="map-error">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Map tidak dapat dimuat</h3>
          <p>Terjadi kesalahan saat memuat peta</p>
          <button onclick="window.location.reload()" class="retry-btn">
            <i class="fas fa-redo"></i>
            Coba Lagi
          </button>
        </div>
      `;
    }
  }

  showLoading() {
    const container = document.getElementById("stories-container");
    if (container) {
      container.innerHTML = `
        <div class="loading-container" role="status" aria-live="polite">
          <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
          </div>
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
          <i class="fas fa-exclamation-circle"></i>
          <h3>Terjadi Kesalahan</h3>
          <p>${message}</p>
          <button id="retry-button" class="retry-button btn btn-primary">
            <i class="fas fa-redo"></i>
            Coba Lagi
          </button>
        </div>
      `;
    }
  }

  showEmpty() {
    const container = document.getElementById("stories-container");
    if (container) {
      container.innerHTML = `
        <div class="empty-container">
          <i class="fas fa-images"></i>
          <h3>Belum Ada Stories</h3>
          <p>Jadilah yang pertama membagikan story!</p>
          <a href="#/add" class="add-story-button btn btn-primary">
            <i class="fas fa-plus"></i>
            Tambah Story
          </a>
        </div>
      `;
    }
  }

  destroy() {
    console.log("Destroying StoriesView");
    this.forceCleanupMap();
  }
}
