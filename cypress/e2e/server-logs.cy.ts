// loads definition for the custom "cy.api" command
/// <reference path="../../dist/types.d.ts" />

it('shows the full message from the server logs', () => {
  cy.api({
    method: 'POST',
    url: '/json',
    body: {
      name: 'Jane',
    },
  })
    .its('messages')
    .should('be.an', 'array')
    .map('message')
    .should('deep.equal', ['POST /json', { name: 'Jane' }])

  cy.get('.cy-api-logs-messages').should('not.include.text', '[object Object]')
  cy.get('.cy-api-logs-messages')
    .find('.console.console-log')
    .should('read', ['console log: POST /json', 'console log: {"name":"Jane"}'])
})
