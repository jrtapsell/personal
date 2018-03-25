const EXTERNAL = {
  "gulp": require("gulp"),
  "handlebars": require("gulp-compile-handlebars"),
  "rename": require("gulp-rename"),
  "htmlMin": require("gulp-htmlmin"),
  "cleanCSS": require("gulp-clean-css"),
  "gulpIgnore": require("gulp-ignore"),
  "siteMap": require("gulp-sitemap"),
  "serviceWorker": require("sw-precache"),
  "imageMin": require("gulp-imagemin"),
  "fileSystem": require("fs")
};

const ALL_TASKS = [];

function defineTask(name, action) {
  EXTERNAL.gulp.task(name, action);
  ALL_TASKS.push(name);
}


defineTask("css", function(){
  return EXTERNAL.gulp.src("src/css/index.css")
    .pipe(EXTERNAL.cleanCSS())
    .pipe(EXTERNAL.gulp.dest("dist"));
});

defineTask("js", function() {
  return EXTERNAL.gulp.src("src/js/*.js")
    .pipe(EXTERNAL.gulp.dest("dist/js"));
});


defineTask("img", function(){
  return EXTERNAL.gulp.src("src/img/*")
    .pipe(EXTERNAL.imageMin())
    .pipe(EXTERNAL.gulp.dest("dist/img"));
});


defineTask("font", function(){
  return EXTERNAL.gulp.src("src/res/min-font/**")
    .pipe(EXTERNAL.gulp.dest("dist/res/min-font"));
});


defineTask("pages", function () {
  return EXTERNAL.gulp.src("src/hbs/pages/*.hbs")
    .pipe(EXTERNAL.handlebars(null, {
      ignorePartials: false,
      batch: ["src/partials"],
      compile: {strict: true},
      helpers: {
        "load_file" (filename, options) {
          const filePath = "./src/data/" + filename;
          const data = JSON.parse(EXTERNAL.fileSystem.readFileSync(filePath, 'utf8'));
          return new EXTERNAL.handlebars.Handlebars.SafeString(options.fn(data));
        }
      }
    }))
    .pipe(EXTERNAL.rename({
      extname: ".html"
    }))
    .pipe(EXTERNAL.htmlMin({collapseWhitespace: true}))
    .pipe(EXTERNAL.gulp.dest("dist"));
});


defineTask("mdl-css", function() {
  return EXTERNAL.gulp.src("src/res/mdl/custom.css")
    .pipe(EXTERNAL.cleanCSS())
    .pipe(EXTERNAL.gulp.dest("dist/res/mdl"));
});

defineTask("manifest", function(){
  return EXTERNAL.gulp.src("src/manifest/manifest.json")
    .pipe(EXTERNAL.gulp.dest("dist"));
});

defineTask("make-sw", function(callback) {
  EXTERNAL.serviceWorker.write("dist/service-worker.js", {
    staticFileGlobs: ["dist/**/*"],
    stripPrefix: "dist"
  }, callback);
});

defineTask("sitemap", function () {
  return EXTERNAL.gulp.src("dist/*.html", {
    read: false
  })
    .pipe(EXTERNAL.gulpIgnore.exclude("google*.html"))
    .pipe(EXTERNAL.siteMap({
      siteUrl: "http://www.jrtapsell.co.uk"
    }))
    .pipe(EXTERNAL.gulp.dest("./dist"));
});

defineTask("extra", function(){
  return EXTERNAL.gulp.src(["extra/*", "extra/.**/*"])
    .pipe(EXTERNAL.gulp.dest("dist"));
});



EXTERNAL.gulp.task("default", EXTERNAL.gulp.series(ALL_TASKS));