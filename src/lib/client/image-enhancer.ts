/**
 * Progressive enhancement for images processed by Velite
 * Adds blur-to-sharp loading effect using data attributes
 */
export function enhanceImages() {
  if (typeof window === 'undefined') return;

  const images = document.querySelectorAll('img.velite-image[data-blur]');

  images.forEach(img => {
    const htmlImg = img as HTMLImageElement;
    const blurDataUrl = htmlImg.getAttribute('data-blur');
    const originalSrc = htmlImg.getAttribute('src');
    const width = htmlImg.getAttribute('data-width');
    const height = htmlImg.getAttribute('data-height');

    if (!blurDataUrl || !originalSrc) return;

    // Skip if already processed
    if (htmlImg.dataset.processed === 'true') return;

    // Set up dimensions for proper layout
    if (width && height) {
      htmlImg.setAttribute('width', width);
      htmlImg.setAttribute('height', height);
    }

    // Apply blur placeholder
    htmlImg.src = blurDataUrl;
    htmlImg.style.filter = 'blur(8px)';
    htmlImg.style.transition = 'filter 0.3s ease-out';

    // Load actual image
    const actualImage = new Image();

    actualImage.onload = () => {
      htmlImg.src = originalSrc;
      htmlImg.style.filter = 'none';
      htmlImg.dataset.processed = 'true';

      // Clean up data attributes after transition
      setTimeout(() => {
        htmlImg.removeAttribute('data-blur');
      }, 300);
    };

    actualImage.onerror = () => {
      // Fallback: just show original without blur
      htmlImg.src = originalSrc;
      htmlImg.style.filter = 'none';
      htmlImg.dataset.processed = 'true';
    };

    actualImage.src = originalSrc;
  });
}

// Auto-initialize
if (typeof window !== 'undefined') {
  const initEnhancement = () => {
    enhanceImages();

    // Re-run for dynamically added content
    const observer = new MutationObserver((mutations) => {
      const hasNewImages = mutations.some(mutation =>
        Array.from(mutation.addedNodes).some(node =>
          node instanceof Element && (
            node.matches?.('img.velite-image[data-blur]') ||
            node.querySelector?.('img.velite-image[data-blur]')
          )
        )
      );

      if (hasNewImages) {
        enhanceImages();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEnhancement);
  } else {
    initEnhancement();
  }
}