# @bahmutov/cy-api
[![renovate-app badge][renovate-badge]][renovate-app] [![CircleCI](https://circleci.com/gh/bahmutov/cy-api/tree/master.svg?style=svg&circle-token=b9f64878ead36e2da438a0563cc4566269aa452b)](https://circleci.com/gh/bahmutov/cy-api/tree/master) ![cypress version](https://img.shields.io/badge/cypress-6.6.0-brightgreen)
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
import '@bahmutov/cy-api/support'
```

This will add a new command `cy.api` for making API requests.

## Configuration

If you want to disable messages calls use an environment variable `CYPRESS_API_MESSAGE=false`.

## TypeScript

The definition for `cy.api` command is in [index.d.ts](index.d.ts) file. If you are using JavaScript, include the following line in our spec files

```js
// cypress/integration/my-spec.js
/// <reference types="@bahmutov/cy-api" />
```

With this line, you should have Intelligent Code Completion working in most IDEs and the TypeScript compiler should understand the `cy.api` command.

## Examples

- [bahmutov/server-logs-example](https://github.com/bahmutov/server-logs-example)

## More info

- Read [Black box API testing with server logs](https://glebbahmutov.com/blog/api-testing-with-sever-logs/)
- Read ["Capture all the logs"](https://glebbahmutov.com/blog/capture-all-the-logs/) and [@bahmutov/all-logs][all-logs] module.

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
