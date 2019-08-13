/*Common modules*/
const gulp = require("gulp");
const gulpIf = require('gulp-if');
const plumber = require('gulp-plumber');

/*Clear modules*/
const del = require('del');

/*Templates modules*/
const pug = require('gulp-pug');

/*Styles modules*/
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const minify = require('gulp-clean-css');

/*Scripts modules*/
const webpack = require('webpack');
const gulpWebpack = require('webpack-stream');
const webpackConfig = require('./webpack.config');

/*Images modules*/
const imageMin = require('gulp-imagemin');

/*Server modules*/
const browserSync = require('browser-sync').create();

const isProduction = process.env.NODE_ENV === "production";

//svg-sprite
const svgSprite = require("gulp-svg-sprite");
const svgmin = require("gulp-svgmin");

const PATHS = {
    app: "./app",
    dist: "./dist"
}

gulp.task('clear', ()=>{
    return del(PATHS.dist);
});

gulp.task('templates', ()=>{
    return gulp
        .src(`${PATHS.app}/pages/**/*.pug`)
        .pipe(plumber())
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest(PATHS.dist))
        .pipe(browserSync.stream());
});

gulp.task('styles', ()=>{
    return gulp
    .src(`${PATHS.app}/common/styles/app.scss`)
    .pipe(plumber())
    .pipe(gulpIf(!isProduction, sourcemaps.init()))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulpIf(isProduction, minify()))
    .pipe(gulpIf(!isProduction, sourcemaps.write()))
    .pipe(gulp.dest(`${PATHS.dist}/assets/styles`));
});

gulp.task('scripts', ()=>{
    return gulp
    .src(`${PATHS.app}/common/scripts/**/*.js`, { since: gulp.lastRun("scripts") })
    .pipe(gulpWebpack(webpackConfig, webpack))
    .pipe(gulp.dest(`${PATHS.dist}/assets/scripts`))
});

gulp.task('images', ()=>{
    return gulp
    .src(`${PATHS.app}/common/images/**/*.+(png|jpg|iso|jpeg|gif|svg)`, { since: gulp.lastRun("images") })
    .pipe(plumber())
    .pipe(gulpIf(isProduction, imageMin()))
    .pipe(gulp.dest(`${PATHS.dist}/assets/images`));
});

gulp.task("icons", () => {
    return gulp
      .src(`${PATHS.app}/common/icons/**/*.svg`)
      .pipe(plumber())
      .pipe(svgmin({
        js2svg: {
          pretty: true
        }
      }))
      .pipe(
        svgSprite({
          mode: {
            symbol: {
              sprite: "../dist/assets/images/icons/sprite.svg",
              render: {
                scss: {
                  dest:'../app/common/styles/helpers/sprites.scss',
                  template: './app/common/styles/helpers/sprite-template.scss'
                }
              }
            }
          }
        })
      )
      .pipe(gulp.dest('./'));
  });

gulp.task('copy', ()=>{
    return gulp
    .src(`${PATHS.app}/common/fonts/**/*.*`, { since: gulp.lastRun("copy") })
    .pipe(plumber())
    .pipe(gulp.dest(`${PATHS.dist}/assets/fonts`));
});

gulp.task('server', ()=>{
    browserSync.init({
        server: PATHS.dist
    });
    browserSync.watch(PATHS.dist + "/**/*.*", browserSync.reload);
});

gulp.task("watch", () => {
    gulp.watch(`${PATHS.app}/**/*.pug`, gulp.series("templates"));
    gulp.watch(`${PATHS.app}/**/*.scss`, gulp.series("styles"));
    gulp.watch(`${PATHS.app}/**/*.js`, gulp.series("scripts"));
    gulp.watch(
        `${PATHS.app}/common/images/**/*.+(png|jpg|iso|jpeg|gif|svg)`,
        gulp.series("images")
    );
    gulp.watch(`${PATHS.app}/common/fonts/**/*`, gulp.series("copy"));
});

gulp.task(
    "default",
    gulp.series("icons",
        gulp.parallel("templates", "styles", "scripts", "images", "copy"),
        gulp.parallel("watch", "server")
    )
);

gulp.task(
    "production",
    gulp.series(
        "clear",
        gulp.parallel("templates", "icons", "styles", "scripts", "images", "copy")
    )
);
