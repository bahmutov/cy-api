// test server

const verbose = require('debug')('verbose')
const info = require('debug')('info')
const debug = require('util').debuglog('hello')
const express = require('express')
const app = express()
const port = 3003

app.use(express.json())

if (global.messages) {
  require('@bahmutov/all-logs/middleware/express')(app)
}

app.use(express.static('server-public'))

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

app.post('/json', (req, res) => {
  // grab the body of the request
  const body = req.body
  console.log('POST /json')
  console.log(body)
  res.send(body)
})

app.put('/json', (req, res) => {
  // grab the body of the request
  const body = req.body
  console.log('PUT /json')
  console.log(body)
  res.send(body)
})

app.post('/json-problem', (req, res) => {
  console.log('application/problem+json')
  res.set('Content-Type', 'application/problem+json')
  res.send({
    foo: 'bar',
  })
})

// https://github.com/bahmutov/cy-api/issues/156
app.get('/json-white-space', (req, res) => {
  const answerJSON = { forwardTo: ' ' }
  res.send(answerJSON)
})

app.get('/xml', (req, res) => {
  const answerXML = '<xml>XML</xml>'
  res.set('Content-Type', 'text/xml')
  res.send(answerXML)
})

app.get('/random-number', (req, res) => {
  const n = Math.ceil(Math.random() * 10)
  console.log('returning a random number %d', n)
  res.send({ n })
})

app.get('/sum', (req, res) => {
  console.log('summing', req.body)
  const sum = req.body.a + req.body.b
  console.log('returning sum %d', sum)
  res.send({ sum })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
