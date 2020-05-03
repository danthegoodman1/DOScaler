const { ws } = require('./http')

ws.on('connection', (socket, req) => {
  socket.on('message', async (msg) => {
    const message = JSON.parse(msg)
    console.log(`Incoming message: ${message}`)
    socket.send('Thanks!')
  })
})
