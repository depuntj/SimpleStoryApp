import { AuthModel } from "../models/auth-model.js";

class AuthService {
  constructor() {
    this.authModel = new AuthModel();
    this.listeners = [];

    // Load saved auth state from localStorage on initialization
    this.loadAuthState();
  }

  // Subscribe to auth state changes
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback
      );
    };
  }

  // Notify all listeners of auth state change
  notifyListeners() {
    this.listeners.forEach((callback) => callback(this.isLoggedIn()));
  }

  async login(email, password) {
    const result = await this.authModel.login(email, password);
    this.saveAuthState();
    this.notifyListeners();
    return result;
  }

  async register(name, email, password) {
    return await this.authModel.register(name, email, password);
  }

  logout() {
    this.authModel.logout();
    this.clearAuthState();
    this.notifyListeners();
    // Redirect to login page
    window.location.hash = "#/login";
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

  // Save auth state to localStorage
  saveAuthState() {
    if (this.authModel.currentUser && this.authModel.token) {
      localStorage.setItem(
        "dicoding_stories_user",
        JSON.stringify(this.authModel.currentUser)
      );
      localStorage.setItem("dicoding_stories_token", this.authModel.token);
    }
  }

  // Load auth state from localStorage
  loadAuthState() {
    try {
      const savedUser = localStorage.getItem("dicoding_stories_user");
      const savedToken = localStorage.getItem("dicoding_stories_token");

      if (savedUser && savedToken) {
        this.authModel.currentUser = JSON.parse(savedUser);
        this.authModel.token = savedToken;
      }
    } catch (error) {
      console.error("Error loading auth state:", error);
      this.clearAuthState();
    }
  }

  // Clear auth state from localStorage
  clearAuthState() {
    localStorage.removeItem("dicoding_stories_user");
    localStorage.removeItem("dicoding_stories_token");
  }

  // Check if user needs to authenticate for protected routes
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.hash = "#/login";
      return false;
    }
    return true;
  }
}

// Export singleton instance
export default new AuthService();
