const https = require('https')
const websocket = require('ws')
const fs = require('fs')
const express = require('express')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const querystring = require('querystring')
const { generateCerts, jwtsecret } = require('./auth')

const app = express()
app.use(cors())

if (!fs.existsSync('key.pem') && !fs.existsSync('cert.pem')) {
  console.log('Generating certs...')
  generateCerts()
  console.log('Please restart server to start with new certs')
  process.exit(0)
} else {
  exports.server = https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  }, app)
  exports.ws = new websocket.Server({
    server: exports.server
  })
  exports.server.on('upgrade', (req, socket, head) => {
    // const { token } = querystring.parse(req.url.replace('/?', ''))
    // jwt.verify(token, jwtsecret, (err, decoded) => {
    //   if (err) {
    //     socket.destroy()
    //   }
    // })
  })
}
