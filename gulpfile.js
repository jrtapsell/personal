var gulp = require('gulp');
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');

gulp.task('render', function () {
  var templateData = require("./src/data/data.json");

  return gulp.src('src/hbs/index.hbs')
    .pipe(handlebars(templateData))
    .pipe(rename('index.html'))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});


gulp.task('css', function(){
  return gulp.src('src/css/index.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest("dist"))
});


gulp.task('res', function(){
  return gulp.src('src/res/*')
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


gulp.task('default', ['render', 'css', 'img', 'extra', 'res']);