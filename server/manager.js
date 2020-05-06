const { ws } = require('./http')
const { doAPI } = require('./auth')

ws.on('connection', (socket, req) => {
  socket.on('message', async (msg) => {
    console.log(`Incoming message: ${msg}`)
    socket.send('Thanks!')
  })
})

let projectID = '03ad5a9b-6213-46a3-976a-fb5605d5ee1a' // TODO: Unhardcode

let agents = {} // List of agents

// Test API Access
// doAPI.projects.getDefault()
//   .then((res) => {
//     if (process.env.DEBUG) {
//       console.log(res)
//     }
//     // if (res.id) {
//     //   projectID = res.id
//     // }
//     console.log(`Found default project: '${res.name}'`)
//   })
//   .catch((err) => {
//     console.error(err)
//   })

doAPI.projects.getById('03ad5a9b-6213-46a3-976a-fb5605d5ee1a')
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.error(err)
  })
