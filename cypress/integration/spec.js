// loads definition for the custom "cy.api" command
/// <reference path="../../index.d.ts" />

describe('cy.api', () => {
  it('calls API method', () => {
    cy.api(
      {
        url: '/'
      },
      'hello world'
    )
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

  it('filter log', () => {
    cy.api(
      {
        url: '/logs'
      },
      'hello world'
    ).then(({ messages }) => {
      expect(messages).to.have.length(7)
    })

    // All logs are here
    cy.get('.util-debuglog').should('have.length', 2)
    cy.get('.console').should('have.length', 2)
    cy.get('.debug').should('have.length', 3)
    cy.get('#check-console').should('be.checked')
    cy.get('#check-debug').should('be.checked')
    cy.get('#check-util-debuglog').should('be.checked')
    cy.get('#check-console-log').should('be.checked')
    cy.get('#check-debug-info').should('be.checked')
    cy.get('#check-debug-verbose').should('be.checked')
    cy.get('#check-util-debuglog-HELLO').should('be.checked')

    // specific debug
    cy.get('.debug-verbose').should('be.visible')
    cy.get('#check-debug-verbose').uncheck()
    cy.get('.debug-verbose').should('not.be.visible')
    cy.get('#check-debug-verbose').check()
    cy.get('.debug-verbose').should('be.visible')

    // all debug
    cy.get('.debug').should('be.visible')
    cy.get('#check-debug').uncheck()
    cy.get('.debug').should('not.be.visible')
    cy.get('#check-debug').check()
    cy.get('.debug').should('be.visible')
  })
})
