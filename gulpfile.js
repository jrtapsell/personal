const gulp = require("gulp");
const handlebars = require("gulp-compile-handlebars");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const cleanCSS = require("gulp-clean-css");
const gulpIgnore = require("gulp-ignore");
const siteMap = require("gulp-sitemap");
const serviceWorker = require("sw-precache");
const imagemin = require('gulp-imagemin');


gulp.task("pages", function () {
  return gulp.src("src/hbs/pages/*.hbs")
    .pipe(handlebars(null, {
      ignorePartials: false,
      batch: ["src/partials"],
      compile: {strict: true},
      helpers: {
        "load_file": function (filename, options) {
          const data = require("./src/data/" + filename);
          return new handlebars.Handlebars.SafeString(options.fn(data));
        }
      }
    }))
    .pipe(rename({
      extname: ".html"
    }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("dist"));
});


gulp.task("css", function(){
  return gulp.src("src/css/index.css")
    .pipe(cleanCSS())
    .pipe(gulp.dest("dist"))
});




gulp.task("manifest", function(){
  return gulp.src("src/manifest/manifest.json")
    .pipe(gulp.dest("dist"))
});


gulp.task("font", function(){
  return gulp.src("src/res/min-font/**")
    .pipe(gulp.dest("dist/res/min-font"))
});


gulp.task("mdl-css", function() {
  return gulp.src("src/res/mdl/custom.css")
    .pipe(cleanCSS())
    .pipe(gulp.dest("dist/res/mdl"));
});

gulp.task("js", function() {
  return gulp.src("src/js/*.js")
    .pipe(gulp.dest("dist/js"))
});



gulp.task("img", function(){
  return gulp.src("src/img/*")
    .pipe(imagemin())
    .pipe(gulp.dest("dist/img"))
});

gulp.task("extra", function(){
  return gulp.src(["extra/*", "extra/.**/*"])
    .pipe(gulp.dest("dist"))
});

gulp.task("make-sw", function(callback) {
  serviceWorker.write("dist/service-worker.js", {
    staticFileGlobs: ["dist/**/*"],
    stripPrefix: "dist"
  }, callback);
});

gulp.task("sitemap", function () {
    return gulp.src("dist/*.html", {
      read: false
    })
    .pipe(gulpIgnore.exclude("google*.html"))
    .pipe(siteMap({
      siteUrl: "http://www.jrtapsell.co.uk"
    }))
    .pipe(gulp.dest("./dist"));
});



gulp.task("default", gulp.series("css", "js", "img", "font", "pages", "mdl-css", "manifest", "make-sw", "sitemap",  "extra"));