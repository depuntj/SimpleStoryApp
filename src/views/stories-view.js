import CONFIG from "../scripts/config.js";

export class StoriesView {
  constructor() {
    this.map = null;
    this.markers = [];
    this.currentFilter = "all";
    this.currentView = "grid";
    this.isMapReady = false;

    // Callback registry untuk komunikasi dengan Presenter
    this.callbacks = {
      onRetryRequested: null,
      onRefreshRequested: null,
      onStoryDetailRequested: null,
      onLocationFocusRequested: null,
      onStoryLiked: null,
      onStoryShared: null,
      onFilterChanged: null,
      onViewModeChanged: null,
      onMapCenterRequested: null,
      onMapFullscreenToggled: null,
    };
  }

  // === CALLBACK REGISTRATION METHODS ===
  onRetryRequested(callback) {
    this.callbacks.onRetryRequested = callback;
  }

  onRefreshRequested(callback) {
    this.callbacks.onRefreshRequested = callback;
  }

  onStoryDetailRequested(callback) {
    this.callbacks.onStoryDetailRequested = callback;
  }

  onLocationFocusRequested(callback) {
    this.callbacks.onLocationFocusRequested = callback;
  }

  onStoryLiked(callback) {
    this.callbacks.onStoryLiked = callback;
  }

  onStoryShared(callback) {
    this.callbacks.onStoryShared = callback;
  }

  onFilterChanged(callback) {
    this.callbacks.onFilterChanged = callback;
  }

  onViewModeChanged(callback) {
    this.callbacks.onViewModeChanged = callback;
  }

  onMapCenterRequested(callback) {
    this.callbacks.onMapCenterRequested = callback;
  }

  onMapFullscreenToggled(callback) {
    this.callbacks.onMapFullscreenToggled = callback;
  }

