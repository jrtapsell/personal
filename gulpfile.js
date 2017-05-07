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


gulp.task('font', function(){
  return gulp.src('src/res/min-font/**')
    .pipe(cleanCSS())
    .pipe(gulp.dest("dist/res/min-font"))
});


gulp.task('mdl-css', function() {
  return gulp.src('src/res/mdl/custom.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest("dist/res/mdl"));
});

gulp.task('mdl-js', function() {
  return gulp.src('src/res/mdl/material.min.js')
    .pipe(gulp.dest("dist/res/mdl"))
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
    .pipe(gulp.dest("dist/res/ga/"))
});

gulp.task('make-sw', function(callback) {
  var path = require('path');
  var swPrecache = require('sw-precache');

  swPrecache.write("dist/service-worker.js", {
    staticFileGlobs: ['dist/**/*'],
    stripPrefix: 'dist'
  }, callback);
});


gulp.task('default', gulp.series('render', 'css', 'img', 'extra', 'font', 'ga', 'pages', 'make-sw', 'mdl-css', 'mdl-js'));