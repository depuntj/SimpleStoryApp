const CONFIG = {
  BASE_URL: "https://story-api.dicoding.dev/v1",
  MAP_API_KEY: "openstreetmap_free_tiles", // Free OpenStreetMap tiles
  DEFAULT_LOCATION: {
    lat: -6.2088,
    lng: 106.8456,
  },
  MAP_TILES: {
    openstreetmap: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "© OpenStreetMap contributors",
      name: "Street Map",
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "© Esri, DigitalGlobe, GeoEye, Earthstar Geographics",
      name: "Satellite",
    },
    terrain: {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: "© OpenTopoMap (CC-BY-SA)",
      name: "Terrain",
    },
    dark: {
      url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
      attribution:
        "© Stadia Maps, © OpenMapTiles, © OpenStreetMap contributors",
      name: "Dark Mode",
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
    MAX_FILE_SIZE: 1024 * 1024, // 1MB
    ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  },
};

export default CONFIG;
