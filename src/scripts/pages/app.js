import routes from "../routes/routes.js";
import { getActiveRoute } from "../routes/url-parser.js";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();
    this.#setupViewTransitions();
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

    window.addEventListener("hashchange", async () => {
      if (document.startViewTransition) {
        await document.startViewTransition(async () => {
          await this.renderPage();
        }).finished;
      } else {
        await this.renderPage();
      }
    });
  }

  async renderPage() {
    try {
      const url = getActiveRoute();
      const page = routes[url];

      if (!page) {
        this.#content.innerHTML = `
          <div class="error-container">
            <h1>404 - Halaman Tidak Ditemukan</h1>
            <p>Halaman yang Anda cari tidak tersedia.</p>
            <a href="#/" class="retry-button">Kembali ke Beranda</a>
          </div>
        `;
        return;
      }

      this.#content.innerHTML = await page.render();

      if (page.afterRender) {
        await page.afterRender();
      }

      this.#content.focus();

      this.#updatePageTitle(url);
    } catch (error) {
      console.error("Error rendering page:", error);
      this.#content.innerHTML = `
        <div class="error-container">
          <h1>Terjadi Kesalahan</h1>
          <p>Tidak dapat memuat halaman. Silakan coba lagi.</p>
          <button onclick="window.location.reload()" class="retry-button">
            Muat Ulang
          </button>
        </div>
      `;
    }
  }

  #updatePageTitle(url) {
    const titles = {
      "/": "Dicoding Stories",
      "/add": "Tambah Story - Dicoding Stories",
      "/about": "Tentang - Dicoding Stories",
    };

    document.title = titles[url] || "Dicoding Stories";
  }
}

export default App;
