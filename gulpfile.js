var gulp = require('gulp');
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var download = require("gulp-download");

gulp.task('render', function () {
  var templateData = require("./src/data/data.json");

  return gulp.src('src/hbs/index.hbs')
    .pipe(handlebars({"items":templateData}, {
      ignorePartials: false,
      batch: ['src/partials']
    }))
    .pipe(rename('index.html'))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});


gulp.task('pages', function () {
  return gulp.src('src/hbs/pages/*.hbs')
    .pipe(handlebars(null, {
      ignorePartials: false,
      batch: ['src/partials'],
      compile: {strict: true}
    }))
    .pipe(rename({
      extname: ".html"
    }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});


gulp.task('css', function(){
  return gulp.src('src/css/index.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest("dist"))
});


gulp.task('res', function(){
  return gulp.src('src/res/**')
    .pipe(gulp.dest("dist/res"))
});



gulp.task('img', function(){
  return gulp.src('src/img/*')
    .pipe(gulp.dest("dist/img"))
});

gulp.task('extra', function(){
  return gulp.src('extra/*')
    .pipe(gulp.dest("dist"))
});

gulp.task('ga', function () {
  return download('https://www.google-analytics.com/analytics.js')
    .pipe(gulp.dest("dist/res/ga/"));
});


gulp.task('default', ['render', 'css', 'img', 'extra', 'res', 'ga', 'pages']);