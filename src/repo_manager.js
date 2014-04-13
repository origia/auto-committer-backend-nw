var _ = require('underscore')
var Repo = require("nodegit").Repo
var logger = require('./logger')

var RepoManager=function(path,options){
	if(options.url){
		this.clone(options.url);
	}
}

_.extend(RepoManager.prototype,{
	clone:function(url){
		Repo.clone("https://github.com/nodegit/nodegit","/tmp/foo",null,function(err, repo) {
	  		if (err) {
	    		throw err;
	  		}else{
	  			this.repo=repo;
	  			logger.info(url);
	  		}
		})
	},
	bar:function(){

	}
})
module.exports = RepoManager
