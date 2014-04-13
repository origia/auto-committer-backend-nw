var _     = require('underscore')
  , spawn = require('child_process').spawn


var Repository = function (path, options) {
  this.path = path
  this.options = options
};

_.extend(Repository.prototype, {
  diffStats: function (callback) {
    var gitDiff = spawn('git', ['--no-pager', 'diff', '--shortstat'], {
      cwd: this.path
    })

    gitDiff.stdout.on('data', function (data) {
      var stats = data.toString().match(/^\s*(\d+).*?(\d+).*?(\d+)/)
      if (!stats) {
        stats = [null, 0, 0, 0]
      }
      callback({
        changedFilesNumber: parseInt(stats[1], 10)
      , insertionsNumber: parseInt(stats[2], 10)
      , deletionsNumber: parseInt(stats[3], 10)
      })
    })
  }

, changedFiles: function (callback) {
    var gitStatus = spawn('git', ['status', '--short'], {
      cwd: this.path
    })
    gitStatus.stdout.on('data', function (data) {
      var files = []
      _(data.toString().split('\n')).each(function (row) {
        if (row.length > 0) {
          var splittedRow = row.split(' ')
          files.push(splittedRow[splittedRow.length - 1])
        }
      })
      callback(files)
    })
  }

, add: function (path, callback) {
    var gitAdd = spawn('git', ['add', path], {
      cwd: this.path
    })
    gitAdd.on('close', callback)
  }

, commit: function (message) {
    var self = this

    var makeCommit = function (msg) {
      self.add('.', function () {
        var gitStatus = spawn('git', ['commit', '-m', msg], {
          cwd: self.path
        })
      })
    }

    if (!message) {
      self.changedFiles (function (files) {
        message = 'Changed ' + files.join(', ')
        makeCommit(message)
      })
    } else {
      makeCommit(message)
    }
  }

, push: function (callback) {
    var gitPush = spawn('git', ['push'], {
      cwd: this.path
    })
    gitPush.on('close', callback)
  }
})

module.exports = Repository
