'use strict';

var through = require('through2');
var gutil = require('gulp-util');

function convertString(input, regex, replace) {
  var result = input;
  var variables = input.match(regex);


  if (variables != null) variables.forEach(function(v) {
    var r = replace;
    if (typeof(replace) == 'function') {
      r = replace(v);
    }
    result = result.replace(v, r);
  });

  return result;
};

var gulpRegexReplace = function(options) {
  if (options == void 0) { options = {}; }

  if (options.replace == void 0) { options.replace = ''; }

  return through.obj(function (file, enc, callback) {
    if (file.isStream()) {
      throw new gutil.PluginError('gulp-regex-replace', 'streams not implemented');
    } else if (file.isBuffer()) {
      var contents = String(file.contents);

      if (options.regex != void 0) {
        contents = convertString(contents, new RegExp(options.regex, "g"), options.replace);
      }

      file.contents = new Buffer(contents);
    }

    this.push(file);
    return callback();
  });
};

module.exports = gulpRegexReplace;
