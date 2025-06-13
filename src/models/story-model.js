import CONFIG from "../scripts/config.js";
import {
  getAllStories,
  getStoryDetail,
  addStory,
  addStoryAsGuest,
} from "../scripts/data/api.js";
import authService from "../services/auth-service.js";

export class StoryModel {
  constructor() {
    this.stories = [];
    this.currentStory = null;
  }

  async getAllStories(options = {}) {
    try {
      const defaultOptions = {
        location: 1,
        page: 1,
        size: 20,
        ...options,
      };

      let requestOptions = { ...defaultOptions };

      if (authService.isLoggedIn()) {
        requestOptions.token = authService.getToken();
      }

      const response = await getAllStories(requestOptions);

      if (response.error === false && response.listStory) {
        this.stories = response.listStory;
        return this.stories;
      } else {
        throw new Error("STORIES_FAILED_TO_GET");
      }
    } catch (error) {
      if (
        error.message.includes("401") ||
        error.message.includes("unauthorized")
      ) {
        if (authService.isLoggedIn()) {
          authService.logout();
          throw new Error("SESSION_EXPIRED");
        }
      }

      if (error.message.includes("fetch") || error.name === "TypeError") {
        throw new Error("NETWORK_ERROR");
      }

      throw new Error(error.message || "STORIES_FAILED_TO_GET");
    }
  }
  validateAndSanitizeStories(stories) {
    if (!Array.isArray(stories)) {
      return [];
    }

    const validStories = stories
      .filter((story) => this.isValidStory(story))
      .map((story) => this.sanitizeStory(story));

    return validStories;
  }

  isValidStory(story) {
    if (!story || typeof story !== "object") {
      return false;
    }

    const requiredFields = ["id", "photoUrl", "createdAt"];
    const missingFields = requiredFields.filter((field) => !story[field]);

    return missingFields.length === 0;
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

  async getStoryDetail(id) {
    try {
      const token = authService.getToken();
      const response = await getStoryDetail(id, token);

      if (response.error === false && response.story) {
        this.currentStory = response.story;
        return this.currentStory;
      } else {
        throw new Error("STORY_DETAIL_FAILED_TO_GET");
      }
    } catch (error) {
      if (error.message.includes("401")) {
        authService.logout();
        throw new Error("SESSION_EXPIRED");
      }
      throw new Error(error.message || "STORY_DETAIL_FAILED_TO_GET");
    }
  }

  async addStory(description, photo, lat = null, lon = null) {
    try {
      if (!authService.isLoggedIn()) {
        throw new Error("AUTHENTICATION_REQUIRED");
      }

      if (
        !description ||
        description.length < CONFIG.VALIDATION.MIN_DESCRIPTION_LENGTH
      ) {
        throw new Error("DESCRIPTION_TOO_SHORT");
      }

      if (!photo) {
        throw new Error("PHOTO_REQUIRED");
      }

      if (photo.size > CONFIG.VALIDATION.MAX_FILE_SIZE) {
        throw new Error("FILE_TOO_LARGE");
      }

      if (!CONFIG.VALIDATION.ALLOWED_IMAGE_TYPES.includes(photo.type)) {
        throw new Error("INVALID_FILE_TYPE");
      }

      const formData = new FormData();
      formData.append("description", description);
      formData.append("photo", photo);
      if (lat !== null && lon !== null) {
        formData.append("lat", lat);
        formData.append("lon", lon);
      }

      const token = authService.getToken();
      const response = await addStory(formData, token);

      if (response.error === false) {
        return response;
      } else {
        throw new Error("STORY_FAILED_TO_ADD");
      }
    } catch (error) {
      if (error.message.includes("401")) {
        authService.logout();
        throw new Error("SESSION_EXPIRED");
      }

      const errorMap = {
        DESCRIPTION_TOO_SHORT: `Deskripsi harus minimal ${CONFIG.VALIDATION.MIN_DESCRIPTION_LENGTH} karakter`,
        PHOTO_REQUIRED: "Foto harus diambil terlebih dahulu",
        FILE_TOO_LARGE: CONFIG.ERROR_MESSAGES.FILE_TOO_LARGE,
        INVALID_FILE_TYPE: CONFIG.ERROR_MESSAGES.INVALID_FILE_TYPE,
        AUTHENTICATION_REQUIRED: "Silakan login terlebih dahulu",
        SESSION_EXPIRED: CONFIG.ERROR_MESSAGES.AUTH_EXPIRED,
      };

      throw new Error(
        errorMap[error.message] || error.message || "Gagal menambahkan story"
      );
    }
  }

  async addStoryAsGuest(description, photo, lat = null, lon = null) {
    try {
      if (
        !description ||
        description.length < CONFIG.VALIDATION.MIN_DESCRIPTION_LENGTH
      ) {
        throw new Error("DESCRIPTION_TOO_SHORT");
      }

      if (!photo) {
        throw new Error("PHOTO_REQUIRED");
      }

      if (photo.size > CONFIG.VALIDATION.MAX_FILE_SIZE) {
        throw new Error("FILE_TOO_LARGE");
      }

      if (!CONFIG.VALIDATION.ALLOWED_IMAGE_TYPES.includes(photo.type)) {
        throw new Error("INVALID_FILE_TYPE");
      }

      const formData = new FormData();
      formData.append("description", description);
      formData.append("photo", photo);
      if (lat !== null && lon !== null) {
        formData.append("lat", lat);
        formData.append("lon", lon);
      }

      const response = await addStoryAsGuest(formData);

      if (response.error === false) {
        return response;
      } else {
        throw new Error("STORY_FAILED_TO_ADD");
      }
    } catch (error) {
      const errorMap = {
        DESCRIPTION_TOO_SHORT: `Deskripsi harus minimal ${CONFIG.VALIDATION.MIN_DESCRIPTION_LENGTH} karakter`,
        PHOTO_REQUIRED: "Foto harus diambil terlebih dahulu",
        FILE_TOO_LARGE: CONFIG.ERROR_MESSAGES.FILE_TOO_LARGE,
        INVALID_FILE_TYPE: CONFIG.ERROR_MESSAGES.INVALID_FILE_TYPE,
      };

      throw new Error(
        errorMap[error.message] || error.message || "Gagal menambahkan story"
      );
    }
  }

  getStoriesWithLocation() {
    return this.stories.filter((story) => story.lat && story.lon);
  }

  getStoriesCount() {
    return this.stories.length;
  }

  getUniqueAuthorsCount() {
    const uniqueAuthors = new Set(this.stories.map((story) => story.name));
    return uniqueAuthors.size;
  }

  getStoriesWithLocationCount() {
    return this.getStoriesWithLocation().length;
  }

  searchStories(query) {
    if (!query) return this.stories;

    const lowercaseQuery = query.toLowerCase();
    return this.stories.filter(
      (story) =>
        story.name.toLowerCase().includes(lowercaseQuery) ||
        story.description.toLowerCase().includes(lowercaseQuery)
    );
  }
}
