import { AuthModel } from "../models/auth-model.js";
import CONFIG from "../scripts/config.js";

class AuthService {
  constructor() {
    this.authModel = new AuthModel();
    this.listeners = new Set();
    this.isInitialized = false;

    this.loadAuthState();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach((callback) => {
      try {
        callback(this.isLoggedIn(), this.getCurrentUser());
      } catch (error) {
        console.warn("Error in auth listener:", error);
      }
    });
  }

  async login(email, password) {
    try {
      const result = await this.authModel.login(email, password);
      this.saveAuthState();
      this.notifyListeners();
      return result;
    } catch (error) {
      throw error;
    }
  }

  async register(name, email, password) {
    try {
      const result = await this.authModel.register(name, email, password);
      return result;
    } catch (error) {
      throw error;
    }
  }

  logout() {
    this.authModel.logout();
    this.clearAuthState();
    this.notifyListeners();

    setTimeout(() => {
      window.location.hash = "#/login";
    }, 100);
  }

  isLoggedIn() {
    return this.authModel.isLoggedIn();
  }

  getToken() {
    return this.authModel.getToken();
  }

  getCurrentUser() {
    return this.authModel.getCurrentUser();
  }

  saveAuthState() {
    try {
      const user = this.authModel.getCurrentUser();
      const token = this.authModel.getToken();

      if (user && token) {
        localStorage.setItem(
          CONFIG.STORAGE_KEYS.USER_DATA,
          JSON.stringify(user)
        );
        localStorage.setItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
      }
    } catch (error) {
      console.warn("Failed to save auth state:", error);
    }
  }

  loadAuthState() {
    try {
      const savedUser = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_DATA);
      const savedToken = localStorage.getItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);

      if (savedUser && savedToken) {
        const user = JSON.parse(savedUser);
        this.authModel.setAuthData(user, savedToken);
        this.isInitialized = true;
      }
    } catch (error) {
      console.warn("Failed to load auth state:", error);
      this.clearAuthState();
    }
  }

  clearAuthState() {
    try {
      localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.warn("Failed to clear auth state:", error);
    }
  }

  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.hash = "#/login";
      return false;
    }
    return true;
  }

  validateSession() {
    const token = this.getToken();
    if (!token) {
      this.logout();
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Date.now() / 1000;

      if (payload.exp && payload.exp < now) {
        this.logout();
        return false;
      }
    } catch (error) {
      console.warn("Invalid token format:", error);
      this.logout();
      return false;
    }

    return true;
  }

  async refreshUserData() {
    if (!this.isLoggedIn()) return false;

    try {
      return true;
    } catch (error) {
      console.warn("Failed to refresh user data:", error);
      this.logout();
      return false;
    }
  }
}

export default new AuthService();
