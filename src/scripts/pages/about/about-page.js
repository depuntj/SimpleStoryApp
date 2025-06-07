export default class AboutPage {
  async render() {
    return `
      <section class="about-page">
        <div class="about-hero">
          <div class="hero-background">
            <div class="hero-shapes">
              <div class="shape shape-1"></div>
              <div class="shape shape-2"></div>
              <div class="shape shape-3"></div>
            </div>
          </div>
          
          <div class="container">
            <div class="hero-content">
              <div class="hero-icon">
                <i class="fas fa-book-open"></i>
              </div>
              <h1>Tentang Dicoding Stories</h1>
              <p class="hero-subtitle">Platform berbagi cerita untuk komunitas Dicoding yang menghubungkan para pengembang dari seluruh Indonesia</p>
              
              <div class="hero-stats">
                <div class="stat-card">
                  <i class="fas fa-users"></i>
                  <div>
                    <span class="stat-number">10K+</span>
                    <span class="stat-label">Pengguna Aktif</span>
                  </div>
                </div>
                <div class="stat-card">
                  <i class="fas fa-images"></i>
                  <div>
                    <span class="stat-number">50K+</span>
                    <span class="stat-label">Stories Dibagikan</span>
                  </div>
                </div>
                <div class="stat-card">
                  <i class="fas fa-map-marker-alt"></i>
                  <div>
                    <span class="stat-number">100+</span>
                    <span class="stat-label">Kota di Indonesia</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="container">
          <div class="about-content">
            
            <!-- What is Dicoding Stories -->
            <section class="content-section" data-aos="fade-up">
              <div class="section-icon">
                <i class="fas fa-lightbulb"></i>
              </div>
              <div class="section-content">
                <h2>Apa itu Dicoding Stories?</h2>
                <p>
                  Dicoding Stories adalah platform inovatif yang memungkinkan anggota komunitas Dicoding 
                  untuk berbagi cerita, pengalaman, dan momen berharga mereka dalam perjalanan belajar 
                  teknologi. Dengan fitur foto dan lokasi, setiap story menjadi lebih hidup dan bermakna.
                </p>
                <p>
                  Platform ini dirancang khusus untuk memfasilitasi koneksi antar developer, berbagi 
                  inspirasi, dan membangun komunitas yang solid di seluruh Indonesia.
                </p>
              </div>
            </section>

            <!-- Features -->
            <section class="content-section features-section" data-aos="fade-up" data-aos-delay="100">
              <div class="section-header">
                <h2>
                  <i class="fas fa-star"></i>
                  Fitur Unggulan
                </h2>
                <p>Discover amazing features that make sharing stories more engaging</p>
              </div>
              
              <div class="features-grid">
                <div class="feature-card" data-aos="zoom-in" data-aos-delay="200">
                  <div class="feature-icon">
                    <i class="fas fa-camera"></i>
                  </div>
                  <h3>Ambil Foto Langsung</h3>
                  <p>Ambil foto langsung dengan kamera perangkat Anda untuk story yang lebih autentik dan real-time</p>
                  <div class="feature-highlight">Real-time Camera</div>
                </div>
                
                <div class="feature-card" data-aos="zoom-in" data-aos-delay="300">
                  <div class="feature-icon">
                    <i class="fas fa-edit"></i>
                  </div>
                  <h3>Deskripsi Interaktif</h3>
                  <p>Tulis deskripsi yang menarik dengan counter karakter dan validasi real-time untuk pengalaman yang optimal</p>
                  <div class="feature-highlight">Smart Writing</div>
                </div>
                
                <div class="feature-card" data-aos="zoom-in" data-aos-delay="400">
                  <div class="feature-icon">
                    <i class="fas fa-map-marked-alt"></i>
                  </div>
                  <h3>Peta Interaktif</h3>
                  <p>Tandai lokasi pada peta interaktif dan lihat stories dari seluruh Indonesia dalam satu tampilan</p>
                  <div class="feature-highlight">Location Based</div>
                </div>
                
                <div class="feature-card" data-aos="zoom-in" data-aos-delay="500">
                  <div class="feature-icon">
                    <i class="fas fa-mobile-alt"></i>
                  </div>
                  <h3>Mobile First</h3>
                  <p>Dioptimalkan untuk perangkat mobile dengan desain responsif dan PWA untuk pengalaman native-like</p>
                  <div class="feature-highlight">PWA Ready</div>
                </div>
                
                <div class="feature-card" data-aos="zoom-in" data-aos-delay="600">
                  <div class="feature-icon">
                    <i class="fas fa-universal-access"></i>
                  </div>
                  <h3>Aksesibilitas Universal</h3>
                  <p>Dirancang dengan standar aksesibilitas tinggi untuk memastikan semua pengguna dapat menikmati platform</p>
                  <div class="feature-highlight">A11Y Compliant</div>
                </div>
                
                <div class="feature-card" data-aos="zoom-in" data-aos-delay="700">
                  <div class="feature-icon">
                    <i class="fas fa-magic"></i>
                  </div>
                  <h3>Transisi Halus</h3>
                  <p>Nikmati transisi halaman yang smooth dengan View Transition API untuk pengalaman browsing yang menyenangkan</p>
                  <div class="feature-highlight">Smooth UX</div>
                </div>
              </div>
            </section>

            <!-- Technology Stack -->
            <section class="content-section tech-section" data-aos="fade-up" data-aos-delay="200">
              <div class="section-header">
                <h2>
                  <i class="fas fa-code"></i>
                  Teknologi yang Digunakan
                </h2>
                <p>Built with modern web technologies for optimal performance</p>
              </div>
              
              <div class="tech-categories">
                <div class="tech-category" data-aos="slide-right" data-aos-delay="300">
                  <h3>
                    <i class="fas fa-desktop"></i>
                    Frontend
                  </h3>
                  <div class="tech-list">
                    <div class="tech-item">
                      <i class="fab fa-js-square"></i>
                      <div>
                        <span class="tech-name">Vanilla JavaScript</span>
                        <span class="tech-desc">ES6+ modern syntax</span>
                      </div>
                    </div>
                    <div class="tech-item">
                      <i class="fab fa-css3-alt"></i>
                      <div>
                        <span class="tech-name">CSS3 Advanced</span>
                        <span class="tech-desc">Grid, Flexbox, Custom Properties</span>
                      </div>
                    </div>
                    <div class="tech-item">
                      <i class="fab fa-html5"></i>
                      <div>
                        <span class="tech-name">HTML5 Semantic</span>
                        <span class="tech-desc">Accessibility & SEO optimized</span>
                      </div>
                    </div>
                    <div class="tech-item">
                      <i class="fas fa-mobile-alt"></i>
                      <div>
                        <span class="tech-name">Progressive Web App</span>
                        <span class="tech-desc">Offline support & installable</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="tech-category" data-aos="slide-left" data-aos-delay="400">
                  <h3>
                    <i class="fas fa-server"></i>
                    API & Services
                  </h3>
                  <div class="tech-list">
                    <div class="tech-item">
                      <i class="fas fa-cloud"></i>
                      <div>
                        <span class="tech-name">Dicoding Story API</span>
                        <span class="tech-desc">RESTful API with authentication</span>
                      </div>
                    </div>
                    <div class="tech-item">
                      <i class="fas fa-map"></i>
                      <div>
                        <span class="tech-name">Leaflet Maps</span>
                        <span class="tech-desc">Interactive mapping solution</span>
                      </div>
                    </div>
                    <div class="tech-item">
                      <i class="fas fa-camera"></i>
                      <div>
                        <span class="tech-name">Camera API</span>
                        <span class="tech-desc">Device camera integration</span>
                      </div>
                    </div>
                    <div class="tech-item">
                      <i class="fas fa-location-arrow"></i>
                      <div>
                        <span class="tech-name">Geolocation API</span>
                        <span class="tech-desc">Location detection & mapping</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="tech-category" data-aos="slide-right" data-aos-delay="500">
                  <h3>
                    <i class="fas fa-cubes"></i>
                    Arsitektur
                  </h3>
                  <div class="tech-list">
                    <div class="tech-item">
                      <i class="fas fa-layer-group"></i>
                      <div>
                        <span class="tech-name">Single Page Application</span>
                        <span class="tech-desc">Fast & seamless navigation</span>
                      </div>
                    </div>
                    <div class="tech-item">
                      <i class="fas fa-sitemap"></i>
                      <div>
                        <span class="tech-name">Model-View-Presenter</span>
                        <span class="tech-desc">Clean separation of concerns</span>
                      </div>
                    </div>
                    <div class="tech-item">
                      <i class="fas fa-puzzle-piece"></i>
                      <div>
                        <span class="tech-name">Component-based</span>
                        <span class="tech-desc">Reusable & maintainable code</span>
                      </div>
                    </div>
                    <div class="tech-item">
                      <i class="fas fa-route"></i>
                      <div>
                        <span class="tech-name">Hash-based Routing</span>
                        <span class="tech-desc">Client-side navigation</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Accessibility Features -->
            <section class="content-section accessibility-section" data-aos="fade-up" data-aos-delay="300">
              <div class="section-header">
                <h2>
                  <i class="fas fa-universal-access"></i>
                  Fitur Aksesibilitas
                </h2>
                <p>Memastikan platform dapat diakses oleh semua pengguna</p>
              </div>
              
              <div class="accessibility-grid">
                <div class="a11y-item" data-aos="flip-left" data-aos-delay="400">
                  <i class="fas fa-link"></i>
                  <h3>Skip to Content</h3>
                  <p>Tautan langsung ke konten utama untuk pengguna keyboard</p>
                </div>
                
                <div class="a11y-item" data-aos="flip-left" data-aos-delay="500">
                  <i class="fas fa-tags"></i>
                  <h3>Semantic HTML</h3>
                  <p>Elemen HTML semantik untuk screen reader yang optimal</p>
                </div>
                
                <div class="a11y-item" data-aos="flip-left" data-aos-delay="600">
                  <i class="fas fa-bullseye"></i>
                  <h3>Focus Management</h3>
                  <p>Navigasi keyboard yang intuitif dan visible focus indicators</p>
                </div>
                
                <div class="a11y-item" data-aos="flip-left" data-aos-delay="700">
                  <i class="fas fa-volume-up"></i>
                  <h3>Screen Reader Support</h3>
                  <p>ARIA labels dan announcements untuk pengguna screen reader</p>
                </div>
                
                <div class="a11y-item" data-aos="flip-left" data-aos-delay="800">
                  <i class="fas fa-keyboard"></i>
                  <h3>Keyboard Navigation</h3>
                  <p>Semua fitur dapat diakses menggunakan keyboard saja</p>
                </div>
                
                <div class="a11y-item" data-aos="flip-left" data-aos-delay="900">
                  <i class="fas fa-adjust"></i>
                  <h3>High Contrast</h3>
                  <p>Dukungan mode kontras tinggi dan dark theme</p>
                </div>
              </div>
            </section>

            <!-- Call to Action -->
            <section class="cta-section" data-aos="zoom-in" data-aos-delay="400">
              <div class="cta-content">
                <h2>
                  <i class="fas fa-rocket"></i>
                  Siap Berbagi Story Anda?
                </h2>
                <p>Bergabunglah dengan ribuan developer lainnya dan mulai berbagi pengalaman Anda hari ini!</p>
                
                <div class="cta-buttons">
                  <a href="#/add" class="cta-btn primary">
                    <i class="fas fa-plus-circle"></i>
                    Buat Story Pertama
                  </a>
                  <a href="#/" class="cta-btn secondary">
                    <i class="fas fa-eye"></i>
                    Lihat Stories
                  </a>
                </div>
              </div>
              
              <div class="cta-decoration">
                <div class="decoration-item">📱</div>
                <div class="decoration-item">💻</div>
                <div class="decoration-item">🚀</div>
                <div class="decoration-item">⭐</div>
              </div>
            </section>

          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.initializeAnimations();
    this.setupInteractiveElements();
  }

  initializeAnimations() {
    // Simple scroll-based animations without external library
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    // Observe all animatable elements
    document.querySelectorAll("[data-aos]").forEach((el) => {
      observer.observe(el);
    });

    // Animate hero stats on load
    setTimeout(() => {
      this.animateHeroStats();
    }, 500);
  }

  animateHeroStats() {
    const statNumbers = document.querySelectorAll(".stat-number");
    statNumbers.forEach((stat, index) => {
      const finalValue = stat.textContent;
      const numericValue = parseInt(finalValue.replace(/\D/g, ""));
      const suffix = finalValue.replace(/[\d,]/g, "");

      let currentValue = 0;
      const increment = Math.ceil(numericValue / 50);

      const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= numericValue) {
          currentValue = numericValue;
          clearInterval(timer);
        }

        stat.textContent = currentValue.toLocaleString() + suffix;
      }, 30 + index * 10);
    });
  }

  setupInteractiveElements() {
    // Feature cards hover effects
    document.querySelectorAll(".feature-card").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-8px)";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0)";
      });
    });

    // Tech items click effects
    document.querySelectorAll(".tech-item").forEach((item) => {
      item.addEventListener("click", () => {
        item.style.transform = "scale(1.05)";
        setTimeout(() => {
          item.style.transform = "scale(1)";
        }, 150);
      });
    });

    // Smooth scroll for CTA buttons
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }
}
