var _ = require('underscore')
  , Repo = require("nodegit").Repo
  , logger = require('./logger')
  , fs = require('fs')

var RepoManager = function (path, options) {
  this.path = path
  
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
    Repo.open(path,function(err,repo){
        if(err){
          throw err
        }else{
          this.repo = repo
        }
    })  
  }
})


module.exports = RepoManager
