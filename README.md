# gulp-regex-replace [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

> [gulp](http://gulpjs.com) plugin to replace your code using regular expressions.

## Install

```bash
$ npm install --save-dev gulp-regex-replace
```

## Usage

```js
var gulp = require('gulp');
var replace = require('gulp-regex-replace');

gulp.task('default', function () {
	return gulp.src('test.js')
		.pipe(replace({regex:'Lorem', replace:'DeLorean'}));
});
```

## API

### replace(options)

#### options.regex

Type: `String`

Default: ` `

Values: `word`, `__v_[_A-Za-z0-9]+__`, `.(abc).`,  `...`

The regular expresion used to match words that should be replaced.

If the regular expression contains groups (denoted by a value within parenthesis)
then only the groups will be replaced rather than the entire matching string.

#### options.replace

Type: `String` or `Method`

Default: `''`

Values: `DeLorean`, `Lorem`, `function(match) { return 'DeLorean'; }`, `...`

The replace string or method.

If a method is given then the result of that method will be the replace string.
The input to that method will be the string matching the regular expression.

## License

[MIT](http://opensource.org/licenses/MIT) © Mike Groseclose

[npm-url]: https://npmjs.org/package/gulp-regex-replace
[npm-image]: https://badge.fury.io/js/gulp-regex-replace.png

[travis-url]: http://travis-ci.org/mikegroseclose/gulp-regex-replace
[travis-image]: https://secure.travis-ci.org/mikegroseclose/gulp-regex-replace.png?branch=master
