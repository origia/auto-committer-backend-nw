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
        changedFilesNumber: stats[1]
      , additionsNumber: stats[2]
      , deletionsNumber: stats[3]
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
})


module.exports = Repository
