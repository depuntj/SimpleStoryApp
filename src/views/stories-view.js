import { showFormattedDate } from "../scripts/utils/index.js";
import CONFIG from "../scripts/config.js";

export class StoriesView {
  constructor() {
    this.map = null;
    this.markers = [];
  }

  renderStoriesList(stories) {
    const container = document.getElementById("stories-container");

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

    this.initializeMap(stories);
  }

  initializeMap(stories) {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map("map-container").setView(
      [CONFIG.DEFAULT_LOCATION.lat, CONFIG.DEFAULT_LOCATION.lng],
      10
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(this.map);

    this.addMarkersToMap(stories);
  }

  addMarkersToMap(stories) {
    this.clearMarkers();

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(this.map);
        marker.bindPopup(`
          <div class="popup-content">
            <img src="${story.photoUrl}" alt="Story by ${
          story.name
        }" class="popup-image">
            <h4>${story.name}</h4>
            <p>${story.description}</p>
            <small>${showFormattedDate(story.createdAt, "id-ID")}</small>
          </div>
        `);
        this.markers.push(marker);
      }
    });
  }

  clearMarkers() {
    this.markers.forEach((marker) => this.map.removeLayer(marker));
    this.markers = [];
  }

  showLoading() {
    const container = document.getElementById("stories-container");
    container.innerHTML = `
      <div class="loading-container" role="status" aria-live="polite">
        <div class="loading-spinner"></div>
        <p>Memuat stories...</p>
      </div>
    `;
  }

  showError(message) {
    const container = document.getElementById("stories-container");
    container.innerHTML = `
      <div class="error-container" role="alert">
        <h3>Terjadi Kesalahan</h3>
        <p>${message}</p>
        <button id="retry-button" class="retry-button">Coba Lagi</button>
      </div>
    `;
  }

  showEmpty() {
    const container = document.getElementById("stories-container");
    container.innerHTML = `
      <div class="empty-container">
        <h3>Belum Ada Stories</h3>
        <p>Jadilah yang pertama membagikan story!</p>
        <a href="#/add" class="add-story-button">Tambah Story</a>
      </div>
    `;
  }
}
