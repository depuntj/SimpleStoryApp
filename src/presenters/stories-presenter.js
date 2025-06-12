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

      console.log("📚 Loading stories from API...");
      const rawStories = await this.model.getAllStories();

      console.log("📊 Raw stories from API:", {
        count: rawStories?.length || 0,
        sample: rawStories?.[0] || null,
      });

      const validatedStories = this.validateAndSanitizeStories(rawStories);
      this.currentStories = validatedStories;

      console.log("✅ Validated stories:", {
        original: rawStories?.length || 0,
        validated: validatedStories.length,
      });

      if (!validatedStories || validatedStories.length === 0) {
        console.warn("❌ No valid stories to display");
        this.view.showEmptyState();
      } else {
        console.log("🎉 Rendering stories to view");
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
    const stats = this.calculateStats(filteredStories);

    this.view.renderStoriesList(filteredStories);
    this.view.addMarkersToMap(storiesWithLocation);
    this.view.updateStats(stats);
  }

  validateAndSanitizeStories(stories) {
    console.log("🔍 Starting validation process...");

    if (!Array.isArray(stories)) {
      console.error(
        "❌ Stories data is not an array:",
        typeof stories,
        stories
      );
      return [];
    }

    const validStories = stories
      .filter((story) => this.isValidStory(story))
      .map((story) => this.sanitizeStory(story));

    console.log(
      `✅ Validation complete: ${validStories.length}/${stories.length} stories valid`
    );
    return validStories;
  }

  isValidStory(story) {
    if (!story || typeof story !== "object") {
      console.warn("❌ Invalid story object:", story);
      return false;
    }

    const requiredFields = ["id", "photoUrl", "createdAt"];
    const missingFields = requiredFields.filter((field) => !story[field]);

    if (missingFields.length > 0) {
      console.warn(
        `❌ Story missing required fields: ${missingFields.join(", ")}`,
        {
          id: story.id,
          available: Object.keys(story),
        }
      );
      return false;
    }

    return true;
  }

  sanitizeStory(story) {
    const sanitized = {
      id: String(story.id).trim(),
      name: this.sanitizeName(story.name),
      description: this.sanitizeDescription(story.description),
      photoUrl: String(story.photoUrl).trim(),
      createdAt: story.createdAt,
      lat: story.lat ? parseFloat(story.lat) : null,
      lon: story.lon ? parseFloat(story.lon) : null,
    };

    if (
      sanitized.lat !== null &&
      (isNaN(sanitized.lat) || sanitized.lat < -90 || sanitized.lat > 90)
    ) {
      sanitized.lat = null;
      sanitized.lon = null;
    }

    if (
      sanitized.lon !== null &&
      (isNaN(sanitized.lon) || sanitized.lon < -180 || sanitized.lon > 180)
    ) {
      sanitized.lat = null;
      sanitized.lon = null;
    }

    return sanitized;
  }

  sanitizeName(name) {
    if (!name || typeof name !== "string" || name.trim() === "") {
      return "Anonymous User";
    }
    return (
      name.trim().replace(/\s+/g, " ").replace(/[<>]/g, "").substring(0, 100) ||
      "Anonymous User"
    );
  }

  sanitizeDescription(description) {
    if (
      !description ||
      typeof description !== "string" ||
      description.trim() === ""
    ) {
      return "Tidak ada deskripsi tersedia.";
    }
    return description
      .trim()
      .replace(/\s+/g, " ")
      .replace(/[<>]/g, "")
      .substring(0, 1000);
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
      console.log(
        `🔄 Retrying to load stories (attempt ${this.retryAttempts})`
      );
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
    console.log("📖 Opening story detail:", storyId);
    const story = this.currentStories.find((s) => s.id === storyId);
    if (story) {
      this.view.showStoryModal(story);
    }
  }

  handleLocationFocus(storyId) {
    console.log("📍 Focusing on story location:", storyId);
    const story = this.currentStories.find((s) => s.id === storyId);
    if (story && story.lat && story.lon) {
      this.view.focusMapOnLocation(story.lat, story.lon, story);
    }
  }

  handleStoryLike(storyId) {
    console.log("❤️ Story liked:", storyId);
    this.saveLikeStatus(storyId, true);
  }

  handleStoryShare(storyId) {
    console.log("📤 Story shared:", storyId);
    const story = this.currentStories.find((s) => s.id === storyId);
    if (story) {
      this.shareStory(story);
    }
  }

  handleFilterChange(filter) {
    console.log("🔍 Filter changed to:", filter);
    this.currentFilter = filter;
    this.displayStories();
  }

  handleViewModeChange(viewMode) {
    console.log("👁️ View mode changed to:", viewMode);
    this.currentViewMode = viewMode;
  }

  handleMapCenter() {
    console.log("🎯 Centering map");
  }

  handleMapFullscreen() {
    console.log("📺 Toggling map fullscreen");
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
          if (typeof window.showToast === "function") {
            window.showToast("Link berhasil disalin!", "success");
          }
        })
        .catch(() => {
          if (typeof window.showToast === "function") {
            window.showToast("Gagal membagikan story", "error");
          }
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