  // === RENDER METHOD ===
  render() {
    return `
      <div class="stories-page">
        <div class="stories-hero">
          <div class="hero-content">
            <h1 class="hero-title">
              <i class="fas fa-book-open" aria-hidden="true"></i>
              Dicoding Stories
            </h1>
            <p class="hero-subtitle">Jelajahi cerita inspiratif dari komunitas developer Indonesia</p>
          </div>
          <div class="hero-actions">
            <a href="#/add" class="btn-add-story" aria-label="Buat story baru">
              <i class="fas fa-plus"></i>
              <span>Buat Story</span>
            </a>
          </div>
        </div>

        <div class="stories-container">
          <div class="stories-toolbar">
            <div class="toolbar-left">
              <div class="view-switcher" role="group" aria-label="Mode tampilan">
                <button class="view-btn active" data-view="grid" aria-label="Tampilan grid">
                  <i class="fas fa-th"></i>
                </button>
                <button class="view-btn" data-view="list" aria-label="Tampilan list">
                  <i class="fas fa-list"></i>
                </button>
              </div>
              
              <div class="filter-tabs" role="group" aria-label="Filter stories">
                <button class="filter-tab active" data-filter="all">
                  <i class="fas fa-globe"></i>
                  <span>Semua</span>
                </button>
                <button class="filter-tab" data-filter="location">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>Berlokasi</span>
                </button>
              </div>
            </div>

            <div class="toolbar-right">
              <div class="stories-stats" id="stories-stats" aria-label="Statistik stories">
                <div class="stat-item">
                  <span class="stat-number" id="total-count">0</span>
                  <span class="stat-label">Stories</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number" id="location-count">0</span>
                  <span class="stat-label">Berlokasi</span>
                </div>
              </div>
            </div>
          </div>

          <div class="stories-content">
            <div class="stories-grid-container">
              <div id="stories-container" class="stories-grid" role="main" aria-label="Daftar stories">
                <!-- Stories akan dirender di sini -->
              </div>
            </div>

            <div class="stories-map-container">
              <div class="map-header">
                <h2>
                  <i class="fas fa-map"></i>
                  Peta Stories
                </h2>
                <div class="map-controls">
                  <button class="map-btn" id="center-map" title="Pusatkan peta" aria-label="Pusatkan peta">
                    <i class="fas fa-crosshairs"></i>
                  </button>
                  <button class="map-btn" id="fullscreen-map" title="Layar penuh" aria-label="Mode layar penuh">
                    <i class="fas fa-expand"></i>
                  </button>
                </div>
              </div>
              <div id="stories-map" class="stories-map" role="img" aria-label="Peta interaktif lokasi stories"></div>
              <div class="map-info" id="map-info">
                <i class="fas fa-info-circle"></i>
                <span>Klik marker untuk melihat detail story</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // === INITIALIZATION ===
  async afterRender() {
    try {
      this.setupUIEventHandlers();
      this.setupAccessibility();
      await this.initializeMap();
    } catch (error) {
      console.error("Error in StoriesView afterRender:", error);
      this.showInitializationError();
    }
  }

  setupUIEventHandlers() {
    this.setupViewSwitcher();
    this.setupFilterTabs();
    this.setupMapControls();
    this.setupRetryHandlers();
    this.setupKeyboardHandlers();
  }

  setupViewSwitcher() {
    const viewBtns = document.querySelectorAll(".view-btn");

    viewBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const view = btn.dataset.view;
        this.switchViewMode(view);

        if (this.callbacks.onViewModeChanged) {
          this.callbacks.onViewModeChanged(view);
        }
      });
    });
  }

  setupFilterTabs() {
    const filterTabs = document.querySelectorAll(".filter-tab");

    filterTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const filter = tab.dataset.filter;
        this.switchFilter(filter);

        if (this.callbacks.onFilterChanged) {
          this.callbacks.onFilterChanged(filter);
        }
      });
    });
  }

  setupMapControls() {
    const centerBtn = document.getElementById("center-map");
    const fullscreenBtn = document.getElementById("fullscreen-map");

    if (centerBtn) {
      centerBtn.addEventListener("click", () => {
        if (this.callbacks.onMapCenterRequested) {
          this.callbacks.onMapCenterRequested();
        }
      });
    }

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener("click", () => {
        this.toggleMapFullscreen();

        if (this.callbacks.onMapFullscreenToggled) {
          this.callbacks.onMapFullscreenToggled();
        }
      });
    }
  }

  setupRetryHandlers() {
    // Event delegation untuk retry buttons
    document.addEventListener("click", (event) => {
      if (
        event.target.matches(".btn-retry") ||
        event.target.closest(".btn-retry")
      ) {
        event.preventDefault();
        if (this.callbacks.onRetryRequested) {
          this.callbacks.onRetryRequested();
        }
      }
    });
  }

  setupKeyboardHandlers() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeAnyModal();
      }

      if (e.key === "F5" || (e.ctrlKey && e.key === "r")) {
        e.preventDefault();
        if (this.callbacks.onRefreshRequested) {
          this.callbacks.onRefreshRequested();
        }
      }
    });
  }

  setupAccessibility() {
    // Setup ARIA attributes dan screen reader support
    const container = document.getElementById("stories-container");
    if (container) {
      container.setAttribute("aria-live", "polite");
      container.setAttribute("aria-busy", "false");
    }
  }

  // === UI STATE MANAGEMENT ===
  switchViewMode(viewMode) {
    this.currentView = viewMode;

    const viewBtns = document.querySelectorAll(".view-btn");
    const container = document.getElementById("stories-container");

    viewBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === viewMode);
    });

    if (container) {
      container.className = `stories-${viewMode}`;
    }

    this.announceToScreenReader(`Tampilan diubah ke mode ${viewMode}`);
  }

  switchFilter(filter) {
    this.currentFilter = filter;

    const filterTabs = document.querySelectorAll(".filter-tab");
    filterTabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.filter === filter);
    });

    this.announceToScreenReader(`Filter diubah ke ${filter}`);
  }

  // === RENDERING METHODS ===
  renderStoriesList(storiesData) {
    console.log("🎨 Rendering stories list:", storiesData.length);

    const container = document.getElementById("stories-container");
    if (!container) {
      console.error("❌ Stories container not found");
      return;
    }

    if (!Array.isArray(storiesData) || storiesData.length === 0) {
      this.showEmptyState();
      return;
    }

    try {
      const cardsHTML = storiesData
        .map((story, index) => this.createStoryCard(story, index))
        .join("");

      container.innerHTML = cardsHTML;
      this.setupStoriesInteraction();
      this.updateStats(storiesData);

      this.announceToScreenReader(
        `${storiesData.length} stories berhasil dimuat`
      );
      console.log(`🎉 Successfully rendered ${storiesData.length} stories`);
    } catch (error) {
      console.error("❌ Error rendering stories:", error);
      this.showRenderError();
    }
  }

  createStoryCard(story, index) {
    const hasLocation = !!(story.lat && story.lon);
    const storyName = story.name || "Anonymous User";
    const storyDescription =
      story.description || "Tidak ada deskripsi tersedia.";
    const photoUrl = story.photoUrl || "";

    const truncatedDesc =
      storyDescription.length > 120
        ? storyDescription.substring(0, 120) + "..."
        : storyDescription;

    return `
      <article class="story-card ${hasLocation ? "has-location" : ""}" 
               data-story-id="${story.id}"
               tabindex="0"
               role="article"
               aria-labelledby="story-author-${index}"
               aria-describedby="story-desc-${index}">
        
        <div class="story-image">
          <img src="${photoUrl}" 
               alt="Foto story dari ${storyName}: ${storyDescription.substring(
      0,
      50
    )}..." 
               loading="lazy"
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="image-placeholder" style="display: none;">
            <i class="fas fa-image"></i>
            <span>Gambar tidak tersedia</span>
          </div>
          
          <div class="story-overlay">
            <button class="story-action view-btn" aria-label="Lihat detail story" data-action="view">
              <i class="fas fa-eye"></i>
            </button>
            ${
              hasLocation
                ? `
              <button class="story-action location-btn" aria-label="Lihat di peta" data-action="location">
                <i class="fas fa-map-marker-alt"></i>
              </button>
            `
                : ""
            }
          </div>
        </div>
  
        <div class="story-content">
          <div class="story-header">
            <div class="author-info">
              <div class="author-avatar" title="${storyName}">
                <span class="avatar-text">${storyName
                  .charAt(0)
                  .toUpperCase()}</span>
              </div>
              <div class="author-details">
                <h3 class="author-name" id="story-author-${index}" title="${storyName}">
                  ${storyName}
                </h3>
                <time class="story-date" datetime="${
                  story.createdAt
                }" title="${this.formatDate(story.createdAt)}">
                  ${this.formatRelativeTime(story.createdAt)}
                </time>
              </div>
            </div>
            
            <div class="story-actions">
              <button class="action-btn like-btn" aria-label="Suka story" data-action="like" data-liked="false">
                <i class="far fa-heart"></i>
              </button>
              <button class="action-btn share-btn" aria-label="Bagikan story" data-action="share">
                <i class="fas fa-share-alt"></i>
              </button>
            </div>
          </div>
  
          <p class="story-description" id="story-desc-${index}" title="${storyDescription}">
            ${truncatedDesc}
          </p>
  
          <div class="story-footer">
            ${
              hasLocation
                ? `
              <div class="story-location">
                <i class="fas fa-map-pin"></i>
                <span>Lokasi tersedia</span>
              </div>
            `
                : `
              <div class="story-no-location">
                <i class="fas fa-map-pin"></i>
                <span>Tanpa lokasi</span>
              </div>
            `
            }
          </div>
        </div>
      </article>
    `;
  }

  setupStoriesInteraction() {
    const container = document.getElementById("stories-container");
    if (!container) return;

    // Single event listener dengan delegation
    container.addEventListener("click", (e) => {
      this.handleStoryInteraction(e);
    });

    container.addEventListener("keydown", (e) => {
      this.handleStoryKeyboardInteraction(e);
    });
  }

  handleStoryInteraction(e) {
    const storyCard = e.target.closest(".story-card");
    if (!storyCard) return;

    const storyId = storyCard.dataset.storyId;
    const action = e.target.closest("[data-action]")?.dataset.action;

    e.stopPropagation();

    switch (action) {
      case "view":
        this.triggerStoryDetailRequest(storyId);
        break;
      case "location":
        this.triggerLocationFocusRequest(storyId);
        break;
      case "like":
        this.handleLikeInteraction(e.target.closest(".like-btn"));
        this.triggerStoryLikeRequest(storyId);
        break;
      case "share":
        this.triggerStoryShareRequest(storyId);
        break;
      default:
        // Click pada card area (bukan pada action buttons)
        if (
          !e.target.closest(".story-overlay") &&
          !e.target.closest(".story-actions")
        ) {
          this.triggerStoryDetailRequest(storyId);
        }
    }
  }

  handleStoryKeyboardInteraction(e) {
    if (e.key === "Enter" || e.key === " ") {
      const storyCard = e.target.closest(".story-card");
      if (storyCard) {
        e.preventDefault();
        const storyId = storyCard.dataset.storyId;
        this.triggerStoryDetailRequest(storyId);
      }
    }
  }

  // === CALLBACK TRIGGER METHODS ===
  triggerStoryDetailRequest(storyId) {
    if (this.callbacks.onStoryDetailRequested) {
      this.callbacks.onStoryDetailRequested(storyId);
    }
  }

  triggerLocationFocusRequest(storyId) {
    if (this.callbacks.onLocationFocusRequested) {
      this.callbacks.onLocationFocusRequested(storyId);
    }
  }

  triggerStoryLikeRequest(storyId) {
    if (this.callbacks.onStoryLiked) {
      this.callbacks.onStoryLiked(storyId);
    }
  }

  triggerStoryShareRequest(storyId) {
    if (this.callbacks.onStoryShared) {
      this.callbacks.onStoryShared(storyId);
    }
  }

  // === UI INTERACTION METHODS ===
  handleLikeInteraction(btn) {
    if (!btn) return;

    const icon = btn.querySelector("i");
    const isLiked = btn.dataset.liked === "true";

    if (isLiked) {
      icon.className = "far fa-heart";
      btn.dataset.liked = "false";
      btn.classList.remove("liked");
    } else {
      icon.className = "fas fa-heart";
      btn.dataset.liked = "true";
      btn.classList.add("liked");
    }

    // Visual feedback
    btn.style.transform = "scale(1.2)";
    setTimeout(() => (btn.style.transform = ""), 200);
  }

  // === MAP METHODS ===
  async initializeMap() {
    try {
      const mapContainer = document.getElementById("stories-map");
      if (!mapContainer || typeof L === "undefined") {
        this.showMapError();
        return;
      }

      this.map = L.map("stories-map", {
        zoomControl: false,
        attributionControl: false,
      }).setView([CONFIG.DEFAULT_LOCATION.lat, CONFIG.DEFAULT_LOCATION.lng], 6);

      L.control.zoom({ position: "bottomright" }).addTo(this.map);
      L.control
        .attribution({ position: "bottomleft", prefix: false })
        .addTo(this.map);

      const tileLayer = L.tileLayer(CONFIG.MAP_TILES.openstreetmap.url, {
        attribution: CONFIG.MAP_TILES.openstreetmap.attribution,
        maxZoom: 18,
      });

      tileLayer.addTo(this.map);
      this.isMapReady = true;

      this.announceToScreenReader("Peta berhasil dimuat");
    } catch (error) {
      console.error("Error initializing map:", error);
      this.showMapError();
    }
  }

  addMarkersToMap(storiesData) {
    if (!this.isMapReady || !Array.isArray(storiesData)) return;

    this.clearMarkers();

    const storiesWithLocation = storiesData.filter((s) => s.lat && s.lon);

    storiesWithLocation.forEach((story) => {
      const marker = L.marker([story.lat, story.lon], {
        icon: this.createMapMarkerIcon(),
      }).addTo(this.map);

      marker.bindPopup(this.createMapPopupContent(story));
      this.markers.push(marker);
    });

    if (this.markers.length > 0) {
      const group = new L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  createMapMarkerIcon() {
    return L.divIcon({
      className: "custom-marker",
      html: '<div class="marker-dot"><i class="fas fa-camera"></i></div>',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  }

  createMapPopupContent(story) {
    return `
      <div class="map-popup">
        <img src="${story.photoUrl}" alt="Story ${
      story.name
    }" class="popup-image">
        <div class="popup-content">
          <h4>${story.name}</h4>
          <p>${story.description.substring(0, 80)}...</p>
          <small>${this.formatRelativeTime(story.createdAt)}</small>
        </div>
      </div>
    `;
  }

  centerMapToMarkers() {
    if (this.markers.length > 0) {
      const group = new L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  toggleMapFullscreen() {
    const container = document.querySelector(".stories-map-container");
    const btn = document.getElementById("fullscreen-map");
    const icon = btn?.querySelector("i");

    if (container?.classList.contains("fullscreen")) {
      container.classList.remove("fullscreen");
      if (icon) icon.className = "fas fa-expand";
      document.body.style.overflow = "";
    } else {
      container?.classList.add("fullscreen");
      if (icon) icon.className = "fas fa-compress";
      document.body.style.overflow = "hidden";
    }

    setTimeout(() => {
      if (this.map) this.map.invalidateSize();
    }, 300);
  }

  clearMarkers() {
    this.markers.forEach((marker) => {
      if (this.map) this.map.removeLayer(marker);
    });
    this.markers = [];
  }

  // === STATE DISPLAY METHODS ===
  showLoadingState() {
    const container = document.getElementById("stories-container");
    if (container) {
      container.setAttribute("aria-busy", "true");
      container.innerHTML = `
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <p>Memuat stories...</p>
        </div>
      `;
    }
  }

  showEmptyState() {
    const container = document.getElementById("stories-container");
    if (container) {
      container.setAttribute("aria-busy", "false");
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-images"></i>
          <h3>Belum Ada Stories</h3>
          <p>Jadilah yang pertama berbagi cerita!</p>
          <a href="#/add" class="btn-add-first">
            <i class="fas fa-plus"></i>
            Buat Story Pertama
          </a>
        </div>
      `;
    }
  }

  showErrorState(message) {
    const container = document.getElementById("stories-container");
    if (container) {
      container.setAttribute("aria-busy", "false");
      container.innerHTML = `
        <div class="error-state">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Terjadi Kesalahan</h3>
          <p>${message}</p>
          <button class="btn-retry" type="button">
            <i class="fas fa-redo"></i>
            Coba Lagi
          </button>
        </div>
      `;
    }
  }

  showRenderError() {
    this.showErrorState("Gagal menampilkan stories. Silakan coba lagi.");
  }

  showInitializationError() {
    this.showErrorState("Gagal memuat halaman. Silakan refresh halaman.");
  }

  showMapError() {
    const mapContainer = document.getElementById("stories-map");
    if (mapContainer) {
      mapContainer.innerHTML = `
        <div class="map-error">
          <i class="fas fa-map"></i>
          <p>Peta tidak dapat dimuat</p>
        </div>
      `;
    }
  }

  // === UTILITY METHODS ===
  updateStats(storiesData) {
    const totalCount = document.getElementById("total-count");
    const locationCount = document.getElementById("location-count");

    if (totalCount) {
      this.animateNumber(totalCount, storiesData.length);
    }

    if (locationCount) {
      const withLocation = storiesData.filter((s) => s.lat && s.lon).length;
      this.animateNumber(locationCount, withLocation);
    }
  }

  animateNumber(element, target) {
    let current = 0;
    const increment = Math.max(1, Math.ceil(target / 20));

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = current;
      }
    }, 50);
  }

  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  }

  formatRelativeTime(dateString) {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);

      if (diffInSeconds < 60) return "Baru saja";
      if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)} menit lalu`;
      if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
      if (diffInSeconds < 604800)
        return `${Math.floor(diffInSeconds / 86400)} hari lalu`;

      return this.formatDate(dateString);
    } catch (error) {
      return dateString;
    }
  }

  closeAnyModal() {
    const modal = document.querySelector(".story-modal");
    if (modal) {
      const closeBtn = modal.querySelector(".modal-close");
      if (closeBtn) closeBtn.click();
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

  // === CLEANUP ===
  destroy() {
    this.clearMarkers();
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.isMapReady = false;
  }
}
