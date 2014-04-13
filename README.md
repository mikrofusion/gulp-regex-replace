# [gulp](http://gulpjs.com)-regex-replace [![Build Status](https://travis-ci.org/mikegroseclose/gulp-regex-replace.svg?branch=master)](https://travis-ci.org/mikegroseclose/gulp-regex-replace)

> Replace your code using regular expressions.

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

Values: `word`, `__v_[_A-Za-z0-9]+__`, `...`

The regular expresion used to match words that should be replaced.

#### options.replace

Type: `String` or `Method`

Default: `''`

Values: `DeLorean`, `Lorem`, `function(match) { return 'DeLorean'; }`, `...`

The replace string or method.

If a method is given then the result of that method will be the replace string.
The input to that method will be the string matching the regular expression.

## License

[MIT](http://opensource.org/licenses/MIT) © Mike Groseclose
