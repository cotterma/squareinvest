import admin_pass from "../../../password";
import 'cypress-file-upload'

describe('Retrieving announces test', () => {
    it('test1', () => {
      cy.visit('https://squareinvest.netlify.app/')
			cy.getAnnouncesCountFromDatabase().then((expectedCount) => {
				cy.get('#appartement-list .appartement').should('have.length', expectedCount);
			});
    })

    it('login to admin dashboard and add announce', () => {
      cy.visit('https://squareinvest.netlify.app/'); // Replace with the actual path to your page

      // Fill out the form fields
      cy.get('#admin-main').click();
      cy.get('#espace-admin').click();
      cy.get('#auth-password').type(admin_pass);
      cy.get('#auth-valid').click();

      cy.get('#admin-main').click();
      cy.get('#description-annonce').type('Sample Description');
      cy.get('#prix-annonce').type('100');
      // Attach a file
      cy.get('#image').attachFile('../../images/grenoble.jpg');
  
      // Submit the form
      cy.get('#send-annonce').click();
    })
  })
