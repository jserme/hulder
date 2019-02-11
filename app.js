const express = require('express')
const http = require('http')

const app = express()
const port = 8325

const check = require('./middlewares/check')
const generate = require('./')

app.set('view engine', 'pug')
app.set('views', __dirname + '/views')

app.get('/', (req, res) => {
  res.render('index', {
    title: 'hulder...'
  })
})

app.get('/:wh/:color?/:text?', check, (req, res) => {
  res.type('png')

  generate(req.canvasParams).then((buf) => {
    res.send(buf)
  })
})

app.get('*', (req, res) => {
  res.status(500)
  return res.render('err500', {
    title: '错误啦',
    msg: '服务器出了点问题'
  })
})

const httpServer = http.createServer(app)

httpServer.listen(port, () => {
  return console.log('Express server listening on port %d in %s mode', port, app.get('env'))
})
