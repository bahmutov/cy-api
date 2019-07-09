// test server

const express = require('express')
const app = express()
const port = 3003

if (global.messages) {
  require('@bahmutov/all-logs/middleware/express')(app)
}

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
