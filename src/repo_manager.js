var _ = require('underscore')
  , Repo = require("nodegit").Repo
  , logger = require('./logger')

var RepoManager = function (path, options) {
  this.path = path
  if (options.url) {
    this.clone(options.url)
  }
}

_.extend(RepoManager.prototype, {
  clone:function(url) {
    Repo.clone(this.path, url, null, function(err, repo) {
        if (err) {
          throw err
        } else {
          this.repo = repo
          logger.info(url)
        }
    })
  }
})


module.exports = RepoManager
