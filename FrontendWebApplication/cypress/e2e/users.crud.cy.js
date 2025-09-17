describe('Users CRUD UI', () => {
  beforeEach(() => {
    cy.mockApi();
    // seed auth by UI to exercise the flow and token set
    cy.loginUI();
    cy.get('.nav').contains(/users/i).click();
    cy.wait('@getUsers');
  });

  it('lists users and supports search/filter', () => {
    cy.contains('Users').should('be.visible');
    cy.get('table.table tbody tr').should('have.length.at.least', 1);
    cy.get('input.input[placeholder="Search..."]').type('user 1');
    cy.get('table.table tbody tr').should('have.length.at.least', 1);
  });

  it('validates and creates a new user with success feedback', () => {
    cy.contains(/new user/i).should('be.visible');
    cy.contains('Save').click();
    cy.contains(/name is required/i).should('be.visible');
    cy.contains(/email is required/i).should('be.visible');

    cy.get('input.input').eq(1).type('John Doe'); // name
    cy.get('input[type="email"]').type('not-an-email');
    cy.contains(/invalid email/i).should('be.visible');

    cy.get('input[type="email"]').clear().type('john.doe@example.com');
    cy.contains('Save').click();
    cy.wait('@createUser');
    cy.contains(/user created/i).should('be.visible');
    cy.get('table.table').should('contain.text', 'john.doe@example.com');
  });

  it('edits an existing user', () => {
    cy.get('table.table tbody tr').first().within(() => {
      cy.contains('Edit').click();
    });
    cy.contains(/edit user/i).should('be.visible');
    cy.get('input[type="email"]').clear().type('updated@example.com');
    cy.contains('Save').click();
    cy.wait('@updateUser');
    cy.contains(/user updated/i).should('be.visible');
    cy.get('table.table').should('contain.text', 'updated@example.com');
  });

  it('deletes a user with confirmation', () => {
    // Override confirm to auto-accept
    cy.on('window:confirm', () => true);
    cy.get('table.table tbody tr').first().within(() => {
      cy.contains('Delete').click();
    });
    cy.wait('@deleteUser');
    cy.contains(/user deleted/i).should('be.visible');
  });
});
