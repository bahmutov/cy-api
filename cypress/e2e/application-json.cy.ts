// loads definition for the custom "cy.api" command
/// <reference path="../../dist/types.d.ts" />

it('serializes JSON response', { viewportHeight: 2000 }, () => {
  cy.api({ method: 'POST', url: '/json-problem', failOnStatusCode: false })
    .its('headers')
    .should('have.property', 'content-type')
    .should('include', 'application/problem+json')
  cy.get('.cy-api-response').should('not.include.text', '[object Object]')
})
