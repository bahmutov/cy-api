// loads definition for the custom "cy.api" command
/// <reference path="../../dist/types.d.ts" />

describe('hide non RequestOptions', () => {

  it("hides non RequestOptions if env var `API_SHOW_GENUINE_REQUEST_OPTIONS_ONLY` is set to true", {
    env: {
      API_SHOW_GENUINE_REQUEST_OPTIONS_ONLY: true,
    },
  }, () => {
    cy.api({
      url: '/',
      log: true,
      failOnStatusCode: true,
      retryOnStatusCodeFailure: true,
      retryOnNetworkFailure: true,
    })
    cy.get('.cy-api > div > .hljs').last()
      .should("not.contain.text", `"log": true`)
      .should("not.contain.text", `"failOnStatusCode": true`)
      .should("not.contain.text", `"retryOnStatusCodeFailure": true`)
      .should("not.contain.text", `"retryOnNetworkFailure": true`)
    cy.api({
      url: '/unknown-route',
      log: false,
      failOnStatusCode: false,
      retryOnStatusCodeFailure: false,
      retryOnNetworkFailure: false,
    })
    cy.get('.cy-api > div > .hljs').last()
      .should("not.contain.text", `"log": false`)
      .should("not.contain.text", `"failOnStatusCode": false`)
      .should("not.contain.text", `"retryOnStatusCodeFailure": false`)
      .should("not.contain.text", `"retryOnNetworkFailure": false`)
  })
  
})
