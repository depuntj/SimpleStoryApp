// src/models/story-model.js
import CONFIG from "../scripts/config.js";
import authService from "../services/auth-service.js";

export class StoryModel {
  async getAllStories() {
    const headers = {};

    // PERBAIKAN: Coba dengan auth header jika tersedia, tapi jangan gagal jika tidak ada
    if (authService.isLoggedIn()) {
      headers["Authorization"] = `Bearer ${authService.getToken()}`;
    }

    try {
      const response = await fetch(`${CONFIG.BASE_URL}/stories?location=1`, {
        method: "GET",
        headers: headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, logout dan coba lagi tanpa auth
          authService.logout();

          // PERBAIKAN: Coba sekali lagi tanpa authorization header
          const retryResponse = await fetch(
            `${CONFIG.BASE_URL}/stories?location=1`,
            {
              method: "GET",
              headers: {},
            }
          );

          if (!retryResponse.ok) {
            throw new Error("STORIES_FAILED_TO_GET");
          }

          const retryData = await retryResponse.json();
          return retryData.listStory || [];
        }
        throw new Error("STORIES_FAILED_TO_GET");
      }

      const data = await response.json();
      return data.listStory || [];
    } catch (error) {
      console.error("Error in getAllStories:", error);

      // PERBAIKAN: Jika fetch gagal, coba dengan guest mode
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        console.log("Mencoba guest mode...");
        try {
          const guestResponse = await fetch(
            `${CONFIG.BASE_URL}/stories?location=1`,
            {
              method: "GET",
              headers: {},
            }
          );

          if (guestResponse.ok) {
            const guestData = await guestResponse.json();
            return guestData.listStory || [];
          }
        } catch (guestError) {
          console.error("Guest mode juga gagal:", guestError);
        }
      }

      throw error;
    }
  }

  async getStoryDetail(id) {
    const headers = {};

    if (authService.isLoggedIn()) {
      headers["Authorization"] = `Bearer ${authService.getToken()}`;
    }

    const response = await fetch(`${CONFIG.BASE_URL}/stories/${id}`, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        authService.logout();
        throw new Error("SESSION_EXPIRED");
      }
      throw new Error("STORY_DETAIL_FAILED_TO_GET");
    }

    const data = await response.json();
    return data.story;
  }

  async addStory(description, photo, lat = null, lon = null) {
    if (!authService.isLoggedIn()) {
      throw new Error("AUTHENTICATION_REQUIRED");
    }

    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photo);
    if (lat !== null) formData.append("lat", lat);
    if (lon !== null) formData.append("lon", lon);

    const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        authService.logout();
        throw new Error("SESSION_EXPIRED");
      }
      throw new Error("STORY_FAILED_TO_ADD");
    }

    return await response.json();
  }

  async addStoryAsGuest(description, photo, lat = null, lon = null) {
    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photo);
    if (lat !== null) formData.append("lat", lat);
    if (lon !== null) formData.append("lon", lon);

    const response = await fetch(`${CONFIG.BASE_URL}/stories/guest`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("STORY_FAILED_TO_ADD");
    }

    return await response.json();
  }
}
