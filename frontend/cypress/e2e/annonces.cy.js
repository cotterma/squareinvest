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
      cy.visit('http://127.0.0.1:5500/frontend/index.html'); // Replace with the actual path to your page

      // Fill out the form fields
      cy.get('#admin-main').click();
      cy.get('#espace-admin').click();
      cy.get('#auth-password').type(admin_pass);
      cy.get('#auth-valid').click();

      cy.wait(1000)

      cy.get('#admin-main').click();
      cy.get('#titre-annonce').type('Sample Title')
      cy.get('#description-annonce').type('Sample Description');
      cy.get('#prix-annonce').type('100');
      // Attach a file
      cy.get('#image').attachFile('../../images/grenoble.jpg');
  
      // Submit the form
      cy.get('#send-annonce').click();
      cy.wait(10000)
      cy.intercept('POST', 'https://squareweb.adaptable.app/annonces').as('postAnnonce')
    })

    it('delete previous announce', () =>{
      cy.visit('http://127.0.0.1:5500/frontend/index.html');
      cy.get('#admin-main').click();
      cy.get('#espace-admin').click();
      cy.get('#auth-password').type(admin_pass);
      cy.get('#auth-valid').click();

      cy.wait(5000)
      cy.get('#admin-main').click();
      // Locate the announcement with the specific title
      cy.contains('.annonce-title', 'Sample Title')
      .parent('.annonce')
      .as('selectedAnnouncement');

      // Perform additional actions on the selected announcement
      cy.get('@selectedAnnouncement')
        .find('.annonce-delete')
        .click();
    })
  })
