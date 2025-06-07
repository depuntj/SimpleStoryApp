import CONFIG from "../scripts/config.js";

export class AuthModel {
  constructor() {
    this.currentUser = null;
    this.token = null;
  }

  async register(name, email, password) {
    const response = await fetch(`${CONFIG.BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "REGISTER_FAILED");
    }

    return await response.json();
  }

  async login(email, password) {
    const response = await fetch(`${CONFIG.BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "LOGIN_FAILED");
    }

    const data = await response.json();
    this.currentUser = data.loginResult;
    this.token = data.loginResult.token;

    return data;
  }

  logout() {
    this.currentUser = null;
    this.token = null;
  }

  isLoggedIn() {
    return !!this.token;
  }

  getToken() {
    return this.token;
  }

  getCurrentUser() {
    return this.currentUser;
  }
}
export default AuthModel;
