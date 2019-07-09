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

  it('yields API call result', () => {
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

  it('yields result that has log messages', () => {
    cy.api(
      {
        url: '/'
      },
      'hello world'
    ).then(({ messages }) => {
      // filter only "console.log" messages
      const logs = Cypress._.filter(messages, { type: 'log' })
      expect(logs).to.deep.equal([
        {
          type: 'log',
          message: 'processing GET /'
        }
      ])
    })
  })
})
