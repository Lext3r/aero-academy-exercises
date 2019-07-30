const gulp = require("gulp");
const gulpIf = require('gulp-if');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();


const del = require('del');

const pug = require('gulp-pug');

const webpack = require('webpack');
const gulpWebpack = require('webpack-stream');
const webpackConfig = require('./webpack.config');

const PATHS = {
    app: "./app",
    dist: "./dist"
}
gulp.task('clear', ()=>{return del(PATHS.dist);});
gulp.task('templates', ()=>{
    return gulp
        .src(`${PATHS.app}/pages/**/*.pug`, { since: gulp.lastRun("templates") })
        .pipe(plumber())
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest(PATHS.dist))
        .pipe(browserSync.stream());
});
gulp.task('styles', ()=>{});
gulp.task('scripts', ()=>{
    return gulp
    .src(`${PATHS.app}/common/scripts/**/*.js`, { since: gulp.lastRun("templates") })
    .pipe(gulpWebpack(webpackConfig, webpack))
    .pipe(gulp.dest(`${PATHS.dist}/assets/scripts`))
});
gulp.task('images', ()=>{});
gulp.task('copy', ()=>{});
gulp.task('server', ()=>{});
gulp.task('watch', ()=>{});