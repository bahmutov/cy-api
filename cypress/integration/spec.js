// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />

describe('cy.api', () => {
  it('calls API method', () => {
    cy.api(
      {
        url: '/'
      },
      'hello world'
    )
  })

  it.only('yields API call result', () => {
    cy.api(
      {
        url: '/'
      },
      'hello world'
    ).then(subject => {
      expect(subject).to.include.keys([
        'status',
        'statusText',
        'body',
        'requestHeaders',
        'headers',
        'duration'
      ])
      expect(subject.body).to.equal('Hello World!')
    })
  })
})
