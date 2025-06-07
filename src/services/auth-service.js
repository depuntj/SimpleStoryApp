// src/services/auth-service.js
import { AuthModel } from "../models/auth-model.js";

class AuthService {
  constructor() {
    this.authModel = new AuthModel();
    this.listeners = [];

    // PERBAIKAN: Load auth state saat initialization
    this.loadAuthState();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback
      );
    };
  }

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

  saveAuthState() {
    if (this.authModel.currentUser && this.authModel.token) {
      localStorage.setItem(
        "dicoding_stories_user",
        JSON.stringify(this.authModel.currentUser)
      );
      localStorage.setItem("dicoding_stories_token", this.authModel.token);
    }
  }

  // PERBAIKAN: Buat loadAuthState synchronous dan lebih robust
  loadAuthState() {
    try {
      const savedUser = localStorage.getItem("dicoding_stories_user");
      const savedToken = localStorage.getItem("dicoding_stories_token");

      if (savedUser && savedToken) {
        this.authModel.currentUser = JSON.parse(savedUser);
        this.authModel.token = savedToken;
        console.log("Auth state berhasil dimuat");
      }
    } catch (error) {
      console.error("Error loading auth state:", error);
      this.clearAuthState();
    }
  }

  clearAuthState() {
    localStorage.removeItem("dicoding_stories_user");
    localStorage.removeItem("dicoding_stories_token");
  }

  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.hash = "#/login";
      return false;
    }
    return true;
  }
}

export default new AuthService();
