import authService from "../services/auth-service.js";

export class StoriesPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.retryAttempts = 0;
    this.maxRetryAttempts = 3;
  }

  setupEventHandlers() {
    this.setupRetryHandler();
    this.setupRefreshHandler();
  }

  async loadStories() {
    try {
      this.view.showLoading();
      this.retryAttempts = 0;

      await new Promise((resolve) => setTimeout(resolve, 100));

      console.log("📚 Loading stories from API...");
      const rawStories = await this.model.getAllStories();

      console.log("📊 Raw stories from API:", {
        count: rawStories?.length || 0,
        sample: rawStories?.[0] || null,
      });

      const validatedStories = this.validateAndSanitizeStories(rawStories);

      console.log("✅ Validated stories:", {
        original: rawStories?.length || 0,
        validated: validatedStories.length,
        sampleValidated: validatedStories[0] || null,
      });

      if (!validatedStories || validatedStories.length === 0) {
        console.warn("❌ No valid stories to display");
        this.view.showEmptyState();
      } else {
        console.log("🎉 Rendering stories to view");
        this.view.renderStoriesList(validatedStories);
      }
    } catch (error) {
      console.error("❌ Error loading stories:", error);
      this.handleLoadError(error);
    }
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
      .map((story, index) => {
        console.log(`🔍 Validating story ${index + 1}:`, {
          id: story?.id,
          name: story?.name,
          hasDescription: !!story?.description,
          hasPhoto: !!story?.photoUrl,
        });
        return story;
      })
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

    if (typeof story.id !== "string" || story.id.trim() === "") {
      console.warn("❌ Invalid story ID:", story.id);
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
      console.warn("❌ Invalid latitude, removing location:", sanitized.lat);
      sanitized.lat = null;
      sanitized.lon = null;
    }

    if (
      sanitized.lon !== null &&
      (isNaN(sanitized.lon) || sanitized.lon < -180 || sanitized.lon > 180)
    ) {
      console.warn("❌ Invalid longitude, removing location:", sanitized.lon);
      sanitized.lat = null;
      sanitized.lon = null;
    }

    console.log("✅ Sanitized story:", {
      id: sanitized.id,
      name: sanitized.name,
      hasDescription: !!sanitized.description,
      hasLocation: !!(sanitized.lat && sanitized.lon),
    });

    return sanitized;
  }

  sanitizeName(name) {
    if (!name || typeof name !== "string" || name.trim() === "") {
      console.log("⚠️ Using fallback name for empty/invalid name:", name);
      return "Anonymous User";
    }

    const sanitized = name
      .trim()
      .replace(/\s+/g, " ")
      .replace(/[<>]/g, "")
      .substring(0, 100);

    return sanitized || "Anonymous User";
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

    this.view.showError(errorMessage);
  }

  async retryLoadStories() {
    if (this.retryAttempts < this.maxRetryAttempts) {
      this.retryAttempts++;
      console.log(
        `🔄 Retrying to load stories (attempt ${this.retryAttempts})`
      );
      await this.loadStories();
    } else {
      this.view.showError(
        "Gagal memuat stories setelah beberapa percobaan. Silakan refresh halaman."
      );
    }
  }

  setupRetryHandler() {
    document.addEventListener("click", (event) => {
      if (
        event.target &&
        (event.target.classList.contains("btn-retry") ||
          event.target.closest(".btn-retry"))
      ) {
        event.preventDefault();
        this.retryLoadStories();
      }
    });
  }

  setupRefreshHandler() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "F5" || (event.ctrlKey && event.key === "r")) {
        event.preventDefault();
        this.loadStories();
      }
    });
  }

  async refreshStories() {
    try {
      const rawStories = await this.model.getAllStories();
      const validatedStories = this.validateAndSanitizeStories(rawStories);

      this.view.renderStoriesList(validatedStories);

      if (typeof window.showToast === "function") {
        window.showToast("Stories berhasil diperbarui", "success");
      }
    } catch (error) {
      console.error("Error refreshing stories:", error);
      if (typeof window.showToast === "function") {
        window.showToast("Gagal memperbarui stories", "error");
      }
    }
  }

  async searchStories(query) {
    try {
      const stories = this.model.searchStories(query);
      const validatedStories = this.validateAndSanitizeStories(stories);
      this.view.renderStoriesList(validatedStories);
    } catch (error) {
      console.error("Error searching stories:", error);
      this.view.showError("Gagal mencari stories");
    }
  }

  getStoriesStats() {
    return {
      total: this.model.getStoriesCount(),
      withLocation: this.model.getStoriesWithLocationCount(),
      uniqueAuthors: this.model.getUniqueAuthorsCount(),
    };
  }
}
