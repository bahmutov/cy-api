interface CyApiOptions {
    api: ApiOptions
}

interface ApiOptions {
    displayRequest: boolean
}

interface Message {
    type: string
    namespace: string
    message: string
}

interface Messages {
    messages: Message[]
}

declare namespace Cypress {

    interface TestConfigOverrides {
      /**
       * Display cy.api result
       */
       apiDisplayRequest?: boolean
    }

    interface Chainable {
      /**
       * Custom command to execute HTTP request to the server
       * and display the results in the application under test iframe.
       *
       * @example
      ```
      cy.api({ url: '/' }, 'my hello world')
        .then(response => {
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
      ```
       */
      api<T> (options: Partial<Cypress.RequestOptions>, name?: string): Chainable<Response<T> & Messages>
    }
  }