/// <reference types="cypress" />

import { html } from 'common-tags'
import hljs from 'highlight.js'
const pack = require('../package.json')

//
// implementation of the custom command "cy.api"
// https://github.com/bahmutov/cy-api
//

// shortcuts to a few Lodash methods
const { get, filter, map, uniq } = Cypress._

let firstApiRequest: boolean

let globalDisplayRequest = true

Cypress.on('test:before:run', () => {
  // @ts-ignore
  const apiDisplayRequest = Cypress.config('apiDisplayRequest')
  globalDisplayRequest =
    apiDisplayRequest === undefined ? true : (apiDisplayRequest as boolean)
  firstApiRequest = true
  // @ts-ignore
  const doc: Document = cy.state('document')
  doc.body.innerHTML = ''
})

function initApiOptions(): ApiOptions {
  if (globalDisplayRequest === false) {
    return { displayRequest: false }
  } else {
    return { displayRequest: true }
  }
}

Cypress.Commands.add(
  'api',
  (options: Partial<Cypress.RequestOptions>, name = 'api') => {
    const apiOptions = initApiOptions()
    const hasApiMessages = Cypress.env('API_MESSAGES') === false ? false : true
    let normalizedTypes: string[] = []
    let normalizedNamespaces: string[] = []
    var { container, win, doc } = getContainer()
    const messagesEndpoint = get(
      Cypress.env(),
      'cyApi.messages',
      '/__messages__',
    )

    // first reset any messages on the server
    if (hasApiMessages) {
      cy.request({
        method: 'POST',
        url: messagesEndpoint,
        log: false,
        failOnStatusCode: false, // maybe there is no endpoint with logs
      })
    }

    // should we log the message before a request
    // in case it fails?
    Cypress.log({
      name,
      message: options.url,
      consoleProps() {
        return {
          request: options,
        }
      },
    })

    let topMargin = '0'
    if (firstApiRequest) {
      container.innerHTML = ''
    }
    if (apiOptions.displayRequest) {
      if (firstApiRequest) {
        // remove existing content from the application frame
        firstApiRequest = false
        container.innerHTML = html`
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/${pack[
              'dependencies'
            ]['highlight.js']}/styles/vs.min.css"
          />
          <style>
            .container {
              background-color: rgb(238, 238, 238);
              border-radius: 6px;
              padding: 30px 15px;
              text-align: center;
            }
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
            .hljs {
              background: rgb(238, 238, 238);
            }
          </style>
        `
      } else {
        container.innerHTML += '<br><hr>\n'
        topMargin = '1em'
      }
    }

    if (apiOptions.displayRequest) {
      container.innerHTML +=
        // should we use custom class and insert class style?
        '<div class="cy-api">\n' +
        `<h1 class="cy-api-request" style="margin: ${topMargin} 0 1em">Cy-api: ${name}</h1>\n` +
        '<div>\n' +
        '<b>Request:</b>\n' +
        '<pre class="hljs">' +
        formatRequest(options) +
        '\n</pre></div>'
    }

    cy.request({
      ...options,
      log: false,
    })
      .then(
        ({ duration, body, status, headers, requestHeaders, statusText }) => {
          return printResponse(
            container,
            hasApiMessages,
            messagesEndpoint,
            normalizedTypes,
            normalizedNamespaces,
            apiOptions.displayRequest,
          ).then(({ messages }) => {
            return cy.wrap(
              {
                messages,
                duration,
                body,
                status,
                headers,
                requestHeaders,
                statusText,
              },
              { log: false },
            )
          })
        },
      )
      .then(
        ({
          messages,
          duration,
          body,
          status,
          headers,
          requestHeaders,
          statusText,
        }) => {
          // render the response object
          // TODO render headers?
          if (apiOptions.displayRequest) {
            container.innerHTML +=
              '<div class="cy-api-response">\n' +
              `<b>Response: ${status} ${duration}ms</b>\n` +
              '<pre class="hljs">' +
              formatResponse(body, headers) +
              '\n</pre></div></div>'
          }

          // log the response
          Cypress.log({
            name: 'response',
            message: options.url,
            consoleProps() {
              return {
                type: typeof body,
                response: body,
              }
            },
          })

          for (const type of normalizedTypes) {
            addOnClickFilter(type)
          }

          for (const namespace of normalizedNamespaces) {
            addOnClickFilter(namespace)
          }

          win.scrollTo(0, doc.body.scrollHeight)

          return {
            messages,
            // original response information
            duration,
            body,
            status,
            statusText,
            headers,
            requestHeaders,
          }
        },
      )
  },
)

