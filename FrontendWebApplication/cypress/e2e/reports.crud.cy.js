describe('Reports CRUD UI', () => {
  beforeEach(() => {
    cy.mockApi();
    cy.loginUI();
    cy.get('.nav').contains(/reports/i).click();
    cy.wait('@getReports');
  });

  it('lists reports and supports search', () => {
    cy.get('table.table tbody tr').should('have.length.at.least', 1);
    cy.get('input.input[placeholder="Search..."]').type('Report 1');
    cy.get('table.table').should('contain.text', 'Report 1');
  });

  it('validates and creates a new report', () => {
    cy.contains(/new report/i).should('be.visible');
    cy.contains('Save').click();
    cy.contains(/title is required/i).should('be.visible');
    cy.contains(/status is required/i).should('be.visible');

    cy.get('input.input').eq(1).type('Quarterly Results'); // title
    cy.get('select.select').select('closed');
    cy.contains('Save').click();
    cy.wait('@createReport');
    cy.contains(/report created/i).should('be.visible');
    cy.get('table.table').should('contain.text', 'Quarterly Results');
  });

  it('edits an existing report', () => {
    cy.get('table.table tbody tr').first().within(() => cy.contains('Edit').click());
    cy.contains(/edit report/i).should('be.visible');
    cy.get('input.input').eq(1).clear().type('Updated Report Title');
    cy.contains('Save').click();
    cy.wait('@updateReport');
    cy.contains(/report updated/i).should('be.visible');
    cy.get('table.table').should('contain.text', 'Updated Report Title');
  });

  it('deletes a report with confirmation', () => {
    cy.on('window:confirm', () => true);
    cy.get('table.table tbody tr').first().within(() => cy.contains('Delete').click());
    cy.wait('@deleteReport');
    cy.contains(/report deleted/i).should('be.visible');
  });
});
