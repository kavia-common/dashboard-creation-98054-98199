/* Custom Cypress commands for the dashboard app
   Note: Using @testing-library/cypress ensures stable install of testing-library commands.
*/
import '@testing-library/cypress';



Cypress.Commands.add('mockApi', () => {
  // read base url if needed
  const api = Cypress.config('env').apiBaseUrl || 'http://localhost:8000';

  // Login
  cy.intercept('POST', `${api}/login`, (req) => {
    const { email, password } = req.body || {};
    if (email === 'admin@example.com' && password === 'secret123') {
      req.reply({ statusCode: 200, body: { access_token: 'fake.jwt.token', token_type: 'bearer' } });
    } else {
      req.reply({ statusCode: 401, body: { detail: 'Invalid credentials' } });
    }
  }).as('login');

  // Users CRUD
  let users = Array.from({ length: 5 }).map((_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
  }));

  cy.intercept('GET', `${api}/users*`, (req) => {
    const q = req.query?.q?.toLowerCase?.() || '';
    const filtered = q
      ? users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      : users;
    req.reply({ statusCode: 200, body: { items: filtered, total: filtered.length } });
  }).as('getUsers');

  cy.intercept('POST', `${api}/users`, (req) => {
    const { name, email } = req.body || {};
    if (!name || !email || !/\S+@\S+\.\S+/.test(email)) {
      return req.reply({ statusCode: 422, body: { detail: 'Validation failed' } });
    }
    const id = (users.at(-1)?.id || 0) + 1;
    const item = { id, name, email };
    users.push(item);
    req.reply({ statusCode: 201, body: item });
  }).as('createUser');

  cy.intercept('PUT', new RegExp(`${api}/users/\\d+$`), (req) => {
    const id = parseInt(req.url.split('/').pop(), 10);
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return req.reply({ statusCode: 404, body: { detail: 'Not found' } });
    users[idx] = { ...users[idx], ...req.body };
    req.reply({ statusCode: 200, body: users[idx] });
  }).as('updateUser');

  cy.intercept('DELETE', new RegExp(`${api}/users/\\d+$`), (req) => {
    const id = parseInt(req.url.split('/').pop(), 10);
    users = users.filter(u => u.id !== id);
    req.reply({ statusCode: 204, body: {} });
  }).as('deleteUser');

  // Reports CRUD
  let reports = Array.from({ length: 5 }).map((_, i) => ({
    id: i + 1,
    title: `Report ${i + 1}`,
    status: i % 2 ? 'open' : 'closed',
  }));

  cy.intercept('GET', `${api}/reports*`, (req) => {
    const q = req.query?.q?.toLowerCase?.() || '';
    const filtered = q
      ? reports.filter(r => r.title.toLowerCase().includes(q))
      : reports;
    req.reply({ statusCode: 200, body: { items: filtered, total: filtered.length } });
  }).as('getReports');

  cy.intercept('POST', `${api}/reports`, (req) => {
    const { title, status } = req.body || {};
    if (!title || !status) {
      return req.reply({ statusCode: 422, body: { detail: 'Validation failed' } });
    }
    const id = (reports.at(-1)?.id || 0) + 1;
    const item = { id, title, status };
    reports.push(item);
    req.reply({ statusCode: 201, body: item });
  }).as('createReport');

  cy.intercept('PUT', new RegExp(`${api}/reports/\\d+$`), (req) => {
    const id = parseInt(req.url.split('/').pop(), 10);
    const idx = reports.findIndex(r => r.id === id);
    if (idx === -1) return req.reply({ statusCode: 404, body: { detail: 'Not found' } });
    reports[idx] = { ...reports[idx], ...req.body };
    req.reply({ statusCode: 200, body: reports[idx] });
  }).as('updateReport');

  cy.intercept('DELETE', new RegExp(`${api}/reports/\\d+$`), (req) => {
    const id = parseInt(req.url.split('/').pop(), 10);
    reports = reports.filter(r => r.id !== id);
    req.reply({ statusCode: 204, body: {} });
  }).as('deleteReport');

  // Charts
  cy.intercept('GET', `${api}/charts/data*`, (req) => {
    const range = req.query?.range || '7d';
    const len = range === '90d' ? 9 : range === '30d' ? 6 : 7;
    const labels = Array.from({ length: len }).map((_, i) => `D${i + 1}`);
    const series = labels.map((_, i) => (i + 1) * 10);
    req.reply({
      statusCode: 200,
      body: {
        line: { labels, series },
        bar: { labels, series: series.map(v => v / 2) },
        pie: { labels: ['A', 'B', 'C'], series: [40, 30, 30] }
      }
    });
  }).as('getCharts');
});

Cypress.Commands.add('loginUI', (email = 'admin@example.com', password = 'secret123') => {
  cy.visit('/login');
  cy.findByLabelText(/email/i).type(email);
  cy.findByLabelText(/password/i).type(password);
  cy.findByRole('button', { name: /sign in/i }).click();
  cy.wait('@login');
  // after successful login, app redirects to /
});

Cypress.Commands.add('seedAuth', () => {
  // directly set a valid token if bypassing UI is desired
  window.localStorage.setItem('token', 'fake.jwt.token');
});

import 'cypress-plugin-testing-library';
