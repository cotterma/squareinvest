// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getAnnouncesCountFromDatabase', () => {
    // Connect to your Oracle database using the configured credentials
  
    // Execute a query to get the count of announcements
    return cy.task('queryDatabase', 'SELECT COUNT(*) AS count FROM ADMIN."annonces"')
      .then((result) => {
        // Return the count of announcements from the query result
        return result[0].count;
      });
  });