// 'use strict'

const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const del = require('del')

const paths = {
  styles: {
    src: 'src/scss/**/*.scss',
    dest: 'dist/css/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'dist/js/'
  }
}

const clean = () => {
  return del(['dist'])
}

const scss = () => {
  return gulp.src(paths.styles.src)
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(rename({
      basename: 'style',
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest))
}

const scripts = () => {
  return gulp.src(paths.scripts.src, {
      sourcemaps: true
    })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('script.min.js'))
    .pipe(gulp.dest(paths.scripts.dest))
}

const watch = () => {
  gulp.watch(paths.styles.src, scss)
  gulp.watch(paths.scripts.src, scripts)
}

const build = gulp.series(clean, gulp.parallel(scripts, scss), watch)

exports.clean = clean
exports.scss = scss
exports.watch = watch
exports.scripts = scripts
exports.default = build