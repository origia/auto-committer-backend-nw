var _ = require('underscore')
  , Repo = require("nodegit").Repo
  , logger = require('./logger')
  , fs = require('fs')
  , Repository    = require('./repository')
  , chokidar = require('chokidar')

var RepoManager = function (path, options) {
  this.path = path
  this.gitRepo = new Repository(this.path)
  
  if (options.url) {
    //URLがあったら、cloneする
    this.clone(options.url);
  }else{
      //pathの下に.gitあればinit
    var filepath = this.path+"/.git";
    if (fs.existsSync(filepath)) {
      logger.info('%s exist.', filepath);
      this.repoOpen(this.path);
    }else{
      logger.info('%s not exist.', filepath);
      this.repoInit(filepath);
    }
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
  },
  repoInit:function(path){
    //自分で作りたい（cloneしたくない）
    Repo.init(path,true,function(err,repo){
        if (err) {
          throw err
        } else {
          this.repo = repo
        }
    })   
  },
  repoOpen:function(path){
    //レポジトリを開く
    var self=this
    Repo.open(path,function(err,repo){
        if(err){
          throw err
        }else{
          this.repo = repo
           //start watch でレポジトリのdifeを見に行く
        }
    })  
  },

  startWatch: function () {
    if (this.isWatching) {
      return
    }
    var self = this
    this.isWatching = true
    console.log(this.path)
    // One-liner
    chokidar.watch(this.path).on('all', function(event, path) {
        self.gitRepo.diffStats(function (stats) {
          console.log(stats)
          if(stats.insertionsNumber+stats.deletionsNumber>=10){
             self.gitRepo.changedFiles(function (files) {
              console.log("10 over")
              console.log(files)
              self.gitRepo.commit();
              })
          }
        })
    });

  }
})


module.exports = RepoManager
