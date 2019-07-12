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
    ).then(response => {
      expect(response).to.include.keys([
        'status',
        'statusText',
        'body',
        'requestHeaders',
        'headers',
        'duration'
      ])
      expect(response.body).to.equal('Hello World!')
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
      const logs = Cypress._.filter(messages, {
        type: 'console',
        namespace: 'log'
      })
      expect(logs, '1 console.log message').to.have.length(1)
      expect(logs[0]).to.deep.include({
        type: 'console',
        namespace: 'log',
        message: 'processing GET /'
      })
    })
  })
})
