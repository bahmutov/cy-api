# @bahmutov/cy-api
[![renovate-app badge][renovate-badge]][renovate-app] [![CircleCI](https://circleci.com/gh/bahmutov/cy-api/tree/master.svg?style=svg&circle-token=b9f64878ead36e2da438a0563cc4566269aa452b)](https://circleci.com/gh/bahmutov/cy-api/tree/master) ![cypress version](https://img.shields.io/badge/cypress-12.17.3-brightgreen)
> Cypress custom command "cy.api" for end-to-end API testing

This command makes HTTP requests to external servers, then renders the input and output where the web application usually is in the Cypress Test Runner. If there are server-side logs using [@bahmutov/all-logs][all-logs], this command fetches them and renders too. Here is typical output:

![`cy.api` in action](images/cy-api.jpg)

## Install

```
npm install --save-dev @bahmutov/cy-api
```

or

```
yarn add -D @bahmutov/cy-api
```

Add the following line to your Cypress support file

```js
// usually cypress/support/index.js
import '@bahmutov/cy-api'
```

This will add a new command `cy.api` for making API requests.

## Configuration

| var env | default value | description |
|---------|---------------|-------------|
| CYPRESS_API_MESSAGES | true | Show and make call to api server logs |
| CYPRESS_API_SHOW_CREDENTIALS | false | Show authentication password |

By default `cy.api` print response in the browser. To have the same behaviour as `cy.request` and use `cy.visit` normally, you need to desactivate `apiDisplayRequest` :

```js
it('my test without displaying request', { apiDisplayRequest: false }, () => {
    cy.api(
      {
        url: '/',
      }
    )
})
```

## TypeScript

If your using TypeScript with Cypress, you can add type in your `tsconfig.json`

```json
{
    "compilerOptions": {
        "types": [
            "cypress",
            "@bahmutov/cy-api"
        ]
    }
}
```

## Examples

- [bahmutov/server-logs-example](https://github.com/bahmutov/server-logs-example)

## More info

- Read [Black box API testing with server logs](https://glebbahmutov.com/blog/api-testing-with-server-logs/)
- Read [Capture all the logs](https://glebbahmutov.com/blog/capture-all-the-logs/) and [@bahmutov/all-logs][all-logs] module.
- Read [You Should Test More Using APIs](https://glebbahmutov.com/blog/test-using-apis/)

[all-logs]: https://github.com/bahmutov/all-logs

### Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2019

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](https://glebbahmutov.com)
* [blog](https://glebbahmutov.com/blog)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/cy-api/issues) on Github

## MIT License

Copyright (c) 2019 Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/
