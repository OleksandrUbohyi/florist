const { src, dest, task, series, watch, parallel } = require("gulp"),
  { SRC_PATH, DIST_PATH, STYLES_LIBS, JS_LIBS } = require("./gulp.config"),
  rm = require("gulp-rm"),
  sass = require("gulp-sass"),
  concat = require("gulp-concat"),
  browserSync = require("browser-sync").create(),
  reload = browserSync.reload,
  sassGlob = require("gulp-sass-glob"),
  autoprefixer = require("gulp-autoprefixer"),
  cleanCSS = require("gulp-clean-css"),
  sourcemaps = require("gulp-sourcemaps"),
  babel = require("gulp-babel"),
  uglify = require("gulp-uglify"),
  svgo = require("gulp-svgo"),
  svgSprite = require("gulp-svg-sprite"),
  imagemin = require("imagemin"),
  gulpif = require("gulp-if"),
  env = process.env.NODE_ENV;

sass.compiler = require("node-sass");

task("clean", () => {
  //стрелочная функция - она короче
  console.log(env);
  return src(`${DIST_PATH}/**/*`, { read: false }).pipe(rm());
});

task("images", function () {
  return src(`${SRC_PATH}/images/*.{jpg,png,jpeg,svg,gif}`).pipe(
    dest(DIST_PATH + "/images")
  );
});

task("copy:html", () => {
  return src(`${SRC_PATH}/*.html`)
    .pipe(dest(DIST_PATH))
    .pipe(reload({ stream: true }));
});

task("styles", () => {
  return src([...STYLES_LIBS, `${SRC_PATH}/styles/main.scss`])
    .pipe(gulpif(env === "dev", sourcemaps.init()))
    .pipe(concat("main.min.scss"))
    .pipe(sassGlob()) //чтобы можно было импортировать .scss с помощью import *.scss
    .pipe(sass().on("error", sass.logError))
    .pipe(
      gulpif(
        env === "dev",
        autoprefixer({
          cascade: false,
        })
      )
    )
    .pipe(
      gulpif(
        env === "prod",
        cleanCSS({
          level: 2,
        })
      )
    )
    .pipe(gulpif(env === "dev", sourcemaps.write()))
    .pipe(dest(DIST_PATH))
    .pipe(reload({ stream: true }));
});

task("scripts", () => {
  return src([...JS_LIBS, "src/js/*.js"])
    .pipe(gulpif(env === "dev", sourcemaps.init()))
    .pipe(concat("main.min.js", { newLine: ";" })) //проставляет ; перед каждым новым файлом
    .pipe(
      gulpif(
        env === "prod",
        babel({
          presets: ["@babel/env"],
        })
      )
    )
    .pipe(gulpif(env === "prod", uglify()))
    .pipe(gulpif(env === "dev", sourcemaps.write()))
    .pipe(dest(DIST_PATH))
    .pipe(reload({ stream: true }));
});

task("icons", () => {
  return (
    src("src/images/**/*.svg")
      //     .pipe(svgo({
      //         plugins: [{
      //             removeAttrs: {
      //                 attrs: "(fill|stroke|style|width|data.*)"
      //             }
      //         }]
      //     }))
      //     .pipe(svgSprite({
      //         mode: {
      //             symbol: {
      //                 sprite: "../sprite.svg"
      //             }
      //         }
      //     }))
      .pipe(dest(`${DIST_PATH}/images`))
  );
});

task("server", () => {
  browserSync.init({
    server: {
      baseDir: DIST_PATH,
    },
  });
});

task("watch", () => {
  watch(`./${SRC_PATH}/styles/*.scss`, series("styles"));
  watch(`./${SRC_PATH}/*.html`, series("copy:html"));
  watch(`./${SRC_PATH}/js/*.js`, series("scripts"));
  watch(`./${SRC_PATH}/images/icons/*.svg`, series("icons"));
  watch(`./${SRC_PATH}/images/*.{jpg,png,jpeg,svg,gif}`, series("images"));
});

task(
  "default",
  series(
    "clean",
    parallel("copy:html", "styles", "scripts", "icons", "images"),
    parallel("watch", "server")
  )
);

task(
  "build",
  series(
    "clean",
    parallel("copy:html", "styles", "scripts", "icons", "images"),
    parallel("watch", "server")
  )
);

// exports.copy = copy
//чтобы могли отдельно вызывать этот таск, первое copy - название которое мы захотим
