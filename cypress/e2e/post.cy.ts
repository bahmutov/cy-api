// loads definition for the custom "cy.api" command
/// <reference path="../../dist/types.d.ts" />

it('sends a POST request', () => {
  cy.api({
    method: 'POST',
    url: '/json',
    body: {
      name: 'Jane',
    },
  })
    .its('body')
    .should('deep.equal', { name: 'Jane' })
})
