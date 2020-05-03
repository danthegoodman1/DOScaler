const { ws } = require('./http')

ws.on('connection', (socket, req) => {
  socket.on('message', async (msg) => {
    console.log(`Incoming message: ${msg}`)
    socket.send('Thanks!')
  })
})
