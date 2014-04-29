'use strict';

var through = require('through2');
var gutil = require('gulp-util');

function findMatch(input, regexOptions) {
  var result = [input];
  var regex;

  while((regex = regexOptions.shift()) != null) {
    result = findSingleMatch(input, regex);
    input = result.join(' ');
  }
  return result;
}

function regexMatch(input, regex) {
  var result = [];

  if (regex == void 0) {
    return null;
  }

  var regexp = new RegExp(regex, "g");
  var match = regexp.exec(input);

  while (match != null && match[0] != '') {
    var index, v;

    if (match.length == 1) {
      index = 0;
    } else { index = 1; }

    while (index < match.length) {
      v = match[index];
      result.push(v)
      index++;
    }

    match = regexp.exec(input);
  }

  return result;
}

function findSingleMatch(input, regex) {
  var result = [];

  if (regex == void 0) { return null; }

  var include = regex, exclude;
  if (regex.exclude != void 0) { exclude = regex.exclude; }
  if (regex.include != void 0) { include = regex.include; }

  var excludeList = regexMatch(input, exclude);
  var includeList = regexMatch(input, include);

  if(excludeList != null) {
    return includeList.filter(function(element) {return excludeList.indexOf(element) < 0;});
  } else {
    return includeList;
  }
}

function isWord(str) {
  if (str == (new RegExp('\w', 'g').exec(str))) {
    return true;
  }
  return false;
}

function convertString(input, regexOptions, replace) {
  if(!(regexOptions instanceof Array)) {
    regexOptions = [regexOptions];
  }

  if (regexOptions[0] == void 0) { return input; }

  var result = input;
  var matches = findMatch(input, regexOptions);

  if (matches != null) {
    matches.forEach(function(element, index, array) {
      var r = replace;
      if (typeof(replace) == 'function') {
        r = replace(element);
      }

      var regexReplace;

      if (isWord(element)) {
        regexReplace = new RegExp('\\b' + element + '\\b', 'g');
      } else {
        regexReplace = new RegExp(element, 'g');
      }
      result = result.replace(regexReplace, r);

      // also replace all future replace strings
      matches.forEach(function(element, index, array) {
        array[index] = element.replace(regexReplace, r);
      });
    });
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
      });

      file.contents = new Buffer(contents);
    }

    this.push(file);
    return callback();
  });
};

module.exports = gulpRegexReplace;
