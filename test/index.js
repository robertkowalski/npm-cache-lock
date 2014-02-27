var test = require("tap").test
  , cacheLock = require("../")
  , mkdirp = require("mkdirp")
  , rimraf = require("rimraf")
  , path = require("path")
  , fs = require("fs")


var opts = { stale: 1000
           , retries: 3
           , wait: 1000 }
  , fixtures = path.join(__dirname, "fixtures")
  , npm = { cache: path.join(fixtures, "mycache") }
  , log = { silly: function () {}
          , verbose: function () {} }

function setup () {
  rimraf.sync(fixtures)
  mkdirp.sync(fixtures)
}

test("setup", function (t) {
  setup()
  t.end()
})

test("getting a lockfilename: uses the name of the file", function (t) {
  t.has(cacheLock.lockFileName(npm.cache, log, "underscore@1.6.0")
    , /-underscore-1-6-0.lock$/)
  t.has(cacheLock.lockFileName(npm.cache, log
    , "tar:///var/folders/mm/8hsp08pd3133564vw7n1yvf80000gn/T/" +
      "npm-73731-CFYUYY1m/1393540354615-0.12562836962752044/tmp.tgz")
  , /12562836962752044-tmp-tgz.lock$/)
  t.end()
})

test("getting a lockfilename: uses the cachepath", function (t) {
  t.has(cacheLock.lockFileName(npm.cache, log, "underscore@1.6.0")
    , new RegExp("^" + npm.cache, 'g'))
  t.end()
})

test("locking: creates a cachedir and a lockfile", function (t) {
  cacheLock.lock(npm.cache, log, "underscore@1.6.0"
    , opts, function (er) {
    t.notOk(er)
    t.ok(fs.existsSync(Object.keys(cacheLock.myLocks)[0]))
    cacheLock.unlock(npm.cache, log, "underscore@1.6.0"
    , function (er) {
      t.notOk(er)
      t.end()
    })
  })
})

test("unlocking: removes the lockfile", function (t) {
  var lockFileName = cacheLock.lockFileName(npm.cache
    , log, "test@1.7.0")

  cacheLock.lock(npm.cache, log, "test@1.7.0"
    , opts, function (er) {
    t.notOk(er)
    t.ok(fs.existsSync(lockFileName))
    cacheLock.unlock(npm.cache, log, "test@1.7.0"
    , function (er) {
      t.notOk(er)
      t.notOk(fs.existsSync(lockFileName), "lockfile does not exist")
      t.end()
    })
  })
})

test("cleanup", function (t) {
  rimraf.sync(fixtures)
  t.end()
})
