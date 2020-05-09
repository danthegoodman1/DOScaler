const { ws } = require('./http')
const { doAPI } = require('./auth')

let agents = {} // List of agents // TODO: Make into a db style with something like level
let projectID = '03ad5a9b-6213-46a3-976a-fb5605d5ee1a' // TODO: Unhardcode

if (process.env.DEBUG) {
  setInterval(() => {
    console.log('AGENT STATUS:')
    console.log(agents)
  }, 2000)
}


let scalingLock = false // lock for scaling so we don't keep making new instances
let monitorCycles = 0 // Total monitor cycles where average is above target cpu usage
setInterval(() => { // Scaler monitor
  // Get average cpu usage
  let avgCPU = 0
  const totalAgents = Object.keys(agents).length
  for (const agent in agents) {
    avgCPU += agents[agent].cpuUsage
  }
  avgCPU = avgCPU / totalAgents
  console.log('Avg cpu:', avgCPU)
  if (avgCPU > 0.7) {
    console.log('Avg CPU Usage has exceeded 70%')
    monitorCycles++
  } else {
    monitorCycles = 0
  }
  if (monitorCycles > 3) { // 3 Checkins
    console.log('Scaling...')
    scalingLock = true
    scaleUp()
  }
}, 2000)

ws.on('connection', (socket, req) => {
  socket.on('message', async (message) => {
    // console.log(`Incoming message: ${msg}`)
    const msg = JSON.parse(message)
    if (process.env.DEBUG) {
      console.log('Incoming message:')
      console.log(msg)
    }
    switch (msg.event) {
      case 'statUpdate':
        if (!agents[msg.agentID]) {
          console.log('Registering agent', msg.agentID)
        }
        agents[msg.agentID] = msg.data
        // if (msg.data.cpuUsage > 0.70) {
        //   console.log('CPU Usage exceeded 70%')
        // }
        break

      default:
        console.log('Unhandled event:')
        console.log(msg)
        break
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

const scaleUp = () => {
  console.log('Scaling up!')
  // Fetch information about what instance to create
  // Create instance, get instance name
  // Check for instance checkin
  // Remove scaling locks
}
