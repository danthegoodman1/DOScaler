const EventEmitter = require('events').EventEmitter
const os = require('os')
const _os = require('os-utils')
class UsageMonitor extends EventEmitter {
  constructor () {
    super()
    this.stats = {}

    setInterval(() => {
      this.stats.usedMem = this.getUsedMem()
      this.getCPU((value) => {
        this.stats.cpuUsage = value
        this.emit('statUpdate', this.stats)
      })
    }, 3000)
  }

  getCPU (cb) {
    _os.cpuUsage(cb)
  }

  getUsedMem () {
    return _os.freememPercentage()
  }
}

module.exports = UsageMonitor
