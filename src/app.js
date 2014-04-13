  var logger    = require('./logger')
  , RepoManager = require('./repo_manager')
  , CommitManager = require('./commit_manager')
  , Repository    = require('./repository')

var repoManager = new RepoManager("tmp/fooInit", {url :null})

//var commitManager = new CommitManager("/tmp/fooInit", {url :"hohohoho/hohoho.com"})

repoManager.startWatch()

