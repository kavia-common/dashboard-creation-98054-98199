/* Global Cypress support for E2E tests */
import './commands';

// Reset localStorage between tests for isolation
beforeEach(() => {
  localStorage.clear();
});
