export const VIEW_MODE_CONFIG = {
  transition: {
    galaxyToStellar: {
      duration: 2000,
      cameraDistance: 15,
      easing: 'easeInOut',
    },
    stellarToGalaxy: {
      duration: 1500,
      cameraDistance: 20,
      easing: 'easeOut',
    },
  },
  thresholds: {
    maxStellarZoomDistance: 20,
    minGalaxyZoomDistance: 2,
  },
};
