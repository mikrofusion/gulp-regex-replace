'use strict';

var through = require('through2');
var gutil = require('gulp-util');

function convertString(input, regexOptions, replace) {
  console.log('--->' + regexOptions);


  if(!(regexOptions instanceof Array)) {
    regexOptions = [regexOptions];
  }

  if (regexOptions[0] == void 0) { return input; }

  var result = input;

  var regex = new RegExp(regexOptions.shift(), "g");

  var match = regex.exec(input);

    console.log('matching: ' + result);

  while (match != null && match[0] != '') {
    var v, r, index;
    r = replace;

    if (match.length == 1) {
      index = 0;
    } else { index = 1; }

    console.log('match: ' + match);

    while (index < match.length) {
      v = match[index];

      console.log('replacing: ' + v + ' ' + regexOptions.length);

      if(regexOptions.length == 0) {
        if (typeof(replace) == 'function') {
          r = replace(v);
        }

        result = result.replace(new RegExp(v, 'g'), r);
      } else {
        result = convertString(input, regexOptions, replace);
      }

      index++;
    }

    match = regex.exec(result);
  }

  return result;
};

var gulpRegexReplace = function(options) {
  if(!(options instanceof Array)) {
    options = [options];
  }

  options.forEach(function(element, index, array) {
    if (element == void 0) { element = {}; }
    if (element.replace == void 0) { element.replace = ''; }
  });

  return through.obj(function (file, enc, callback) {
    if (file.isStream()) {
      throw new gutil.PluginError('gulp-regex-replace', 'streams not implemented');
    } else if (file.isBuffer()) {
      var contents = String(file.contents);

      options.forEach(function(element, index, array) {
        contents = convertString(contents, element.regex, element.replace);
        console.log(contents);
      });

      file.contents = new Buffer(contents);
    }

    this.push(file);
    return callback();
  });
};

module.exports = gulpRegexReplace;
