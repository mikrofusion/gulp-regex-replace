'use strict';

var obfuscate = require('../'),
    es        = require('event-stream'),
    gutil     = require('gulp-util'),
    should    = require('should');

function generateFile(contents) {
  if (contents == void 0) {contents = ''; }

  return new gutil.File({
    path: './testfile.js',
    cwd: './',
    base: './',
    contents: new Buffer(contents)
  });
}

function expect_equals(regex, replace, input, output, done) {
  var stream = obfuscate({'regex': regex, 'replace': replace});

  stream.on('data', function(file) {
    String(file.contents).should.equal(output);
    done();
  });

  stream.write(generateFile(input));
  stream.end();
}

var input = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, ...';

describe('gulp-regex-replace', function() {
  describe('when given an empty input buffer', function() {
    var regex = '';
    var replace = '';
    var output = input;

    it('does nothing', function(done) {
      expect_equals(regex, replace, input, output, done);
    });
  });

  describe('given a list of words as input', function() {
    describe('and no regular expression', function() {
      var regex = void 0;
      var replace = 'blah';
      var output = input;

      it('does nothing', function(done) {
        expect_equals(regex, replace, input, output, done);
      });
    });

    describe('and a regular expression', function() {
      describe('and no replace string', function() {
        var regex = input;
        var replace = void 0;
        var output = '';

        it('removes matching text', function(done) {
          expect_equals(regex, replace, input, output, done);
        });
      });

      describe('and a replace string without regex groups', function() {
        var regex = 'consectetur adipisicing elit, ...';
        var replace = '...';
        var output = input.replace(regex, replace);

        it('replaces any matching text with the replace string', function(done) {
          expect_equals(regex, replace, input, output, done);
        });
      });

      describe('and a replace string with regex groups', function() {
        var input = 'var xy; var abc = xyz; var xyz;';
        var regex = 'var ([_A-Za-z0-9]+)[ ,;]';
        var replace = 'x';
        var output = 'var x; var x = x; var x;';

        it('replaces any matching text with the replace string', function(done) {
          expect_equals(regex, replace, input, output, done);
        });
      });

      describe('and a replace function', function() {
        var regex = '__v_[_A-Za-z0-9]+__';

        it('replaces any matching text with the result of the replace function', function(done) {
          var modifiedInput = input.replace('Lorem', '__v_lorem__');
          var replace = function(v) { return 'DeLorean'; };
          var output = 'DeLorean ipsum dolor sit amet, consectetur adipisicing elit, ...';
          expect_equals(regex, replace, modifiedInput, output, done);
        });

        it('passes the variable matching the regular expression', function(done) {
          var replace = function(v) { return v; };
          var output = input;
          expect_equals(regex, replace, input, output, done);
        });
      });
    });
  });
});
