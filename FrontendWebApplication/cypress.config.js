const { defineConfig } = require('cypress');

module.exports = defineConfig({
  video: false,
  screenshotOnRunFailure: true,
  chromeWebSecurity: false,
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    retries: {
      runMode: 2,
      openMode: 0,
    },
    env: {
      apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'
    },
    // Non-interactive in CI by design
  },
});
