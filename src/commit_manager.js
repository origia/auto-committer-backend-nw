var _ = require('underscore')
  , Repo = require("nodegit").Repo
  , logger = require('./logger')
  , fs = require('fs')
  , fileName = "first.txt"

var CommitManager = function (path, options) {
  this.path = path
  this.filepath= this.path+"/.git";
  if (this.path) {
    this.open(path);
    //this.repoIndex(path);
  }
}

_.extend(CommitManager.prototype, {
  open:function(path){
    //レポジトリを開く
    var self = this
    Repo.open(this.filepath,function(err,repo){
        if(err){
          throw err
        }else{
          self.repo = repo
          self.repoIndex(path);
        } 
    })  
  },
  repoIndex:function(path){
   self = this
   this.repo.openIndex(function(openIndexError, index) {
    	if(openIndexError){
          throw openIndexError
        }else{
          self.index=index
		  logger.info('%s repo openIndex.',path );
		  self.indexRead(index)
        }	
    })
  },
  indexRead:function(index){
  	self = this
  	this.index.read(function(err){
  		if(err){
  		  throw err
  		}else{
  		  self.index=index
  		  logger.info('%s index readIndex.',index);
  		}
  	})
  },
  indexAddByPath:function(index){
  	self = this
  	// this.index.addByPath(fileName,function)
  }
 
})

module.exports = CommitManager