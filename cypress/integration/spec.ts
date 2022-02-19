// loads definition for the custom "cy.api" command
/// <reference path="../../dist/types.d.ts" />

describe('cy.api', () => {
  it('calls API method', () => {
    cy.api(
      {
        url: '/'
      }
    )
  })

  it('calls API without displaying request', { apiDisplayRequest: false }, () => {
    cy.get('body').should('not.contain', 'MY PAGE')
    cy.api(
      {
        url: '/',
      }
    )
    cy.get('.container').should('not.contain', 'Request')
    cy.visit('/test.html')
    cy.contains('MY PAGE')
    cy.url().should('contain', 'test.html')
    cy.api(
      {
        url: '/',
      },
      'hello world'
    )
    cy.contains('MY PAGE')
    cy.get('.container').should('not.contain', 'Request')
  })

  it('calls several times', () => {
    const options = { url: '/' }
    cy.api(options, 'first')
    cy.api(options, 'second')
    cy.api(options, 'third')
  })

  it('yields API call result', () => {
    cy.api(
      {
        url: '/'
      },
      'my hello world'
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
      console.table(messages)
      // filter for "console.log" messages
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


  it('yields result that has log messages with API_MESSAGES true', {
    env: {
      API_MESSAGES: true
    }
  }, () => {
    cy.api(
      {
        url: '/'
      },
      'hello world'
    ).then(({ messages }) => {
      console.table(messages)
      // filter for "console.log" messages
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

  it('no log messages with API_MESSAGES false', {
    env: {
      API_MESSAGES: false
    }
  }, () => {
    cy.api(
      {
        url: '/'
      },
      'hello world'
    ).then(({ messages }) => {
      console.table(messages)
      expect(messages).to.have.length(0)
    })
  })

})
