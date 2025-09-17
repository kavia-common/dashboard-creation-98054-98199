describe('Charts Rendering and Interactivity', () => {
  beforeEach(() => {
    cy.mockApi();
    cy.loginUI();
    cy.get('.nav').contains(/charts/i).click();
    cy.wait('@getCharts');
  });

  it('renders Chart.js Line, Bar, and Pie charts and Recharts charts', () => {
    cy.contains(/line \(chart\.js\)/i).should('be.visible');
    cy.contains(/bar \(chart\.js\)/i).should('be.visible');
    cy.contains(/pie \(chart\.js\)/i).should('be.visible');

    // Canvas elements should exist for Chart.js charts
    cy.get('canvas').should('have.length.at.least', 3);

    // Recharts SVGs render in the Recharts sections
    cy.get('.card').contains(/line \(recharts\)/i).parent().find('svg').should('exist');
    cy.get('.card').contains(/pie \(recharts\)/i).parent().find('svg').should('exist');
  });

  it('updates data when filter changes and refresh clicked', () => {
    cy.get('select.select').select('30d');
    cy.wait('@getCharts');
    cy.contains(/refresh/i).click();
    cy.wait('@getCharts');
    // basic assertion that canvases remain after update
    cy.get('canvas').should('have.length.at.least', 3);
  });

  it('shows error notification when charts API fails', () => {
    // Override charts intercept for this test to force an error
    const api = Cypress.config('env').apiBaseUrl || 'http://localhost:8000';
    cy.intercept('GET', `${api}/charts/data*`, { statusCode: 500, body: { detail: 'Server error' } }).as('getChartsError');

    cy.get('select.select').select('90d');
    cy.wait('@getChartsError');
    cy.get('.alert.error').should('contain.text', 'Failed to load chart data').or('contain.text', 'Server error');
  });
});
