var gulp = require('gulp');
var fs = require('fs');
var minifyCSS = require('gulp-csso');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');

const RESOURCE_ROOT = "https://widget.battleforthenet.com/iframe"

gulp.task('js', function(){
	return gulp.src('iframe/script.js')
    .pipe(replace('RESOURCE_ROOT', RESOURCE_ROOT))
	  .pipe(uglify())
	  .pipe(gulp.dest('build/iframe'));
});

gulp.task('css', function(){
  return gulp.src('iframe/style.css')
    .pipe(replace('RESOURCE_ROOT', RESOURCE_ROOT))
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/iframe'));
});

gulp.task('iframe', ['js', 'css'], function(){
  return gulp.src('iframe/iframe.html')
    .pipe(replace('RESOURCE_ROOT', RESOURCE_ROOT))
    .pipe(replace('SCRIPT_JS', fs.readFileSync('build/iframe/script.js')))
    .pipe(replace('STYLE_CSS', fs.readFileSync('build/iframe/style.css')))
    .pipe(gulp.dest('build/iframe'));
});

gulp.task('widget', ['iframe'], function(){
  var iframeContents = fs.readFileSync('build/iframe/iframe.html');
  var encodedContents = iframeContents.toString('base64');

  return gulp.src('widget.js')
    .pipe(replace('ENCODED_IFRAME', encodedContents))
    .pipe(gulp.dest('build'));
});

gulp.task('watch', ['default'], function(){
  gulp.watch(['iframe/*', 'widget.js'], ['widget']);
});

gulp.task('default', ['widget']);
