import authService from "../services/auth-service.js";

export class StoriesPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.retryAttempts = 0;
    this.maxRetryAttempts = 3;
    this.currentStories = [];
    this.currentFilter = "all";
    this.currentViewMode = "grid";
  }

  setupEventHandlers() {
    this.view.onRetryRequested(() => this.handleRetry());
    this.view.onRefreshRequested(() => this.handleRefresh());
    this.view.onStoryDetailRequested((storyId) =>
      this.handleStoryDetail(storyId)
    );
    this.view.onLocationFocusRequested((storyId) =>
      this.handleLocationFocus(storyId)
    );
    this.view.onStoryLiked((storyId) => this.handleStoryLike(storyId));
    this.view.onStoryShared((storyId) => this.handleStoryShare(storyId));
    this.view.onFilterChanged((filter) => this.handleFilterChange(filter));
    this.view.onViewModeChanged((viewMode) =>
      this.handleViewModeChange(viewMode)
    );
    this.view.onMapCenterRequested(() => this.handleMapCenter());
    this.view.onMapFullscreenToggled(() => this.handleMapFullscreen());
  }

  async loadStories() {
    try {
      this.view.showLoadingState();
      this.retryAttempts = 0;

      await new Promise((resolve) => setTimeout(resolve, 100));

      const rawStories = await this.model.getAllStories();
      const validatedStories =
        this.model.validateAndSanitizeStories(rawStories);
      this.currentStories = validatedStories;

      if (!validatedStories || validatedStories.length === 0) {
        this.view.showEmptyState();
      } else {
        this.displayStories();
      }
    } catch (error) {
      console.error("❌ Error loading stories:", error);
      this.handleLoadError(error);
    }
  }

  displayStories() {
    const filteredStories = this.applyCurrentFilter(this.currentStories);
    const storiesWithLocation = this.getStoriesWithLocation(filteredStories);

    this.view.renderStoriesList(filteredStories);
    this.view.addMarkersToMap(storiesWithLocation);
    this.view.updateStats(filteredStories);
  }

  applyCurrentFilter(stories) {
    switch (this.currentFilter) {
      case "location":
        return stories.filter((story) => story.lat && story.lon);
      case "all":
      default:
        return stories;
    }
  }

  getStoriesWithLocation(stories) {
    return stories.filter((story) => story.lat && story.lon);
  }

  calculateStats(stories) {
    return {
      total: stories.length,
      withLocation: this.getStoriesWithLocation(stories).length,
      uniqueAuthors: new Set(stories.map((story) => story.name)).size,
    };
  }

  async handleRetry() {
    if (this.retryAttempts < this.maxRetryAttempts) {
      this.retryAttempts++;
      await this.loadStories();
    } else {
      this.view.showErrorState(
        "Gagal memuat stories setelah beberapa percobaan. Silakan refresh halaman."
      );
    }
  }

  async handleRefresh() {
    await this.loadStories();
  }

  handleStoryDetail(storyId) {
    const story = this.currentStories.find((s) => s.id === storyId);
    if (story) {
      this.view.showStoryModal(story);
    }
  }

  handleLocationFocus(storyId) {
    const story = this.currentStories.find((s) => s.id === storyId);
    if (story && story.lat && story.lon) {
      this.view.focusMapOnLocation(story.lat, story.lon, story);
    }
  }

  handleStoryLike(storyId) {
    this.saveLikeStatus(storyId, true);
  }

  handleStoryShare(storyId) {
    const story = this.currentStories.find((s) => s.id === storyId);
    if (story) {
      this.shareStory(story);
    }
  }

  handleFilterChange(filter) {
    this.currentFilter = filter;
    this.displayStories();
  }

  handleViewModeChange(viewMode) {
    this.currentViewMode = viewMode;
  }

  handleMapCenter() {
    this.view.centerMapToMarkers();
  }

  handleMapFullscreen() {
    this.view.toggleMapFullscreen();
  }

  saveLikeStatus(storyId, isLiked) {
    try {
      const likes = JSON.parse(localStorage.getItem("story_likes") || "{}");
      likes[storyId] = isLiked;
      localStorage.setItem("story_likes", JSON.stringify(likes));
    } catch (error) {
      console.warn("Could not save like status:", error);
    }
  }

  shareStory(story) {
    if (navigator.share) {
      navigator
        .share({
          title: `Story dari ${story.name}`,
          text: story.description,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      const shareText = `Story dari ${story.name}: ${story.description}\n${window.location.href}`;
      navigator.clipboard
        .writeText(shareText)
        .then(() => {
          this.view.showSuccessMessage("Link berhasil disalin!");
        })
        .catch(() => {
          this.view.showErrorMessage("Gagal membagikan story");
        });
    }
  }

  handleLoadError(error) {
    let errorMessage = "Terjadi kesalahan saat memuat stories.";

    switch (error.message) {
      case "SESSION_EXPIRED":
        errorMessage = "Sesi Anda telah berakhir. Silakan login kembali.";
        setTimeout(() => {
          window.location.hash = "#/login";
        }, 2000);
        break;

      case "STORIES_FAILED_TO_GET":
        if (!authService.isLoggedIn()) {
          errorMessage = "Silakan login terlebih dahulu untuk melihat stories.";
        } else {
          errorMessage = "Gagal memuat stories. Periksa koneksi internet Anda.";
        }
        break;

      case "NETWORK_ERROR":
        errorMessage =
          "Tidak dapat terhubung ke server. Periksa koneksi internet.";
        break;

      default:
        if (error.name === "TypeError") {
          errorMessage =
            "Tidak dapat terhubung ke server. Periksa koneksi internet.";
        }
        break;
    }

    this.view.showErrorState(errorMessage);
  }
}
