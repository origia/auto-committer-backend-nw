var logger = require('./logger')
var RepoManager = require('./repo_manager')
logger.debug('foobar')
logger.info('barbaz')

var manager = new RepoManager("foo", {url:"tmp/foo"})

