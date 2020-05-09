const Websocket = require('ws')
const UsageMonitor = require('./usage')
const os = require('os')

const initSocket = () => {
  const ws = new Websocket('wss://localhost:4433/', {
    rejectUnauthorized: false
  })
  console.log('Initializing socket actions...')
  ws.on('open', () => {
    console.log('Socket connected!')
    um.on('statUpdate', (stats) => {
      console.log(stats)
      ws.send(JSON.stringify({
        event: 'statUpdate',
        data: {
          ...stats,
          cpuUsage: 0.71
        },
        sendTime: new Date().getTime(),
        agentID: os.hostname()
      }))
    })
  })

  ws.on('message', (data) => {

  })

  ws.on('error', (error) => {
    console.log('Socket error:')
    console.error(error)
  })

  ws.on('close', (code) => {
    console.log('Socket closed')
    setTimeout(() => {
      initSocket(ws)
    }, 2000)
  })
}

initSocket()
const um = new UsageMonitor()
