const Websocket = require('ws')
const UsageMonitor = require('./usage')
const os = require('os')

const ws = new Websocket('wss://localhost:4433/', {
  rejectUnauthorized: false
})

const um = new UsageMonitor()

ws.on('open', () => {
  um.on('statUpdate', (stats) => {
    console.log(stats)
    ws.send(JSON.stringify({
      event: 'statUpdate',
      data: stats,
      sendTime: new Date().getTime(),
      agentID: os.hostname()
    }))
  })
})

ws.on('message', (data) => {

})

ws.on('error', (error) => {
  console.error(error)
})