const printResponse = (
  container: HTMLElement,
  hasApiMessages: boolean,
  messagesEndpoint: string,
  normalizedTypes: string[],
  normalizedNamespaces: string[],
  displayRequest = true,
) => {
  let messages: Message[] = []
  if (hasApiMessages) {
    return cy
      .request({
        url: messagesEndpoint,
        log: false,
        failOnStatusCode: false, // maybe there is no endpoint with logs
      })
      .then((res) => {
        messages = get(res, 'body.messages', [])
        if (messages.length) {
          const types = uniq(map(messages, 'type')).sort()
          // types will be like
          // ['console', 'debug', 'util.debuglog']
          const namespaces = types.map((type) => {
            return {
              type,
              namespaces: uniq(
                map(filter(messages, { type }), 'namespace'),
              ).sort(),
            }
          })
          // namespaces will be like
          // [
          //  {type: 'console', namespaces: ['log']},
          //  {type: 'util.debuglog', namespaces: ['HTTP']}
          // ]
          if (displayRequest) {
            container.innerHTML +=
              '<hr>\n' +
              '<div style="text-align: left">\n' +
              `<b>Server logs</b>`

            if (types.length) {
              for (const type of types) {
                const normalizedType = normalize(type)
                normalizedTypes.push(normalizedType)
                container.innerHTML += `\n<input type="checkbox" id="check-${normalizedType}" checked name="${type}" value="${normalizedType}"> ${type}`
              }
              container.innerHTML += '<br/>\n'
            }
            if (namespaces.length) {
              container.innerHTML +=
                '\n' +
                namespaces
                  .map((n) => {
                    if (!n.namespaces.length) {
                      return ''
                    }
                    return n.namespaces
                      .map((namespace) => {
                        const normalizedNamespace = normalize(n.type, namespace)
                        normalizedNamespaces.push(normalizedNamespace)
                        return `\n<input type="checkbox" name="${n.type}.${namespace}"
                        id="check-${normalizedNamespace}" checked
                        value="${normalizedNamespace}"> ${n.type}.${namespace}`
                      })
                      .join('')
                  })
                  .join('') +
                '<br/>\n'
            }

            container.innerHTML +=
              '\n<pre class="cy-api-logs-messages">' +
              messages
                .map(
                  (m) =>
                    `<div class="${normalize(m.type)} ${normalize(
                      m.type,
                      m.namespace,
                    )}">${m.type} ${m.namespace}: ${m.message}</div>`,
                )
                .join('') +
              '\n</pre></div>'
          }
        }
      })
      .then(() => cy.wrap({ messages }, { log: false }))
  } else {
    return cy.wrap({ messages }, { log: false })
  }
}

const normalize = (type: string, namespace: string | null = null): string => {
  let normalized = type.replace('.', '-')
  if (namespace) {
    namespace = namespace.replace('.', '-')
    normalized += `-${namespace}`
  }
  return normalized
}

const addOnClickFilter = (filterId: string): void => {
  // @ts-ignore
  const doc = cy.state('document')
  doc.getElementById(`check-${filterId}`).onclick = () => {
    const checkbox = doc.getElementById(`check-${filterId}`)
    const elements = doc.getElementsByClassName(checkbox.value)
    for (let log of elements) {
      log.style.display = checkbox.checked ? 'block' : 'none'
    }
  }
}

const getContainer = () => {
  // @ts-ignore
  const doc: Document = cy.state('document')
  // @ts-ignore
  const win: Window = cy.state('window')
  let container = doc.querySelector<HTMLElement>('.container')
  if (!container) {
    // clear the body of the application's iframe
    // in Cypress v12
    const innerContainer = doc.querySelector<HTMLElement>('.inner-container')
    if (innerContainer) {
      innerContainer.remove()
    }
    // and Cypress v12 styles
    const styles = doc.querySelector<HTMLElement>('style')
    if (styles) {
      styles.remove()
    }

    // and create our own container
    container = doc.createElement('div')
    container.className = 'container'
    doc.body.appendChild(container)
  }
  container.className = 'container'
  return { container, win, doc }
}

const formatJSon = (jsonObject: object) => {
  return hljs.highlight(JSON.stringify(jsonObject, null, 4), {
    language: 'json',
  }).value
}

const formatRequest = (options: Partial<Cypress.RequestOptions>) => {
  const showCredentials = Cypress.env('API_SHOW_CREDENTIALS')
  const showFailOnStatusCode = Cypress.env('API_SHOW_FAILONSTATUSCODE') === false ? false : true
  const auth = options?.auth as {
    username?: string
    password?: string
    bearer?: string
  }
  const hasPassword = auth?.password
  const hasBearer = auth?.bearer
  const { failOnStatusCode, ...restOptions } = options;
  const updatedOptions = { ...restOptions, ...(showFailOnStatusCode ? { failOnStatusCode } : {}) };

  if (!showCredentials && hasPassword && hasBearer) {
    return formatJSon({
      ...updatedOptions,
      auth: {
        ...updatedOptions.auth,
        bearer: '*****',
        password: '*****',
      },
    })
  } else if (!showCredentials && hasPassword) {
    return formatJSon({
      ...updatedOptions,
      auth: {
        ...updatedOptions.auth,
        password: '*****',
      },
    })
  } else if (!showCredentials && hasBearer) {
    return formatJSon({
      ...updatedOptions,
      auth: {
        ...updatedOptions.auth,
        bearer: '*****',
      },
    })
  }
  return formatJSon(updatedOptions)
}

const formatResponse = (
  body: object,
  headers: { [key: string]: string | string[] },
) => {
  if (headers?.['content-type']?.includes('application/json')) {
    return formatJSon(body)
  } else {
    return body
  }
}
