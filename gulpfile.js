'use strict';

var gulp = require('gulp');
var pug = require('gulp-pug');
var server = require('browser-sync');
var postcss = require('gulp-postcss');
var cssnext = require('postcss-cssnext');
var atImport = require('postcss-import');
var del = require('del');
var runSequence = require('run-sequence');
var normalize = require('postcss-normalize');
var cssnano = require('cssnano');

gulp.task('html', function buildHTML() {
  return gulp.src('src/*.pug')
    .pipe(pug({}))
    .pipe(gulp.dest('build'))
    .pipe(server.reload({stream: true}));
});

gulp.task('style', function() {
  return gulp.src('src/css/style.css')
    .pipe(postcss([
      atImport(),
      normalize(),
      cssnext()
    ]))
    .pipe(gulp.dest('build/css'))
    .pipe(server.reload({stream: true}));
});

gulp.task('style:min', function() {
  return gulp.src('src/css/style.css')
    .pipe(postcss([
      atImport(),
      normalize(),
      cssnext(),
      cssnano()
    ]))
    .pipe(gulp.dest('build/css'));
});

gulp.task('images', function() {
  return gulp.src('src/img/**/*')
    .pipe(gulp.dest('build/img'));
});

gulp.task('clean', function() {
  return del('build/**/*');
});

gulp.task('build', function() {
  runSequence('clean', ['html', 'style:min', 'images']);
});

gulp.task('serve', function() {
  runSequence('clean', ['html', 'style', 'images']);
  server.init({
    server: 'build',
    notify: false,
    open: false,
    ui: false
  });
  gulp.watch('src/*.pug', ['html']);
  gulp.watch('src/**/*.css', ['style']);
  gulp.watch('src/img/*', ['images']);
});
