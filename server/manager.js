const { ws } = require('./http')
const { doAPI } = require('./auth')

let agents = {} // List of agents // TODO: Make into a db style with something like level
let projectID = '6f934c4c-f400-4a4f-b326-00a50dd39a37' // TODO: Unhardcode
let instanceModel = {

}

const dropletSizes = [
  "s-1vcpu-1gb",
  "s-1vcpu-2gb",
  "s-1vcpu-3gb",
  "s-2vcpu-2gb",
  "s-3vcpu-1gb",
  "s-2vcpu-4gb",
  "s-4vcpu-8gb",
  "s-6vcpu-16gb",
  "s-8vcpu-32gb",
  "s-12vcpu-48gb",
  "s-16vcpu-64gb",
  "s-20vcpu-96gb",
  "s-24vcpu-128gb",
  "s-32vcpu-192gb"
]

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
  if (monitorCycles > 1 && !scalingLock) { // 3 Checkins
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

// doAPI.projects.getById(projectID)
//   .then((res) => {
//     console.log(res)
//   })
//   .catch((err) => {
//     console.error(err)
//   })

// doAPI.images.getByIdOrSlug('ubuntu-18-04-x64')
//   .then((res) => {
//     console.log(res)
//   })
//   .catch((err) => {
//     console.error(err)
//   })

doAPI.keys.getAll()
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.error(err)
  })

const createDroplet = (image, name, region, dropletSize, sshKeys) => {
  doAPI.droplets.create({
    "name": name,
    "region": region,
    "size": dropletSize,
    "image": image, // "ubuntu-18-04-x64"
    "ssh_keys": sshKeys,
    "backups": false,
    "ipv6": false,
    "user_data": null,
    "private_networking": null,
    "volumes": null,
    "tags": []
  })
    .then((data) => {
      // console.log(data)
      console.log('Created droplet...')
      doAPI.projects.addResources(projectID, [`do:droplet:${data.droplet.id}`])
        .then((res) => {
          // console.log(res)
          console.log('Assigned droplet to project!')
          scalingLock = false
        })
        .catch((err) => {
          console.error(err)
        })
    })
    .catch((err) => {
      console.error(err)
    })
}

const scaleUp = () => {
  console.log('Scaling up!')
  // Fetch information about what instance to create
  // Create instance, get instance name
  // Check for instance checkin
  // Remove scaling locks
  createDroplet('ubuntu-18-04-x64', 'testdroplet', 'nyc3', dropletSizes[0], 20081905)
}
