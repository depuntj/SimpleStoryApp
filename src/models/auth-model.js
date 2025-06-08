import CONFIG from "../scripts/config.js";
import { loginUser, registerUser } from "../scripts/data/api.js";

export class AuthModel {
  constructor() {
    this.currentUser = null;
    this.token = null;
  }

  async register(name, email, password) {
    try {
      if (name.length < CONFIG.VALIDATION.MIN_NAME_LENGTH) {
        throw new Error("Nama harus minimal 2 karakter");
      }

      if (password.length < CONFIG.VALIDATION.MIN_PASSWORD_LENGTH) {
        throw new Error("Password harus minimal 8 karakter");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Format email tidak valid");
      }

      const response = await registerUser(name, email, password);
      return response;
    } catch (error) {
      if (error.message.includes("User Created")) {
        return { error: false, message: "User Created" };
      }
      throw new Error(this.getErrorMessage(error.message));
    }
  }

  async login(email, password) {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Format email tidak valid");
      }

      if (!password || password.length < 1) {
        throw new Error("Password harus diisi");
      }

      const response = await loginUser(email, password);

      if (response.error === false && response.loginResult) {
        this.currentUser = response.loginResult;
        this.token = response.loginResult.token;
        return response;
      } else {
        throw new Error("Login gagal");
      }
    } catch (error) {
      throw new Error(this.getErrorMessage(error.message));
    }
  }

  logout() {
    this.currentUser = null;
    this.token = null;
  }

  isLoggedIn() {
    return !!this.token && !!this.currentUser;
  }

  getToken() {
    return this.token;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  setAuthData(user, token) {
    this.currentUser = user;
    this.token = token;
  }

  getErrorMessage(errorMessage) {
    const errorMap = {
      LOGIN_FAILED: CONFIG.ERROR_MESSAGES.INVALID_CREDENTIALS,
      REGISTER_FAILED: CONFIG.ERROR_MESSAGES.REGISTRATION_FAILED,
      "Bad Request": "Data yang dikirim tidak valid",
      "Internal Server Error": "Terjadi kesalahan server. Silakan coba lagi",
      "Failed to fetch": CONFIG.ERROR_MESSAGES.NETWORK_ERROR,
      "User Created": "Registrasi berhasil",
    };

    return (
      errorMap[errorMessage] ||
      errorMessage ||
      "Terjadi kesalahan yang tidak diketahui"
    );
  }
}

export default AuthModel;
