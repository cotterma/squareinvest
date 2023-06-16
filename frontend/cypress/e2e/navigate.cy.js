describe('Navigation test', () => {
  it('test1', () => {
    cy.visit('https://squareinvest.netlify.app/')
    cy.get('.menu > :nth-child(1)').click()
    cy.get('.home-main').should('be.visible')
    cy.get('.menu > :nth-child(2)').click()
    cy.get('.appartement-main').should('be.visible')
    cy.get('.menu > :nth-child(3)').click()
    cy.get('.document-main').should('be.visible')
  })
})