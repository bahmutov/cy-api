// loads definition for the custom "cy.api" command
/// <reference path="../../dist/types.d.ts" />

describe('hide non RequestOptions', () => {


  it("hides non RequestOptions if env var `API_SHOW_GENUINE_REQUEST_OPTIONS_ONLY` is set to true", {
    env: {
      API_SHOW_GENUINE_REQUEST_OPTIONS_ONLY: true,
    },
  }, () => {
    cy.api({
      url: '/unknown-route',
      log: false,
      failOnStatusCode: false,
      retryOnStatusCodeFailure: false,
      retryOnNetworkFailure: false,
    })
    cy.get('.cy-api > div > .hljs')
      .should("not.contain.text", `"log": false`)
      .should("not.contain.text", `"failOnStatusCode": false`)
      .should("not.contain.text", `"failOnStatusCode": false`)
      .should("not.contain.text", `"failOnStatusCode": false`)
  })
})
