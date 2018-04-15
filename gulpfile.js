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
  "fileSystem": require("fs"),
  "uglify": require('gulp-uglify'),
  "showdown": require('showdown'),
};

const ALL_TASKS = [];

function defineTask(name, action) {
  EXTERNAL.gulp.task(name, action);
  ALL_TASKS.push(name);
}

/**
 * Optimises the CSS
 */
defineTask("css", function () {
  return EXTERNAL.gulp.src("src/css/index.css")
    .pipe(EXTERNAL.cleanCSS())
    .pipe(EXTERNAL.gulp.dest("dist"));
});

/**
 * Minifies the JS
 */
defineTask("js", function () {
  return EXTERNAL.gulp.src("src/js/*.js")
    .pipe(EXTERNAL.gulp.dest("dist/js"));
});

/**
 * Compresses the images
 */
defineTask("img", function () {
  return EXTERNAL.gulp.src("src/img/*")
    .pipe(EXTERNAL.imageMin())
    .pipe(EXTERNAL.gulp.dest("dist/img"));
});


/**
 * Brings in the fonts
 */
defineTask("font", function () {
  return EXTERNAL.gulp.src("src/res/min-font/**")
    .pipe(EXTERNAL.gulp.dest("dist/res/min-font"));
});

/**
 * Creates all of the site pages
 */
defineTask("pages", function () {
  converter = new EXTERNAL.showdown.Converter()
  return EXTERNAL.gulp.src("src/hbs/pages/*.hbs")
    .pipe(EXTERNAL.handlebars(null, {
      ignorePartials: false,
      batch: ["src/partials"],
      compile: {strict: true},
      helpers: {
        "load_file"(filename, options) {
          const filePath = "./src/data/" + filename;
          const data = JSON.parse(EXTERNAL.fileSystem.readFileSync(filePath, "utf8"));
          return new EXTERNAL.handlebars.Handlebars.SafeString(options.fn(data));
        },
        "markdown"(body) {
          return new EXTERNAL.handlebars.Handlebars.SafeString(converter.makeHtml(body.fn()))
        }
      }
    }))
    .pipe(EXTERNAL.rename({
      extname: ".html"
    }))
    .pipe(EXTERNAL.htmlMin({collapseWhitespace: true}))
    .pipe(EXTERNAL.gulp.dest("dist"));
});

/**
 * Brings in the CSS files
 */
defineTask("mdl-css", function () {
  return EXTERNAL.gulp.src("src/res/mdl/custom.css")
    .pipe(EXTERNAL.cleanCSS())
    .pipe(EXTERNAL.gulp.dest("dist/res/mdl"));
});

/**
 * Creates the manifest
 */
defineTask("manifest", function () {
  return EXTERNAL.gulp.src("src/manifest/manifest.json")
    .pipe(EXTERNAL.gulp.dest("dist"));
});

/**
 * Makes the service worker
 */
defineTask("make-sw", function (callback) {
  EXTERNAL.serviceWorker.write("dist/service-worker.js", {
    staticFileGlobs: ["dist/**/*"],
    stripPrefix: "dist"
  }, callback);
});

/**
 * Builds the sitemap
 */
defineTask("sitemap", function () {
  return EXTERNAL.gulp.src("dist/*.html", {read: false})
    .pipe(EXTERNAL.siteMap({
      siteUrl: "https://www.jrtapsell.co.uk"
    }))
    .pipe(EXTERNAL.gulp.dest("./dist"));
});

/**
 * Adds things that shouldn't be cached and shouldn't be in the sitemap
 */
defineTask("extra", function () {
  return EXTERNAL.gulp.src(["extra/*", "extra/.**/*"])
    .pipe(EXTERNAL.gulp.dest("dist"));
});

/**
 * Creates the default task
 */
  EXTERNAL.gulp.task("default", EXTERNAL.gulp.series(ALL_TASKS));