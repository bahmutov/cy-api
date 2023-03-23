// loads definition for the custom "cy.api" command
/// <reference path="../../dist/types.d.ts" />

describe('shows-failOnStatusCode', () => {
  it("shows failOnStatusCode if config `showFailOnStatusCode` is set to true", {
    env: {
      API_SHOW_FAILONSTATUSCODE: true,
    },
  }, () => {
    cy.api({
      url: '/unknown-route',
      failOnStatusCode: false,
    })
    cy.get('.cy-api > div > .hljs').first().should("contain.text", `"failOnStatusCode": false`)
    cy.api({
      url: '/',
      failOnStatusCode: true,
    })
    cy.get('.cy-api > div > .hljs').last().should("contain.text", `"failOnStatusCode": true`)
  })
})

