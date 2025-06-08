import routes from "../routes/routes.js";
import { getActiveRoute } from "../routes/url-parser.js";
import authService from "../../services/auth-service.js";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #currentPage = null;
  #isRendering = false;
  #lastRenderedUrl = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();
    this.#setupViewTransitions();
    this.#setupAuthListener();

    setTimeout(() => {
      this.#updateNavigation();
    }, 100);
  }

  #setupAuthListener() {
    authService.subscribe((isLoggedIn) => {
      console.log("Auth state changed:", isLoggedIn);
      this.#updateNavigation();
    });
  }

  #updateNavigation() {
    const navList = document.getElementById("nav-list");
    if (!navList) {
      console.warn("Nav list not found");
      return;
    }

    const isLoggedIn = authService.isLoggedIn();
    console.log("Updating navigation, logged in:", isLoggedIn);

    if (isLoggedIn) {
      const currentUser = authService.getCurrentUser();
      navList.innerHTML = `
        <li><a href="#/">Beranda</a></li>
        <li><a href="#/add">Tambah Story</a></li>
        <li><a href="#/about">Tentang</a></li>
        <li class="user-info">
          <span class="user-name">👤 ${currentUser?.name || "User"}</span>
        </li>
        <li><button id="logout-button" class="logout-button btn btn-secondary">Keluar</button></li>
      `;

      const logoutButton = document.getElementById("logout-button");
      if (logoutButton) {
        logoutButton.addEventListener("click", () => {
          if (confirm("Yakin ingin keluar?")) {
            authService.logout();
          }
        });
      }
    } else {
      navList.innerHTML = `
        <li><a href="#/login">Masuk</a></li>
        <li><a href="#/about">Tentang</a></li>
      `;
    }
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      const isOpen = this.#navigationDrawer.classList.toggle("open");
      this.#drawerButton.setAttribute("aria-expanded", isOpen.toString());
      this.#drawerButton.setAttribute(
        "aria-label",
        isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"
      );
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#closeDrawer();
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#closeDrawer();
        }
      });
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        this.#navigationDrawer.classList.contains("open")
      ) {
        this.#closeDrawer();
        this.#drawerButton.focus();
      }
    });
  }

  #closeDrawer() {
    this.#navigationDrawer.classList.remove("open");
    this.#drawerButton.setAttribute("aria-expanded", "false");
    this.#drawerButton.setAttribute("aria-label", "Buka menu navigasi");
  }

  #setupViewTransitions() {
    if (!("startViewTransition" in document)) {
      return;
    }

    let hashChangeTimeout = null;

    window.addEventListener("hashchange", async () => {
      if (hashChangeTimeout) {
        clearTimeout(hashChangeTimeout);
      }

      hashChangeTimeout = setTimeout(async () => {
        if (document.startViewTransition) {
          await document.startViewTransition(async () => {
            await this.renderPage();
          }).finished;
        } else {
          await this.renderPage();
        }
      }, 50);
    });
  }

  #isProtectedRoute(url) {
    const protectedRoutes = ["/add"];
    return protectedRoutes.includes(url);
  }

  async renderPage() {
    const url = getActiveRoute();

    if (this.#isRendering) {
      console.log("Rendering already in progress, skipping...");
      return;
    }

    if (this.#lastRenderedUrl === url) {
      console.log(`URL ${url} already rendered, skipping...`);
      return;
    }

    this.#isRendering = true;

    try {
      console.log("Rendering page:", url);

      if (
        this.#currentPage &&
        typeof this.#currentPage.destroy === "function"
      ) {
        try {
          this.#currentPage.destroy();
        } catch (error) {
          console.warn("Error destroying previous page:", error);
        }
      }
      this.#currentPage = null;

      if (this.#isProtectedRoute(url) && !authService.isLoggedIn()) {
        console.log("Protected route, redirecting to login");
        this.#isRendering = false;
        window.location.hash = "#/login";
        return;
      }

      if (url === "/login" && authService.isLoggedIn()) {
        console.log("User already logged in, redirecting to home");
        this.#isRendering = false;
        window.location.hash = "#/";
        return;
      }

      const page = routes[url];

      if (!page) {
        this.#showNotFound();
        this.#isRendering = false;
        this.#lastRenderedUrl = url;
        return;
      }

      this.#content.innerHTML = `
        <div class="loading-container" style="min-height: 200px; display: flex; align-items: center; justify-content: center;">
          <div class="loading-spinner"></div>
          <p style="margin-left: 15px;">Memuat halaman...</p>
        </div>
      `;

      await new Promise((resolve) => setTimeout(resolve, 50));

      const htmlContent = await page.render();
      this.#content.innerHTML = htmlContent;
      this.#currentPage = page;
      if (page.afterRender) {
        try {
          await page.afterRender();
        } catch (error) {
          console.error("Error in afterRender:", error);
          this.#showPageError();
          this.#isRendering = false;
          return;
        }
      }

      this.#content.focus();
      this.#updatePageTitle(url);
      this.#lastRenderedUrl = url;

      console.log("Page rendered successfully:", url);
    } catch (error) {
      console.error("Error rendering page:", error);
      this.#showPageError();
    } finally {
      this.#isRendering = false;
    }
  }

  #showNotFound() {
    this.#content.innerHTML = `
      <div class="error-container">
        <h1>404 - Halaman Tidak Ditemukan</h1>
        <p>Halaman yang Anda cari tidak tersedia.</p>
        <a href="#/" class="retry-button btn btn-primary">Kembali ke Beranda</a>
      </div>
    `;
  }

  #showPageError() {
    this.#content.innerHTML = `
      <div class="error-container">
        <h1>Terjadi Kesalahan</h1>
        <p>Tidak dapat memuat halaman. Silakan coba lagi.</p>
        <button onclick="window.location.reload()" class="retry-button btn btn-primary">
          Muat Ulang
        </button>
      </div>
    `;
  }

  #updatePageTitle(url) {
    const titles = {
      "/": "Dicoding Stories",
      "/add": "Tambah Story - Dicoding Stories",
      "/about": "Tentang - Dicoding Stories",
      "/login": "Masuk - Dicoding Stories",
    };

    document.title = titles[url] || "Dicoding Stories";
  }
}

export default App;
