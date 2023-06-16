describe('Retrieving announces test', () => {
    it('test1', () => {
      cy.visit('https://squareinvest.netlify.app/')
			cy.getAnnouncesCountFromDatabase().then((expectedCount) => {
				cy.get('#appartement-list .appartement').should('have.length', expectedCount);
			});
    })
  })
