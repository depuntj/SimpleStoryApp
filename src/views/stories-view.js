import { showFormattedDate } from "../scripts/utils/index.js";
import CONFIG from "../scripts/config.js";

export class StoriesView {
  constructor() {
    this.map = null;
    this.markers = [];
    this.storiesData = [];
    this.isMapReady = false;
    this.currentFilter = "all";
    this.currentView = "grid";
  }

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

  async afterRender() {
    try {
      this.setupEventHandlers();
      this.setupAccessibility();
      await this.initializeMap();
    } catch (error) {
      console.error("Error in StoriesView afterRender:", error);
    }
  }

  setupEventHandlers() {
    try {
      this.setupViewSwitcher();
      this.setupFilterTabs();
      this.setupMapControls();
    } catch (error) {
      console.warn("Error setting up event handlers:", error);
    }
  }

  setupViewSwitcher() {
    const viewBtns = document.querySelectorAll(".view-btn");
    const container = document.getElementById("stories-container");

    viewBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const view = btn.dataset.view;
        this.currentView = view;

        viewBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        container.className = `stories-${view}`;
        this.announceToScreenReader(`Tampilan diubah ke mode ${view}`);
      });
    });
  }

  setupFilterTabs() {
    const filterTabs = document.querySelectorAll(".filter-tab");

    filterTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const filter = tab.dataset.filter;
        this.currentFilter = filter;

        filterTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        this.applyFilter(filter);
      });
    });
  }

  setupMapControls() {
    const centerBtn = document.getElementById("center-map");
    const fullscreenBtn = document.getElementById("fullscreen-map");

    if (centerBtn) {
      centerBtn.addEventListener("click", () => this.centerMap());
    }

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener("click", () => this.toggleFullscreen());
    }
  }

  setupAccessibility() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeAnyModal();
      }
    });
  }

  async initializeMap() {
    try {
      const mapContainer = document.getElementById("stories-map");
      if (!mapContainer || typeof L === "undefined") return;

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

      this.map.on("load", () => {
        this.announceToScreenReader("Peta berhasil dimuat");
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      this.showMapError();
    }
  }

  renderStoriesList(stories) {
    console.log("🎨 Rendering stories list:", stories.length);

    this.storiesData = stories;
    this.updateStats(stories);

    const container = document.getElementById("stories-container");
    if (!container) {
      console.error("❌ Stories container not found");
      return;
    }

    if (!Array.isArray(stories)) {
      console.error("❌ Stories data is not an array:", stories);
      this.showError("Data stories tidak valid");
      return;
    }

    if (stories.length === 0) {
      console.log("📭 No stories to display, showing empty state");
      this.showEmptyState();
      return;
    }

    try {
      console.log("🎨 Creating story cards HTML...");
      const cardsHTML = stories
        .map((story, index) => this.createStoryCard(story, index))
        .join("");

      container.innerHTML = cardsHTML;

      console.log("✅ Story cards rendered, setting up interactions...");
      this.setupStoryInteractions();

      console.log("🗺️ Adding markers to map...");
      this.addMarkersToMap(stories);

      this.announceToScreenReader(`${stories.length} stories berhasil dimuat`);

      console.log(`🎉 Successfully rendered ${stories.length} stories`);
    } catch (error) {
      console.error("❌ Error rendering stories:", error);
      this.showError("Gagal menampilkan stories");
    }
  }

  formatFullDate(dateString) {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn("⚠️ Invalid date string:", dateString);
        return dateString;
      }
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.warn("❌ Error formatting date:", error, dateString);
      return dateString;
    }
  }

  createStoryCard(story, index) {
    console.log(`🎨 Creating card for story ${index + 1}:`, {
      id: story.id,
      name: story.name,
      hasDescription: !!story.description,
      hasLocation: !!(story.lat && story.lon),
    });

    const hasLocation = story.lat && story.lon;
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
            <button class="story-action view-btn" aria-label="Lihat detail story">
              <i class="fas fa-eye"></i>
            </button>
            ${
              hasLocation
                ? `
              <button class="story-action location-btn" aria-label="Lihat di peta">
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
                }" title="${this.formatFullDate(story.createdAt)}">
                  ${this.getRelativeTime(story.createdAt)}
                </time>
              </div>
            </div>
            
            <div class="story-actions">
              <button class="action-btn like-btn" aria-label="Suka story" data-liked="false">
                <i class="far fa-heart"></i>
              </button>
              <button class="action-btn share-btn" aria-label="Bagikan story">
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

  setupStoryInteractions() {
    console.log("🔗 Setting up story interactions...");

    document.querySelectorAll(".story-card").forEach((card, cardIndex) => {
      const storyId = card.dataset.storyId;

      if (!storyId) {
        console.warn(`❌ Story card ${cardIndex} missing ID:`, card);
        return;
      }

      console.log(`🔗 Setting up interactions for story: ${storyId}`);

      const handleCardClick = (e) => {
        if (
          !e.target.closest(".story-overlay") &&
          !e.target.closest(".story-actions")
        ) {
          console.log("👆 Card clicked, opening detail:", storyId);
          this.showStoryDetail(storyId);
        }
      };

      card.addEventListener("click", handleCardClick);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          console.log("⌨️ Card keyboard activated, opening detail:", storyId);
          this.showStoryDetail(storyId);
        }
      });
      const viewBtn = card.querySelector(".view-btn");
      if (viewBtn) {
        viewBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          console.log("👁️ View button clicked:", storyId);
          this.showStoryDetail(storyId);
        });
      }

      const locationBtn = card.querySelector(".location-btn");
      if (locationBtn) {
        locationBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          console.log("📍 Location button clicked:", storyId);
          this.focusOnMap(storyId);
        });
      }

      const likeBtn = card.querySelector(".like-btn");
      if (likeBtn) {
        likeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          console.log("❤️ Like button clicked:", storyId);
          this.toggleLike(likeBtn);
        });
      }

      const shareBtn = card.querySelector(".share-btn");
      if (shareBtn) {
        shareBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          console.log("📤 Share button clicked:", storyId);
          this.shareStory(storyId);
        });
      }
    });

    console.log("✅ Story interactions setup complete");
  }

  showStoryDetail(storyId) {
    console.log("🔍 Opening story detail for ID:", storyId);

    const story = this.storiesData.find((s) => s.id === storyId);
    if (!story) {
      console.error("❌ Story not found:", storyId);
      if (window.showToast) {
        window.showToast("Story tidak ditemukan", "error");
      }
      return;
    }

    const storyName = story.name || "Anonymous User";
    const storyDescription =
      story.description || "Tidak ada deskripsi tersedia.";
    const photoUrl = story.photoUrl || "";
    const hasLocation = story.lat && story.lon;

    console.log("📖 Story detail data:", {
      id: story.id,
      name: storyName,
      hasDescription: !!storyDescription,
      hasLocation,
    });

    const modal = document.createElement("div");
    modal.className = "story-modal";
    modal.innerHTML = `
      <div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-container">
          <button class="modal-close" aria-label="Tutup dialog">
            <i class="fas fa-times"></i>
          </button>
          
          <div class="modal-content">
            <div class="modal-image">
              <img src="${photoUrl}" 
                   alt="Foto story dari ${storyName}"
                   onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
              <div class="image-placeholder" style="display: none;">
                <i class="fas fa-image"></i>
                <span>Gambar tidak tersedia</span>
              </div>
            </div>
            
            <div class="modal-info">
              <div class="modal-header">
                <div class="author-info-modal">
                  <div class="author-avatar-modal" title="${storyName}">
                    <span class="avatar-text">${storyName
                      .charAt(0)
                      .toUpperCase()}</span>
                  </div>
                  <div class="author-details-modal">
                    <h2 id="modal-title" class="author-name-modal">${storyName}</h2>
                    <time datetime="${
                      story.createdAt
                    }" class="story-date-modal">
                      ${this.formatFullDate(story.createdAt)}
                    </time>
                  </div>
                </div>
              </div>
              
              <div class="modal-body">
                <div class="story-text-container">
                  <h3 class="story-text-title">
                    <i class="fas fa-quote-left"></i>
                    Story
                  </h3>
                  <p class="story-text">${storyDescription}</p>
                </div>
                
                ${
                  hasLocation
                    ? `
                  <div class="story-location-info">
                    <i class="fas fa-map-marker-alt"></i>
                    <div class="location-details">
                      <span class="location-label">Lokasi:</span>
                      <span class="location-coords">${parseFloat(
                        story.lat
                      ).toFixed(4)}, ${parseFloat(story.lon).toFixed(4)}</span>
                    </div>
                  </div>
                `
                    : `
                  <div class="story-no-location-info">
                    <i class="fas fa-map-pin"></i>
                    <span>Tanpa informasi lokasi</span>
                  </div>
                `
                }
                
                <div class="story-meta">
                  <div class="meta-item">
                    <i class="fas fa-calendar-alt"></i>
                    <div class="meta-content">
                      <span class="meta-label">Dibuat:</span>
                      <span class="meta-value">${this.getRelativeTime(
                        story.createdAt
                      )}</span>
                    </div>
                  </div>
                  <div class="meta-item">
                    <i class="fas fa-user"></i>
                    <div class="meta-content">
                      <span class="meta-label">Oleh:</span>
                      <span class="meta-value">${storyName}</span>
                    </div>
                  </div>
                  ${
                    hasLocation
                      ? `
                  <div class="meta-item">
                    <i class="fas fa-globe"></i>
                    <div class="meta-content">
                      <span class="meta-label">Koordinat:</span>
                      <span class="meta-value">${parseFloat(story.lat).toFixed(
                        6
                      )}, ${parseFloat(story.lon).toFixed(6)}</span>
                    </div>
                  </div>
                  `
                      : ""
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = "hidden";

    const closeBtn = modal.querySelector(".modal-close");
    const overlay = modal.querySelector(".modal-overlay");

    const closeModal = () => {
      console.log("🚪 Closing story modal");
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
        document.body.style.overflow = "";
      }
    };

    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener("keydown", function handleEscape(e) {
      if (e.key === "Escape") {
        closeModal();
        document.removeEventListener("keydown", handleEscape);
      }
    });

    setTimeout(() => {
      closeBtn.focus();
      this.announceToScreenReader(
        `Modal detail story dari ${storyName} dibuka`
      );
    }, 100);

    console.log("✅ Story modal opened successfully");
  }

  toggleLike(btn) {
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

    btn.style.transform = "scale(1.2)";
    setTimeout(() => (btn.style.transform = ""), 200);
  }

  shareStory(storyId) {
    const story = this.storiesData.find((s) => s.id === storyId);
    if (!story) return;

    if (navigator.share) {
      navigator
        .share({
          title: `Story by ${story.name}`,
          text: story.description,
          url: window.location.href,
        })
        .catch(() => this.fallbackShare());
    } else {
      this.fallbackShare();
    }
  }

  fallbackShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      if (window.showToast) {
        window.showToast("Link berhasil disalin!", "success");
      }
    });
  }

  addMarkersToMap(stories) {
    if (!this.isMapReady) return;

    this.clearMarkers();

    const storiesWithLocation = stories.filter((s) => s.lat && s.lon);

    storiesWithLocation.forEach((story) => {
      const marker = L.marker([story.lat, story.lon], {
        icon: this.createCustomIcon(),
      }).addTo(this.map);

      marker.bindPopup(`
        <div class="map-popup">
          <img src="${story.photoUrl}" alt="Story ${
        story.name
      }" class="popup-image">
          <div class="popup-content">
            <h4>${story.name}</h4>
            <p>${story.description.substring(0, 80)}...</p>
            <small>${this.getRelativeTime(story.createdAt)}</small>
          </div>
        </div>
      `);

      this.markers.push(marker);
    });

    if (this.markers.length > 0) {
      const group = new L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  createCustomIcon() {
    return L.divIcon({
      className: "custom-marker",
      html: '<div class="marker-dot"><i class="fas fa-camera"></i></div>',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  }

  focusOnMap(storyId) {
    const story = this.storiesData.find((s) => s.id === storyId);
    if (!story || !story.lat || !story.lon) return;

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

    document.querySelector(".stories-map-container").scrollIntoView({
      behavior: "smooth",
    });
  }

  centerMap() {
    if (this.markers.length > 0) {
      const group = new L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  toggleFullscreen() {
    const container = document.querySelector(".stories-map-container");
    const btn = document.getElementById("fullscreen-map");
    const icon = btn.querySelector("i");

    if (container.classList.contains("fullscreen")) {
      container.classList.remove("fullscreen");
      icon.className = "fas fa-expand";
      document.body.style.overflow = "";
    } else {
      container.classList.add("fullscreen");
      icon.className = "fas fa-compress";
      document.body.style.overflow = "hidden";
    }

    setTimeout(() => {
      if (this.map) this.map.invalidateSize();
    }, 300);
  }

  applyFilter(filter) {
    const cards = document.querySelectorAll(".story-card");
    let visibleCount = 0;

    cards.forEach((card) => {
      const hasLocation = card.classList.contains("has-location");
      const shouldShow =
        filter === "all" || (filter === "location" && hasLocation);

      if (shouldShow) {
        card.style.display = "block";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    this.updateMapInfo(visibleCount);
  }

  updateStats(stories) {
    const totalCount = document.getElementById("total-count");
    const locationCount = document.getElementById("location-count");

    if (totalCount) {
      this.animateNumber(totalCount, stories.length);
    }

    if (locationCount) {
      const withLocation = stories.filter((s) => s.lat && s.lon).length;
      this.animateNumber(locationCount, withLocation);
    }
  }

  animateNumber(element, target) {
    let current = 0;
    const increment = target / 20;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 50);
  }

  updateMapInfo(count) {
    const mapInfo = document.getElementById("map-info");
    if (mapInfo) {
      mapInfo.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>Menampilkan ${count} stories</span>
      `;
    }
  }

  getRelativeTime(dateString) {
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

    return showFormattedDate(dateString);
  }

  showLoading() {
    const container = document.getElementById("stories-container");
    if (container) {
      container.innerHTML = `
        <div class="loading-state">
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
        <div class="error-state">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Terjadi Kesalahan</h3>
          <p>${message}</p>
          <button class="btn-retry" onclick="window.location.reload()">
            <i class="fas fa-redo"></i>
            Coba Lagi
          </button>
        </div>
      `;
    }
  }

  showEmptyState() {
    const container = document.getElementById("stories-container");
    if (container) {
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

  clearMarkers() {
    this.markers.forEach((marker) => {
      if (this.map) this.map.removeLayer(marker);
    });
    this.markers = [];
  }

  closeAnyModal() {
    const modal = document.querySelector(".story-modal");
    if (modal) {
      modal.querySelector(".modal-close").click();
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

  destroy() {
    this.clearMarkers();
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.storiesData = [];
    this.isMapReady = false;
  }
}
