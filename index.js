'use strict';

var through = require('through2');
var gutil = require('gulp-util');

function convertString(input, regex, replace) {
  var result = input;

  var match = regex.exec(input);

  while (match != null && match[0] != '') {
    var v, r, index;
    r = replace;

    if (match.length == 1) {
      index = 0;
    } else { index = 1; }

    while (index < match.length) {
      v = match[index];
      if (typeof(replace) == 'function') {
        r = replace(v);
      }
      result = result.replace(new RegExp(v, 'g'), r);
      index++;
    }

    match = regex.exec(input);
  }

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
