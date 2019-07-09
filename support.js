/// <reference types="cypress" />

Cypress.Commands.add('api', (options, name) => {
  const doc = cy.state('document')
  const container = doc.querySelector('.container')

  // first reset any messages on the server
  // TODO: handle errors
  cy.request({
    method: 'POST',
    url: '/__messages',
    log: false
  })

  // should we log the message before a request
  // in case it fails?
  Cypress.log({
    name: name || 'api',
    message: options.url,
    consoleProps () {
      return {
        request: options
      }
    }
  })
  container.innerHTML =
    '<div style="text-align: left">\n' +
    '<b>Request:</b>\n' +
    '<pre>' +
    JSON.stringify(options, null, 2) +
    '\n</pre></div>'

  cy.request({
    ...options,
    log: false
  }).then(({ duration, body, status, headers }) => {
    // TODO: handle errors
    cy.request({
      url: '/__messages',
      log: false
    }).then(res => {
      const messages = Cypress._.get(res, 'body.messages', [])
      if (messages.length) {
        container.innerHTML +=
          '<hr>\n' +
          '<div style="text-align: left">\n' +
          `<b>Server logs</b>\n` +
          '<pre>' +
          messages.map(m => `${m.type}: ${m.message}`).join('<br/>') +
          '\n</pre></div>'
      }

      // render the response object
      // TODO render headers?
      container.innerHTML +=
        '<hr>\n' +
        '<div style="text-align: left">\n' +
        `<b>Response: ${status} ${duration}ms</b>\n` +
        '<pre>' +
        JSON.stringify(body, null, 2) +
        '\n</pre></div>'

      // log the response
      Cypress.log({
        name: 'response',
        message: options.url,
        consoleProps () {
          return {
            type: typeof body,
            response: body
          }
        }
      })
    })
  })
})
