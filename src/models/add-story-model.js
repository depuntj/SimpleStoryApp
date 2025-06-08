import CONFIG from "../scripts/config.js";
import { addStory, addStoryAsGuest } from "../scripts/data/api.js";
import authService from "../services/auth-service.js";
import { validateImageFile } from "../scripts/utils/index.js";

export class AddStoryModel {
  constructor() {
    this.storyData = {
      description: "",
      photo: null,
      location: null,
    };
  }

  validateStoryData(data) {
    const errors = [];

    if (
      !data.description ||
      data.description.trim().length < CONFIG.VALIDATION.MIN_DESCRIPTION_LENGTH
    ) {
      errors.push(
        `Deskripsi harus minimal ${CONFIG.VALIDATION.MIN_DESCRIPTION_LENGTH} karakter`
      );
    }

    if (
      data.description &&
      data.description.length > CONFIG.VALIDATION.MAX_DESCRIPTION_LENGTH
    ) {
      errors.push(
        `Deskripsi maksimal ${CONFIG.VALIDATION.MAX_DESCRIPTION_LENGTH} karakter`
      );
    }

    if (!data.photo) {
      errors.push("Foto harus diambil terlebih dahulu");
    } else {
      const validation = validateImageFile(
        data.photo,
        CONFIG.VALIDATION.MAX_FILE_SIZE
      );
      if (!validation.isValid) {
        errors.push(validation.error);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  async submitStory(data) {
    const validation = this.validateStoryData(data);
    if (!validation.isValid) {
      throw new Error(validation.errors[0]);
    }

    try {
      const formData = new FormData();
      formData.append("description", data.description.trim());
      formData.append("photo", data.photo);

      if (data.location && data.location.lat && data.location.lng) {
        formData.append("lat", data.location.lat);
        formData.append("lon", data.location.lng);
      }

      let response;
      if (authService.isLoggedIn()) {
        response = await addStory(formData, authService.getToken());
      } else {
        response = await addStoryAsGuest(formData);
      }

      if (response && response.error === false) {
        return response;
      } else {
        throw new Error("Gagal mengirim story");
      }
    } catch (error) {
      if (error.message.includes("401")) {
        authService.logout();
        throw new Error("Sesi berakhir. Silakan login kembali");
      }

      if (error.message.includes("413")) {
        throw new Error("Ukuran file terlalu besar");
      }

      throw new Error(error.message || "Gagal mengirim story");
    }
  }

  setStoryData(key, value) {
    this.storyData[key] = value;
  }

  getStoryData() {
    return { ...this.storyData };
  }

  resetStoryData() {
    this.storyData = {
      description: "",
      photo: null,
      location: null,
    };
  }
}
