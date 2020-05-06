const { ws } = require('./http')
const { doAPI } = require('./auth')

let agents = {} // List of agents
let projectID = '03ad5a9b-6213-46a3-976a-fb5605d5ee1a' // TODO: Unhardcode

ws.on('connection', (socket, req) => {
  socket.on('message', async (msg) => {
    // console.log(`Incoming message: ${msg}`)
    if (process.env.DEBUG) {
      console.log('Incoming message:')
      console.log(msg)
    }
    switch (msg.event) {
      case 'stateUpdate':
        if (!agents[msg.agentID]) {
          console.log('Registering agent', msg.agentID)
        }
        agents[msg.agentID] = msg.data
        if (msg.data.cpuUsage > 70) {
          console.log('CPU Usage exceeded 70%')
        }
        break;
    
      default:
        console.log('Unhandled event:')
        console.log(msg.event)
        break;
    }
    // socket.send('')
  })
})

doAPI.projects.getById(projectID)
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.error(err)
  })
