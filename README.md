[![Build Status](https://travis-ci.org/robertkowalski/npm-cache-lock.png?branch=master)](https://travis-ci.org/robertkowalski/npm-cache-lock)

# npm-cache-lock

Creaing lockfiles for npm - and if there is no cache dir present, create one.

## API

### .lockFileName(cacheDir, log, u)
Returns the absolute path for a lockfile

### .lock(cacheDir, log, u, opts, cb)
Creates a cache-directory if it does not exist.
Creates a lockfile and saves the path and status in an Object.

### .unlock(cacheDir, log, u, cb)
Async removal of the lockfile from the cache-directory. Throws
if file wasn't locked before.
