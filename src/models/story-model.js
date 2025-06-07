import CONFIG from "../scripts/config";

export class StoryModel {
  async getAllStories() {
    const response = await fetch(`${CONFIG.BASE_URL}/stories?location=1`);

    if (!response.ok) {
      throw new Error("STORIES_FAILED_TO_GET");
    }

    const data = await response.json();
    return data.listStory;
  }

  async getStoryDetail(id) {
    const response = await fetch(`${CONFIG.BASE_URL}/stories/${id}`);

    if (!response.ok) {
      throw new Error("STORY_DETAIL_FAILED_TO_GET");
    }

    const data = await response.json();
    return data.story;
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
