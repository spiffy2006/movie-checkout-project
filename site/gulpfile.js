var gulp = require('gulp'),
  uglify = require('gulp-uglify'), // Minfies JS
  plumber = require('gulp-plumber'), // Prevents Gulp from stopping when we make an error
  concat = require('gulp-concat'), // Concatenates .js files into 1 file
  sass = require('gulp-sass'); // Sass...duh

// Styles Task
gulp.task('styles', function() {
  gulp.src('scss/**/*.scss')
  .pipe(plumber())
  .pipe(sass({
    style: 'compressed'
  }))
  .pipe(gulp.dest('css/'));
});

// Scripts Task
gulp.task('scripts', function() {
  gulp.src(['js/services/*.js', 'js/theme.js'])
  .pipe(plumber())
  .pipe(concat('theme.js'))
  .pipe(gulp.dest('build/js'));
});

// Scripts Minified Task
gulp.task('scripts-min', function() {
  gulp.src('js/*.js')
  .pipe(plumber())
  .pipe(uglify())
  .pipe(concat('theme.js'))
  .pipe(gulp.dest('build/js'));
});

// Watch Task
gulp.task('watch', function() {
  gulp.watch('scss/**/*.scss', ['styles']);
  gulp.watch('js/**/*.js', ['scripts']);
});

gulp.task('default', ['styles', 'scripts', 'watch']);