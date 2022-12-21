// loads definition for the custom "cy.api" command
/// <reference path="../../dist/types.d.ts" />

describe('cy.api', () => {
  it('mask credentials bearer and password', () => {
    cy.api({
      url: '/',
      auth: {
        bearer: 'bearer',
        username: 'login',
        password: 'password',
      },
    }).then((response) => {
      expect(response.status).eq(200)
      cy.contains('"bearer": "*****"')
      cy.contains('"password": "*****"')
    })
  })
})
