var gulp = require('gulp'),
    path = require('path'),
    minifyCSS = require('gulp-minify-css'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    ngmin = require('gulp-ngmin'),
    server = require('gulp-express'),
    preprocess = require('gulp-preprocess'),
    coffee  = require('gulp-coffee'),
    gulpif = require('gulp-if');


var paths = {
  scripts: ['vendor/angular.min.js',
            'vendor/angular-route.min.js',
            'vendor/lodash.js',
            'vendor/moment.min.js',
            // because bootstrap js requires jquery unfortunately
            'vendor/jquery.min.js',
            'vendor/bootstrap.min.js',
            'app.js',
            'factories/*',
            'services/*',
            '*'
            ].map(function(e){return "assets/js/" + e}),
  images: ['assets/img/*'],
  fonts: ['assets/fonts/*'],
  templates: ['assets/templates/**/*'],
  sass: ['assets/sass/**/*'],
  view: ['views/preprocessed/layout.ejs'],
  built: ['views/layout.ejs']
};

function swallowError (error) {
  console.log(error.toString());
  this.emit('end');
}

// The default task (call gulp, builds whole project)
gulp.task('clean', function() {
  return gulp.src(paths.built, {read: false})
    .pipe(clean({force: true}));
});

gulp.task('dev_process', ['clean'], function() {
  return gulp.src(paths.view)
    .pipe(preprocess({context: { NODE_ENV: 'development'}}))
    .pipe(gulp.dest('views'))
});

gulp.task('prod_process', ['clean'], function() {
  return gulp.src(paths.view)
    .pipe(preprocess({context: { NODE_ENV: 'production'}}))
    .pipe(gulp.dest('views'))
});

gulp.task('prod_scripts', ['clean'], function() {
  return gulp.src(paths.scripts)
    .pipe(gulpif(/[.]coffee$/, coffee()))
    .pipe(concat('main.min.js'))
    .pipe(ngmin())
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest('assets/_compiled'));
});

gulp.task('prod_sass', ['clean'], function () {
  return gulp.src(paths.sass)
    .pipe(sass())
    .pipe(concat('main.min.css'))
    .pipe(minifyCSS({keepBreaks:false}))
    .pipe(gulp.dest('assets/_compiled'));
});

gulp.task('dev_sass', function () {
  return gulp.src(paths.sass)
    .pipe(sass())
    .on('error', swallowError)
    .pipe(concat('main.min.css'))
    .pipe(minifyCSS({keepBreaks:false}))
    .pipe(gulp.dest('assets/_compiled'));
});

gulp.task('dev_scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(gulpif(/[.]coffee$/, coffee()))
    .on('error', swallowError)
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('assets/_compiled'));
});

gulp.task('dev_server', ['clean', 'dev_process', 'dev_scripts', 'dev_sass'], function () {
  server.run({
      file: 'server.js'
  });
  gulp.watch(paths.scripts, ['dev_scripts']);
  gulp.watch(paths.sass, ['dev_sass']);
});

gulp.task('prod_server', ['clean', 'prod_process', 'prod_scripts', 'prod_sass'], function () {
  server.run({
      file: 'server.js'
  });
});

gulp.task('dev', ['dev_server']);
gulp.task('prod', ['prod_server']);