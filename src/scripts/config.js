const CONFIG = {
  BASE_URL: "https://story-api.dicoding.dev/v1",
  API_VERSION: "v1",

  DEFAULT_LOCATION: {
    lat: -6.2088,
    lng: 106.8456,
  },

  MAP_TILES: {
    openstreetmap: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "© OpenStreetMap contributors",
      name: "Street Map",
      maxZoom: 19,
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "© Esri, DigitalGlobe, GeoEye, Earthstar Geographics",
      name: "Satellite",
      maxZoom: 18,
    },
    terrain: {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: "© OpenTopoMap (CC-BY-SA)",
      name: "Terrain",
      maxZoom: 17,
    },
  },

  CAMERA_CONSTRAINTS: {
    video: {
      width: { ideal: 1280, max: 1920 },
      height: { ideal: 720, max: 1080 },
      facingMode: "environment",
    },
  },

  VALIDATION: {
    MIN_DESCRIPTION_LENGTH: 10,
    MAX_DESCRIPTION_LENGTH: 500,
    MAX_FILE_SIZE: 1024 * 1024,
    ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    MIN_PASSWORD_LENGTH: 8,
    MIN_NAME_LENGTH: 2,
  },

  UI: {
    TOAST_DURATION: 3000,
    LOADING_DELAY: 100,
    ANIMATION_DURATION: 300,
    MAP_DEFAULT_ZOOM: 13,
    MAP_CLUSTER_ZOOM: 15,
  },

  ENDPOINTS: {
    REGISTER: "/register",
    LOGIN: "/login",
    STORIES: "/stories",
    STORIES_GUEST: "/stories/guest",
    STORY_DETAIL: "/stories",
    NOTIFICATIONS_SUBSCRIBE: "/notifications/subscribe",
    NOTIFICATIONS_UNSUBSCRIBE: "/notifications/subscribe",
  },

  VAPID_PUBLIC_KEY:
    "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk",

  STORAGE_KEYS: {
    USER_DATA: "dicoding_stories_user",
    AUTH_TOKEN: "dicoding_stories_token",
    PREFERENCES: "dicoding_stories_preferences",
  },

  ERROR_MESSAGES: {
    NETWORK_ERROR: "Tidak dapat terhubung ke server. Periksa koneksi internet.",
    AUTH_EXPIRED: "Sesi Anda telah berakhir. Silakan login kembali.",
    INVALID_CREDENTIALS: "Email atau password salah.",
    REGISTRATION_FAILED: "Gagal mendaftar. Email mungkin sudah terdaftar.",
    STORY_UPLOAD_FAILED: "Gagal mengunggah story. Silakan coba lagi.",
    CAMERA_ACCESS_DENIED: "Akses kamera ditolak. Periksa pengaturan browser.",
    LOCATION_ACCESS_DENIED: "Akses lokasi ditolak. Periksa pengaturan browser.",
    FILE_TOO_LARGE: "Ukuran file terlalu besar. Maksimal 1MB.",
    INVALID_FILE_TYPE:
      "Tipe file tidak didukung. Gunakan JPEG, PNG, atau WebP.",
  },
};

export default CONFIG;
