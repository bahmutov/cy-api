// loads definition for the custom "cy.api" command
/// <reference path="../../dist/types.d.ts" />

describe('show non RequestOptions', () => {

  it("show non RequestOptions if env var `API_SHOW_GENUINE_REQUEST_OPTIONS_ONLY` is not set", () => {
    cy.api({
      url: '/',
      log: false,
      failOnStatusCode: false,
      retryOnStatusCodeFailure: false,
      retryOnNetworkFailure: false,
    })
    cy.get('.cy-api > div > .hljs')
      .should("contain.text", `"log": false`)
      .should("contain.text", `"failOnStatusCode": false`)
      .should("contain.text", `"retryOnStatusCodeFailure": false`)
      .should("contain.text", `"retryOnNetworkFailure": false`)
  })

  it("shows non RequestOptions if env var `API_SHOW_GENUINE_REQUEST_OPTIONS_ONLY` is set to false", {
    env: {
      API_SHOW_GENUINE_REQUEST_OPTIONS_ONLY: false,
    },
  }, () => {
    cy.api({
      url: '/unknown-route',
      log: false,
      failOnStatusCode: false,
      retryOnStatusCodeFailure: false,
      retryOnNetworkFailure: false,
    })
    cy.get('.cy-api > div > .hljs').first()
      .should("contain.text", `"log": false`)
      .should("contain.text", `"failOnStatusCode": false`)
      .should("contain.text", `"failOnStatusCode": false`)
      .should("contain.text", `"failOnStatusCode": false`)

    cy.api({
      url: '/',
      log: true,
      failOnStatusCode: true,
      retryOnStatusCodeFailure: true,
      retryOnNetworkFailure: true,
    })
    cy.get('.cy-api > div > .hljs').last()
      .should("contain.text", `"log": true`)
      .and("contain.text", `"failOnStatusCode": true`)
      .and("contain.text", `"failOnStatusCode": true`)
      .and("contain.text", `"failOnStatusCode": true`)
  })

})
