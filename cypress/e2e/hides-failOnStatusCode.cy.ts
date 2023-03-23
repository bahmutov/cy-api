// loads definition for the custom "cy.api" command
/// <reference path="../../dist/types.d.ts" />

describe('hides-failOnStatusCode', () => {
  it("hides failOnStatusCode if config `showFailOnStatusCode` is not set", () => {
    cy.api({
      url: '/',
    })
    cy.get('.cy-api > div > .hljs').should("not.contain.text", `"failOnStatusCode"`)
  })

  it("hides failOnStatusCode if config `showFailOnStatusCode` is set to false", {
    env: {
      API_SHOW_FAILONSTATUSCODE: false,
    },
  }, () => {
    cy.api({
      url: '/unknown-route',
      failOnStatusCode: false,
    })
    cy.get('.cy-api > div > .hljs').should("not.contain.text", `"failOnStatusCode": false`)
  })
})

