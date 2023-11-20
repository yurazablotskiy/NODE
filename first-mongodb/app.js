const express = require('express')
const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/node_js'

const app = express()

mongoose.connect(url, { useNewUrlParser: true })

let conn = mongoose.connection
conn.on('open', () => {
  console.log('Мы подключись')
})

app.listen(3000, () => {
  console.log('Сервер запущен')
})
