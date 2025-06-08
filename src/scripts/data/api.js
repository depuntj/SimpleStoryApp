import CONFIG from "../config.js";

const API_BASE_URL = CONFIG.BASE_URL;

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    if (config.body && config.headers["Content-Type"] === "application/json") {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error(CONFIG.ERROR_MESSAGES.NETWORK_ERROR);
      }
      throw error;
    }
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: "GET", ...options });
  }

  async post(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: "POST",
      body: data,
      ...options,
    });
  }

  async put(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: "PUT",
      body: data,
      ...options,
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: "DELETE", ...options });
  }

  setAuthToken(token) {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      Authorization: `Bearer ${token}`,
    };
  }

  removeAuthToken() {
    if (this.defaultHeaders) {
      delete this.defaultHeaders["Authorization"];
    }
  }
}

export const apiClient = new ApiClient();

export async function getAllStories(options = {}) {
  const params = new URLSearchParams();
  if (options.page) params.append("page", options.page);
  if (options.size) params.append("size", options.size);
  if (options.location !== undefined)
    params.append("location", options.location);

  const queryString = params.toString();
  const endpoint = queryString
    ? `${CONFIG.ENDPOINTS.STORIES}?${queryString}`
    : CONFIG.ENDPOINTS.STORIES;

  return apiClient.get(endpoint, {
    headers: options.token ? { Authorization: `Bearer ${options.token}` } : {},
  });
}

export async function getStoryDetail(id, token) {
  return apiClient.get(`${CONFIG.ENDPOINTS.STORY_DETAIL}/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function addStory(formData, token) {
  return apiClient.post(CONFIG.ENDPOINTS.STORIES, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function addStoryAsGuest(formData) {
  return apiClient.post(CONFIG.ENDPOINTS.STORIES_GUEST, formData);
}

export async function loginUser(email, password) {
  return apiClient.post(CONFIG.ENDPOINTS.LOGIN, { email, password });
}

export async function registerUser(name, email, password) {
  return apiClient.post(CONFIG.ENDPOINTS.REGISTER, { name, email, password });
}

export async function subscribeNotification(subscription, token) {
  return apiClient.post(
    CONFIG.ENDPOINTS.NOTIFICATIONS_SUBSCRIBE,
    subscription,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

export async function unsubscribeNotification(endpoint, token) {
  return apiClient.delete(CONFIG.ENDPOINTS.NOTIFICATIONS_UNSUBSCRIBE, {
    body: { endpoint },
    headers: { Authorization: `Bearer ${token}` },
  });
}
