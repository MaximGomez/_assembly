'use strict'

const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const newer = require('gulp-newer')
const htmlmin = require('gulp-htmlmin')
const size = require('gulp-size')
const browsersync = require('browser-sync').create()
const gulppug = require('gulp-pug')
const del = require('del')

const paths = {
  pug: {
    src: 'src/pug/**/*.pug',
    dest: 'dist/'
  },
  html: {
    src: 'src/*.html',
    dest: 'dist/'
  },
  styles: {
    src: 'src/scss/**/*.scss',
    dest: 'dist/css/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'dist/js/'
  },
  images: {
    src: 'src/img/**',
    dest: 'dist/img/'
  }
}

const clean = () => {
  return del(['dist/*', '!dist/img'])
}

const pug = () => {
  return gulp.src(paths.pug.src)
    .pipe(gulppug())
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    // .pipe(rename({
    //   basename: 'index',
    //   suffix: '.min'
    //  }))
    .pipe(size())
    .pipe(gulp.dest(paths.pug.dest))
    .pipe(browsersync.stream())
}

// const html = () => {
//   return gulp.src(paths.html.src)
//     .pipe(htmlmin({
//        collapseWhitespace: true
//     }))
//     .pipe(size())
//     .pipe(gulp.dest(paths.html.dest))
//     .pipe(browsersync.stream())
// }

const scss = () => {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
			cascade: false
		}))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(concat('style.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(size())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browsersync.stream())
}

const scripts = () => {
  return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(concat('script.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(size())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browsersync.stream())
}

const img = () => {
	return gulp.src(paths.images.src)
    .pipe(newer(paths.images.dest))
		.pipe(imagemin({
      progressive: true
    }))
    .pipe(size({
      showFiles: true
    }))
		.pipe(gulp.dest(paths.images.dest))
}

const watch = () => {
  browsersync.init({
    server: {
        baseDir: "./dist/"
    }
  });
  gulp.watch(paths.pug.dest).on('change', browsersync.reload)
  // gulp.watch(paths.html.dest).on('change', browsersync.reload)
  gulp.watch(paths.pug.src, pug)
  // gulp.watch(paths.html.src, html)
  gulp.watch(paths.styles.src, scss)
  gulp.watch(paths.scripts.src, scripts)
  gulp.watch(paths.images.src, img)
}

const build = gulp.series(clean, pug, gulp.parallel(scripts, scss, img), watch)
// const build = gulp.series(clean, html, gulp.parallel(scripts, scss, img), watch)

// exports.html = html
exports.pug = pug
exports.img = img
exports.clean = clean
exports.scss = scss
exports.watch = watch
exports.scripts = scripts
exports.default = build