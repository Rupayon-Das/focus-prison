Object.defineProperty(navigator, 'webdriver', { get: () => false });

let mutationObserverInstance;

const purgeAdvertisements = () => {
  try {
    // 1. Visually hide structural ad overlays instead of deleting nodes (prevents layout loops)
    const adContainers = [
      '#masthead-ad', 'ytd-homepage-ad-renderer', 'ytd-banner-promo-renderer',
      '.video-ads', '.ytp-ad-module', '.ytp-ad-overlay-container', 
      'iframe[id^="google_ads_iframe"]', '.ytp-ad-text', 'ytd-promoted-sparkles-web-renderer',
      '.ytp-ad-player-overlay', '.ytp-ad-control-bar-container', '.ytp-ad-message-container'
    ];
    adContainers.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        if (element.style.display !== 'none') {
          element.style.display = 'none';
        }
      });
    });

    // 2. Optimized YouTube Video Ad Fast-Forward Engine
    const videoElement = document.querySelector('video');
    const playerContainer = document.querySelector('.html5-video-player');
    
    // Check YouTube's explicit internal structural CSS state for playing ads
    const isAdPlaying = playerContainer && (
      playerContainer.classList.contains('ad-showing') || 
      playerContainer.classList.contains('ad-interrupting')
    );

    if (videoElement && isAdPlaying) {
      videoElement.muted = true;
      videoElement.playbackRate = 16.0;
      if (!isNaN(videoElement.duration) && isFinite(videoElement.duration) && videoElement.duration > 0) {
        videoElement.currentTime = videoElement.duration - 0.1;
      }
    }

    // Instantly click skip targets if they exist anywhere in the view tree
    const nativeSkipButton = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-ad-skip-button-slot, .ytp-ad-skip-button-container');
    if (nativeSkipButton) {
      nativeSkipButton.click();
    }
  } catch (error) {
    // Catch transient structure state shifts quietly
  }
};

// HIGH-PERFORMANCE LOOP-SAFE OBSERVER
mutationObserverInstance = new MutationObserver(() => {
  // 🚀 DISCONNECT SWITCH: Stop observing layout adjustments during our own clean up cycle
  mutationObserverInstance.disconnect();
  
  purgeAdvertisements();
  
  // RE-ENGAGE WATCHER: Resume monitoring after alterations are completed safely
  if (document.documentElement) {
    mutationObserverInstance.observe(document.documentElement, { childList: true, subtree: true });
  }
});

// Initialize observer immediately upon element tree resolution
if (document.documentElement) {
  mutationObserverInstance.observe(document.documentElement, { childList: true, subtree: true });
}

// Low-frequency safety fallback check (1 second) to catch updates that don't trigger child mutations
setInterval(purgeAdvertisements, 1000);
