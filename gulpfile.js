var gulp = require('gulp');
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');

gulp.task('render', function () {
  var templateData = require("./src/data/data.json");

  return gulp.src('src/hbs/index.hbs')
    .pipe(handlebars(templateData))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('dist'));
});


gulp.task('css', function(){
  return gulp.src('src/css/index.css')
    .pipe(gulp.dest("dist"))
});


gulp.task('img', function(){
  return gulp.src('src/img/*')
    .pipe(gulp.dest("dist/img"))
});


gulp.task('default', ['render', 'css', 'img']);