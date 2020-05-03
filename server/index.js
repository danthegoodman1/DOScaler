const { server } = require('./http')
require('./manager')
const main = async () => {
  console.log('Starting Server...')
  server.listen(process.env.PORT || 4433, () => {
    console.log(`Server listening on ${process.env.PORT || 4433}`)
  })
}

main()
