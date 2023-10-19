// loads definition for the custom "cy.api" command
/// <reference path="../../dist/types.d.ts" />

it('calls API methods', { viewportHeight: 2000 }, () => {
  // get the first random number from the server
  // get the second random number from the server
  // call server to compute the sum
  // confirm the sum is correct
  cy.api(
    {
      url: '/random-number',
    },
    'first number',
  )
    .its('body.n')
    .should('be.within', 0, 10)
    .then((a) => {
      cy.api(
        {
          url: '/random-number',
        },
        'second number',
      )
        .its('body.n')
        .should('be.within', 0, 10)
        .then((b) => {
          cy.api(
            {
              url: '/sum',
              body: {
                a,
                b,
              },
            },
            'sum',
          )
            .its('body.sum')
            .should('equal', a + b)
        })
    })
})
