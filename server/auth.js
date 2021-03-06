const exec = require('child_process').exec
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const Do = require('do-wrapper').default

exports.generateCerts = () => {
  return new Promise((resolve, reject) => {
    exec('openssl genrsa -out key.pem && openssl req -new -key key.pem -out csr.pem -subj "/C=US/ST=/L=/O=/OU=/CN=/" && openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem && rm csr.pem', (error, stdout, stderr) => {
      if (error) {
        console.error(error)
      }
      resolve(stderr)
    })
  })
}
// openssl genrsa -out key.pem
// openssl req -new -key key.pem -out csr.pem
// openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
// rm csr.pem

let jwtsecret

if (!fs.existsSync(path.join(__dirname, 'jwtsecret'))) {
  console.log('Generating jwt secret...')
  jwtsecret = uuidv4()
  fs.writeFileSync(path.join(__dirname, 'jwtsecret'), jwtsecret)
} else {
  jwtsecret = fs.readFileSync(path.join(__dirname, 'jwtsecret'), 'utf-8')
}

exports.jwtsecret = jwtsecret

let dokey
let api

if (!fs.existsSync(path.join(__dirname, 'dokey'))) {
  console.log('DigitalOcean key not found. Please Create a file called "dokey" and paste in the contents of a Read/Write API Key')
  process.exit()
} else {
  dokey = fs.readFileSync(path.join(__dirname, 'dokey'), 'utf-8').replace(/(\r\n|\n|\r)/gm, '')
  api = new Do(dokey)
}

exports.dokey = dokey
exports.doAPI = api
