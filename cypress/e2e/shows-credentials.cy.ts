// loads definition for the custom "cy.api" command
/// <reference path="../../dist/types.d.ts" />

describe('cy.api', () => {
  it(
    'show credentials',
    {
      env: {
        API_SHOW_CREDENTIALS: true,
      },
    },
    () => {
      cy.api({
        url: '/',
        auth: {
          bearer: 'bearer',
          username: 'login',
          password: 'password',
        },
      }).then((response) => {
        expect(response.status).eq(200)
        cy.contains('"bearer": "bearer"')
        cy.contains('"password": "password"')
      })
    },
  )

  it(
    'show very long credentials',
    {
      env: {
        API_SHOW_CREDENTIALS: true,
      },
    },
    () => {
      cy.api({
        url: '/',
        auth: {
          bearer: Cypress._.repeat('bearer_', 30),
          username: 'login',
          password: 'password',
        },
      }).then((response) => {
        expect(response.status).eq(200)
        cy.contains('"bearer": "bearer_bearer_')
        cy.contains('"password": "password"')
        // you should be able to scroll the container horizontally
      })
    },
  )
})
