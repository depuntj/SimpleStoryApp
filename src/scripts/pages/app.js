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

    this.#setupSkipToContent();
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
        <li role="none"><a href="#/" role="menuitem">Beranda</a></li>
        <li role="none"><a href="#/add" role="menuitem">Tambah Story</a></li>
        <li role="none"><a href="#/about" role="menuitem">Tentang</a></li>
        <li class="user-info">
          <span class="user-name">👤 ${currentUser?.name || "User"}</span>
        </li>
        <li role="none"><button id="logout-button" class="logout-button btn btn-secondary" type="button">Keluar</button></li>
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
        <li role="none"><a href="#/login" role="menuitem">Masuk</a></li>
        <li role="none"><a href="#/about" role="menuitem">Tentang</a></li>
      `;
    }
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      const isOpen = this.#navigationDrawer.classList.toggle("open");
      this.#drawerButton.setAttribute("aria-expanded", isOpen.toString());
      this.#navigationDrawer.setAttribute("aria-hidden", (!isOpen).toString());

      if (isOpen) {
        this.#drawerButton.setAttribute("aria-label", "Tutup menu navigasi");
        document.body.style.overflow = "hidden";

        setTimeout(() => {
          const firstMenuItem =
            this.#navigationDrawer.querySelector('[role="menuitem"]');
          if (firstMenuItem) firstMenuItem.focus();
        }, 100);
      } else {
        this.#drawerButton.setAttribute("aria-label", "Buka menu navigasi");
        document.body.style.overflow = "";
      }
    });

    const navCloseBtn = document.getElementById("nav-close-btn");
    if (navCloseBtn) {
      navCloseBtn.addEventListener("click", () => {
        this.#closeDrawer();
        this.#drawerButton.focus();
      });
    }

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#closeDrawer();
      }
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

    this.#navigationDrawer.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        this.#handleMenuTabNavigation(event);
      }
    });

    this.#navigationDrawer.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        this.#closeDrawer();
      }
    });
  }

  #handleMenuTabNavigation(event) {
    const menuItems =
      this.#navigationDrawer.querySelectorAll('[role="menuitem"]');
    const firstMenuItem = menuItems[0];
    const lastMenuItem = menuItems[menuItems.length - 1];
    const navCloseBtn = document.getElementById("nav-close-btn");

    if (event.shiftKey) {
      if (document.activeElement === firstMenuItem) {
        event.preventDefault();
        if (navCloseBtn) navCloseBtn.focus();
      }
    } else {
      if (
        document.activeElement === lastMenuItem ||
        document.activeElement === navCloseBtn
      ) {
        event.preventDefault();
        firstMenuItem.focus();
      }
    }
  }
  #setupSkipToContent() {
    const skipLink = document.getElementById("skip-to-content");
    const mainContent = document.getElementById("main-content");

    if (skipLink && mainContent) {
      skipLink.addEventListener("click", (e) => {
        e.preventDefault();

        mainContent.setAttribute("tabindex", "-1");
        mainContent.focus();

        mainContent.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        this.#announceToScreenReader("Berpindah ke konten utama");
        mainContent.addEventListener(
          "blur",
          () => {
            mainContent.removeAttribute("tabindex");
          },
          { once: true }
        );
      });
      skipLink.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          skipLink.click();
        }
      });
    }
  }

  #closeDrawer() {
    this.#navigationDrawer.classList.remove("open");
    this.#drawerButton.setAttribute("aria-expanded", "false");
    this.#navigationDrawer.setAttribute("aria-hidden", "true");
    this.#drawerButton.setAttribute("aria-label", "Buka menu navigasi");
    document.body.style.overflow = "";
  }

  #setupViewTransitions() {
    if (!("startViewTransition" in document)) {
      return;
    }

    let hashChangeTimeout = null;

    window.addEventListener("hashchange", async (event) => {
      if (hashChangeTimeout) {
        clearTimeout(hashChangeTimeout);
      }

      const oldUrl = event.oldURL?.split("#")[1] || "/";
      const newUrl = window.location.hash.slice(1) || "/";

      hashChangeTimeout = setTimeout(async () => {
        try {
          const transition = document.startViewTransition(async () => {
            await this.renderPage();
          });

          transition.updateCallbackDone.catch(() => {
            console.warn(
              "View transition update failed, continuing without transition"
            );
          });

          await transition.finished.catch(() => {
            console.warn("View transition finished with error");
          });
        } catch (error) {
          console.warn("View transition not supported or failed:", error);
          await this.renderPage();
        }
      }, 50);
    });

    document.addEventListener("DOMContentLoaded", () => {
      if (document.startViewTransition) {
        document.documentElement.style.setProperty(
          "view-transition-name",
          "main"
        );
      }
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
        <div class="loading-container" 
             style="min-height: 200px; display: flex; align-items: center; justify-content: center;"
             role="status"
             aria-label="Memuat halaman">
          <div class="loading-spinner" aria-hidden="true"></div>
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

      this.#updatePageAccessibility();
      this.#updatePageTitle(url);
      this.#lastRenderedUrl = url;

      this.#announcePageChange(url);
      this.#focusMainHeading();

      console.log("Page rendered successfully:", url);
    } catch (error) {
      console.error("Error rendering page:", error);
      this.#showPageError();
    } finally {
      this.#isRendering = false;
    }
  }

  #updatePageAccessibility() {
    const mainContent = this.#content;

    if (mainContent) {
      mainContent.setAttribute("tabindex", "-1");
      mainContent.setAttribute("role", "main");
      mainContent.setAttribute("aria-label", "Konten utama halaman");
    }

    const skipLink = document.getElementById("skip-to-content");
    if (skipLink) {
      skipLink.addEventListener("click", (e) => {
        e.preventDefault();
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: "smooth" });
      });
    }
  }

  #focusMainHeading() {
    setTimeout(() => {
      const headings = this.#content.querySelectorAll(
        "h1, h2, [role='heading']"
      );
      const mainHeading = headings[0];

      if (mainHeading) {
        mainHeading.setAttribute("tabindex", "-1");
        mainHeading.focus();

        const headingText = mainHeading.textContent || mainHeading.innerText;
        this.#announceToScreenReader(`Halaman: ${headingText}`);

        mainHeading.addEventListener(
          "blur",
          () => {
            mainHeading.removeAttribute("tabindex");
          },
          { once: true }
        );
      } else {
        this.#content.focus();
      }
    }, 150);
  }

  #announcePageChange(url) {
    const pageTitles = {
      "/": "Halaman beranda dimuat",
      "/add": "Halaman tambah story dimuat",
      "/about": "Halaman tentang dimuat",
      "/login": "Halaman login dimuat",
    };

    const announcement = pageTitles[url] || "Halaman baru dimuat";
    this.#announceToScreenReader(announcement);
  }

  #announceToScreenReader(message) {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }

  #showNotFound() {
    this.#content.innerHTML = `
      <div class="error-container" role="alert" aria-live="assertive">
        <h1>404 - Halaman Tidak Ditemukan</h1>
        <p>Halaman yang Anda cari tidak tersedia.</p>
        <a href="#/" class="retry-button btn btn-primary">Kembali ke Beranda</a>
      </div>
    `;
  }

  #showPageError() {
    this.#content.innerHTML = `
      <div class="error-container" role="alert" aria-live="assertive">
        <h1>Terjadi Kesalahan</h1>
        <p>Tidak dapat memuat halaman. Silakan coba lagi.</p>
        <button onclick="window.location.reload()" 
                class="retry-button btn btn-primary"
                type="button">
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
