// loads definition for the custom "cy.api" command
/// <reference path="../../dist/types.d.ts" />

it('sends a PUT request', () => {
  cy.api({
    method: 'PUT',
    url: '/json',
    body: {
      name: 'Jane',
    },
  })
    .its('body')
    .should('deep.equal', { name: 'Jane' })
})
