describe('Sidebar Navigation and Route Highlighting', () => {
  beforeEach(() => {
    cy.mockApi();
    cy.visit('/login');
    cy.loginUI();
  });

  it('navigates between Reports, Users, and Charts with active highlight', () => {
    // Default landing is /reports
    cy.location('pathname').should('include', '/reports');
    cy.get('.nav a.active').contains(/reports/i).should('exist');

    cy.get('.nav').contains(/users/i).click();
    cy.location('pathname').should('include', '/users');
    cy.get('.nav a.active').contains(/users/i).should('exist');

    cy.get('.nav').contains(/charts/i).click();
    cy.location('pathname').should('include', '/charts');
    cy.get('.nav a.active').contains(/charts/i).should('exist');
  });

  it('theme toggle switches icon (basic smoke)', () => {
    cy.get('.theme-toggle').click();
    cy.get('.theme-toggle').should('exist');
  });
});
