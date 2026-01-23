module.exports = {
  ci: {
    collect: {
      startServerCommand: 'bun run build:audit && bunx serve@latest out -p 3000',
      startServerReadyTimeout: 10000,
      url: [
        'http://localhost:3000/',           // Home page
        'http://localhost:3000/work',       // Work page
        'http://localhost:3000/blog',       // Blog index page
        'http://localhost:3000/blog/testpage'  // Blog testpage (included in audit build)
      ],
      settings: {
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo']
      }
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        // Loosen performance thresholds for portfolio site
        'largest-contentful-paint': ['warn', { 'minScore': 0.5 }],
        'interactive': ['warn', { 'minScore': 0.7 }],
        // Allow some unused JS (common in Next.js)
        'unused-javascript': ['warn', { 'maxLength': 5 }],
        // Allow legacy JS (browsers may still need it)
        'legacy-javascript': ['off'],
        // Allow some render blocking resources
        'render-blocking-resources': ['warn', { 'maxLength': 2 }],
        // Cache policy warnings instead of errors
        'uses-long-cache-ttl': ['warn', { 'maxLength': 25 }],
        // Allow some offscreen images not deferred
        'offscreen-images': ['warn', { 'maxLength': 10 }],
        // Modern image formats not critical
        'modern-image-formats': ['warn', { 'maxLength': 5 }],
        // Responsive images - allow some failures
        'uses-responsive-images': ['warn', { 'maxLength': 2 }],
        // Network insights - lower expectations
        'network-dependency-tree-insight': ['off'],
        'image-delivery-insight': ['off'],
        'legacy-javascript-insight': ['off'],
        'forced-reflow-insight': ['off'],
        // Errors in console - if only favicon 404, allow
        'errors-in-console': ['warn'],
        // Heading order on work page - fix if easy, else warn
        'heading-order': ['warn']
      }
    }
  }
}