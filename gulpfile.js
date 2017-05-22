var gulp = require('gulp');
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var download = require("gulp-download");
var gulpIgnore = require('gulp-ignore');
var sitemap = require('gulp-sitemap');
var aws = require( 'gulp-awspublish' );
var gutil = require('gulp-util');


gulp.task('pages', function () {
  return gulp.src('src/hbs/pages/*.hbs')
    .pipe(handlebars(null, {
      ignorePartials: false,
      batch: ['src/partials'],
      compile: {strict: true},
      helpers: {
        "load_file": function (filename, options) {
          var data = require("./src/data/" + filename);
          return new handlebars.Handlebars.SafeString(options.fn(data));
        }
      }
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




gulp.task('manifest', function(){
  return gulp.src('src/manifest/manifest.json')
    .pipe(gulp.dest("dist"))
});


gulp.task('font', function(){
  return gulp.src('src/res/min-font/**')
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

gulp.task('js', function() {
  return gulp.src('src/js/*.js')
    .pipe(gulp.dest("dist/js"))
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

gulp.task('sitemap', function () {
    return gulp.src('dist/*.html', {
      read: false
    })
    .pipe(gulpIgnore.exclude('google*.html'))
    .pipe(sitemap({
      siteUrl: 'http://www.jrtapsell.co.uk'
    }))
    .pipe(gulp.dest('./dist'));
});


var key = process.env.AWS_ACCESS_KEY_ID;
var secret = process.env.AWS_SECRET_ACCESS_KEY;

gutil.log(key);
gutil.log(secret);

gulp.task('aws', () => {
  var publisher = aws.create({
    region: 'eu-west-2',
    params: {
      Bucket: "wwwjrtapsellcouk",
    },
    accessKeyId: key,
    secretAccessKey: secret
  });

  var headers = {
    'Cache-Control': 'max-age=315360000, no-transform, public'
  };
  return gulp.src('./dist/**')
    .pipe(publisher.publish(headers))
    .pipe(publisher.cache())
    .pipe(aws.reporter());
});


gulp.task('default', gulp.series('css', 'js', 'img', 'extra', 'font', 'ga', 'pages', 'mdl-css', 'mdl-js', 'manifest', 'make-sw', 'sitemap'));
gulp.task('deploy', gulp.series('default', 'aws'));