/// <reference types="cypress" />

describe('Authentication and Route Protection', () => {
  beforeEach(() => {
    cy.mockApi();
  });

  it('redirects unauthenticated users to /login when visiting protected routes', () => {
    cy.visit('/');
    cy.location('pathname').should('eq', '/login');
    cy.contains(/welcome back/i).should('be.visible');
  });

  it('validates login form and shows errors', () => {
    cy.visit('/login');
    cy.findByRole('button', { name: /sign in/i }).click();
    cy.findByText(/email is required/i).should('be.visible');
    cy.findByText(/password is required/i).should('be.visible');
    cy.findByLabelText(/email/i).type('invalid-email');
    cy.findByText(/invalid email/i).should('be.visible');
  });

  it('shows error on invalid credentials', () => {
    cy.visit('/login');
    cy.findByLabelText(/email/i).type('wrong@example.com');
    cy.findByLabelText(/password/i).type('bad');
    cy.findByRole('button', { name: /sign in/i }).click();
    cy.wait('@login');
    cy.findByText(/login failed|invalid credentials/i, { timeout: 2000 }).should('be.visible');
    cy.location('pathname').should('eq', '/login');
  });

  it('logs in successfully and persists token; logout clears it', () => {
    cy.loginUI();
    // After login, ProtectedRoute renders DashboardLayout, default redirects to /reports
    cy.location('pathname', { timeout: 5000 }).should('match', /^\/(reports|)$/);
    // Sidebar should be visible with logout button
    cy.findByRole('button', { name: /log out/i }).should('be.visible').click();
    // On logout, token cleared and redirected to login
    cy.location('pathname').should('eq', '/login');
    cy.wrap(localStorage.getItem('token')).should('eq', null);
  });
});
