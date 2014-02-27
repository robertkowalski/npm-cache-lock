var crypto = require("crypto")
  , getCacheStat = require("npm-cache-dir").getCacheStat
  , path = require("path")
  , lockFile = require("lockfile")


var myLocks = exports.myLocks = {}

exports.lockFileName = lockFileName
function lockFileName (cache, log, u) {
  var c = u.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    , h = crypto.createHash("sha1").update(u).digest("hex")
  h = h.substr(0, 8)
  c = c.substr(-32)
  log.silly("lockFile", h + "-" + c, u)
  return path.resolve(cache, h + "-" + c + ".lock")
}

exports.lock = lock
function lock (cache, log, u, opts, cb) {
  // the cache dir needs to exist already for this.
  getCacheStat(cache, log, function (er, cs) {
    if (er) return cb(er)
    var lf = lockFileName(cache, log, u)
    log.verbose("lock", u, lf)
    lockFile.lock(lf, opts, function (er) {
      if (!er) myLocks[lf] = true
      cb(er)
    })
  })
}

exports.unlock = unlock
function unlock (cache, log, u, cb) {
  var lf = lockFileName(cache, log, u)
    , locked = myLocks[lf]

  if (locked === false) {
    return process.nextTick(cb)
  } else if (locked === true) {
    myLocks[lf] = false
    lockFile.unlock(lockFileName(cache, log, u), cb)
  } else {
    throw new Error("Attempt to unlock " + u + ", which hasn't been locked")
  }
}
