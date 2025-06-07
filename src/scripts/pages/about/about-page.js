export default class AboutPage {
  async render() {
    return `
      <section class="about-page">
        <div class="container">
          <header class="page-header">
            <h1>Tentang Dicoding Stories</h1>
            <p>Platform berbagi cerita untuk komunitas Dicoding</p>
          </header>
          
          <div class="about-content">
            <div class="about-section">
              <h2>Apa itu Dicoding Stories?</h2>
              <p>
                Dicoding Stories adalah platform yang memungkinkan anggota komunitas Dicoding 
                untuk berbagi cerita, pengalaman, dan momen berharga mereka. Aplikasi ini 
                memungkinkan pengguna untuk mengunggah foto beserta deskripsi dan lokasi.
              </p>
            </div>

            <div class="about-section">
              <h2>Fitur Aplikasi</h2>
              <ul class="feature-list">
                <li>📸 Ambil foto langsung dengan kamera</li>
                <li>📝 Tulis deskripsi untuk setiap story</li>
                <li>📍 Tandai lokasi pada peta</li>
                <li>🗺️ Lihat lokasi semua stories di peta interaktif</li>
                <li>📱 Responsif untuk semua perangkat</li>
                <li>♿ Accessible untuk semua pengguna</li>
              </ul>
            </div>

            <div class="about-section">
              <h2>Teknologi yang Digunakan</h2>
              <div class="tech-grid">
                <div class="tech-item">
                  <h3>Frontend</h3>
                  <ul>
                    <li>Vanilla JavaScript</li>
                    <li>CSS3 dengan Flexbox & Grid</li>
                    <li>HTML5 Semantic</li>
                    <li>Progressive Web App</li>
                  </ul>
                </div>
                <div class="tech-item">
                  <h3>API & Services</h3>
                  <ul>
                    <li>Dicoding Story API</li>
                    <li>Leaflet Maps</li>
                    <li>Camera API</li>
                    <li>Geolocation API</li>
                  </ul>
                </div>
                <div class="tech-item">
                  <h3>Arsitektur</h3>
                  <ul>
                    <li>Single Page Application</li>
                    <li>Model-View-Presenter</li>
                    <li>Component-based</li>
                    <li>Hash-based Routing</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="about-section">
              <h2>Accessibility Features</h2>
              <ul class="accessibility-list">
                <li>🔗 Skip to content link</li>
                <li>🏷️ Semantic HTML elements</li>
                <li>🎯 Focus management</li>
                <li>📢 Screen reader support</li>
                <li>⌨️ Keyboard navigation</li>
                <li>🎨 High contrast support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Add any necessary event listeners or initialization here
  }
}
