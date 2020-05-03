const Websocket = require('ws')

const ws = new Websocket('wss://localhost:4433/', {
  rejectUnauthorized: false
})

ws.on('open', () => {
  setInterval(() => {
    console.log('Sending...')
    ws.send('something')
  }, 1000)
})

ws.on('message', (data) => {
  console.log(data)
})

ws.on('error', (error) => {
  console.error(error)
})
