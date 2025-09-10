export const VIEW_MODE_CONFIG = {
  transition: {
    galaxyToStellar: {
      duration: 2,
      cameraDistance: 15,
      easing: 'easeInOut',
    },
    stellarToGalaxy: {
      duration: 1.5,
      cameraDistance: 20,
      easing: 'easeOut',
    },
  },
  thresholds: {
    maxStellarZoomDistance: 15,
    minGalaxyZoomDistance: 2,
  },
};
