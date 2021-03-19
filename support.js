/// <reference types="cypress" />

const { html } = require('common-tags')

//
// implementation of the custom command "cy.api"
// https://github.com/bahmutov/cy-api
//

// shortcuts to a few Lodash methods
const { get, filter, map, uniq } = Cypress._

let firstApiRequest

Cypress.on('test:before:run', () => {
  firstApiRequest = true
})

Cypress.Commands.add('api', (options, name = 'api') => {
  const hasApiMessages = Cypress.env('API_MESSAGES') === false ? false : true
  const doc = cy.state('document')
  const win = cy.state('window')
  let container = doc.querySelector('.container')
  if (!container) {
    container = doc.createElement('div')
    container.className = 'container'
    doc.body.appendChild(container)
  }
  const messagesEndpoint = Cypress._.get(
    Cypress.env(),
    'cyApi.messages',
    '/__messages__'
  )

  // first reset any messages on the server
  if (hasApiMessages) {
    cy.request({
      method: 'POST',
      url: messagesEndpoint,
      log: false,
      failOnStatusCode: false // maybe there is no endpoint with logs
    })
  }

  // should we log the message before a request
  // in case it fails?
  Cypress.log({
    name,
    message: options.url,
    consoleProps() {
      return {
        request: options
      }
    }
  })

  let topMargin
  if (firstApiRequest) {
    // remove existing content from the application frame
    firstApiRequest = false
    topMargin = '0'
    container.innerHTML = html`
      <style>
        .cy-api {
          text-align: left;
        }
        .cy-api-request {
          font-weight: 600;
        }
        .cy-api-logs-messages {
          text-align: left;
          max-height: 25em;
          overflow-y: scroll;
          background-color: lightyellow;
          padding: 4px;
          border-radius: 4px;
        }
        .cy-api-response {
          text-align: left;
          margin-top: 1em;
        }
        .cy-api-pre {
          word-break: break-all;
          white-space: normal;
        }
      </style>
    `
  } else {
    container.innerHTML += '<br><hr>\n'
    topMargin = '1em'
  }

  container.innerHTML +=
    // should we use custom class and insert class style?
    '<div class="cy-api">\n' +
    `<h1 class="cy-api-request" style="margin: ${topMargin} 0 1em">Cy-api: ${name}</h1>\n` +
    '<div>\n' +
    '<b>Request:</b>\n' +
    '<pre class="cy-api-pre">' +
    JSON.stringify(options, null, 2) +
    '\n</pre></div>'

  cy.request({
    ...options,
    log: false
  }).then(({ duration, body, status, headers, requestHeaders, statusText }) => {
    let messages = [];
    if (hasApiMessages) {
      cy.request({
        url: messagesEndpoint,
        log: false,
        failOnStatusCode: false // maybe there is no endpoint with logs
      }).then(res => {
        messages = get(res, 'body.messages', [])
        if (messages.length) {
          const types = uniq(map(messages, 'type')).sort()
          // types will be like
          // ['console', 'debug', 'util.debuglog']
          const namespaces = types.map(type => {
            return {
              type,
              namespaces: uniq(
                map(filter(messages, { type }), 'namespace')
              ).sort()
            }
          })
          // namespaces will be like
          // [
          //  {type: 'console', namespaces: ['log']},
          //  {type: 'util.debuglog', namespaces: ['HTTP']}
          // ]

          container.innerHTML +=
            '<hr>\n' + '<div style="text-align: left">\n' + `<b>Server logs</b>`

          if (types.length) {
            container.innerHTML +=
              types
                .map(
                  type =>
                    `\n<input type="checkbox" name="${type}" value="${type}"> ${type}`
                )
                .join('') + '<br/>\n'
          }
          if (namespaces.length) {
            container.innerHTML +=
              '\n' +
              namespaces
                .map(n => {
                  if (!n.namespaces.length) {
                    return ''
                  }
                  return n.namespaces
                    .map(namespace => {
                      return `\n<input type="checkbox" name="${n.type
                        }.${namespace}"
                  value="${n.type}.${namespace}"> ${n.type}.${namespace}`
                    })
                    .join('')
                })
                .join('') +
              '<br/>\n'
          }

          container.innerHTML +=
            '\n<pre class="cy-api-logs-messages">' +
            messages
              .map(m => `${m.type} ${m.namespace}: ${m.message}`)
              .join('<br/>') +
            '\n</pre></div>'
        }
      }).then(() => cy.wrap({ messages, duration, body, status, headers, requestHeaders, statusText }))
    } else {
      return cy.wrap({ messages, duration, body, status, headers, requestHeaders, statusText })
    }
  }).then(({ messages, duration, body, status, headers, requestHeaders, statusText }) => {
    // render the response object
    // TODO render headers?
    container.innerHTML +=
      '<div class="cy-api-response">\n' +
      `<b>Response: ${status} ${duration}ms</b>\n` +
      '<pre>' +
      JSON.stringify(body, null, 2) +
      '\n</pre></div></div>'

    // log the response
    Cypress.log({
      name: 'response',
      message: options.url,
      consoleProps() {
        return {
          type: typeof body,
          response: body
        }
      }
    })

    win.scrollTo(0, doc.body.scrollHeight)

    return {
      messages,
      // original response information
      duration,
      body,
      status,
      statusText,
      headers,
      requestHeaders
    }
  })
})
