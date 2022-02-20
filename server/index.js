// test server

const verbose = require('debug')('verbose')
const info = require('debug')('info')
const debug = require('util').debuglog('hello')
const express = require('express')
const app = express()
const port = 3003

if (global.messages) {
  require('@bahmutov/all-logs/middleware/express')(app)
}

app.use(express.static('server-public'));

const answer = 'Hello World!'

app.get('/', (req, res) => {
  // 3 different types of logging
  console.log('processing %s %s', req.method, req.path)
  verbose('processing /')
  debug('server responding with %s', answer)
  res.send(answer)
})

app.get('/logs', (req, res) => {
  debug('server start request')
  // 3 different types of logging
  console.log('processing %s %s', req.method, req.path)
  console.info('INFO')
  info('info log')
  verbose('processing /')
  debug('server responding with %s', answer)
  verbose('processing / end')
  res.send(answer)
  console.log('finish %s %s', req.method, req.path)
})

app.get('/json', (req, res) => {
  const answerJSON = { string: 'string', int: 1234, object: { array: [1, 2] } }
  res.send(answerJSON)
})

app.get('/xml', (req, res) => {
  const answerXML = "<xml>XML</xml>"
  res.set('Content-Type', 'text/xml');
  res.send(answerXML)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
