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
  built: ['build/', 'views/layout.ejs']
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

gulp.task('process_dev', ['clean'], function() {
    return gulp.src(paths.view)
    .pipe(preprocess({context: { NODE_ENV: 'development'}}))
    .pipe(gulp.dest('views'))
});

gulp.task('process_prod', ['clean'], function() {
    return gulp.src(paths.view)
    .pipe(preprocess({context: { NODE_ENV: 'production'}}))
    .pipe(gulp.dest('views'))
});

gulp.task('scripts', ['clean'], function() {
    return gulp.src(paths.scripts)
      .pipe(gulpif(/[.]coffee$/, coffee()))
      .pipe(concat('main.min.js'))
      .pipe(ngmin())
      .pipe(uglify({mangle: false}))
      .pipe(gulp.dest('build/js'));
});

gulp.task('sass', ['clean'], function () {
    return gulp.src(paths.sass)
        .pipe(sass())
        .pipe(concat('main.min.css'))
        .pipe(minifyCSS({keepBreaks:false}))
        .pipe(gulp.dest('build/css'));
});

gulp.task('images', ['clean'], function() {
  return gulp.src(paths.images)
    .pipe(gulp.dest('build/img'));
});

gulp.task('fonts', ['clean'], function() {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest('build/fonts'));
});

gulp.task('templates', ['clean'], function() {
  return gulp.src(paths.templates)
    .pipe(gulp.dest('build/templates'));
});

gulp.task('dev', ['clean', 'process_dev', 'devscripts', 'sass', 'images', 'fonts', 'templates']);
gulp.task('prod', ['clean', 'process_prod', 'scripts', 'sass', 'images', 'fonts', 'templates']);

// The dev task (call gulp server, builds scss and js files quickly while generating localhost)
gulp.task('devsass', function () {
    return gulp.src(paths.sass)
        .pipe(sass())
        .on('error', swallowError)
        .pipe(concat('main.min.css'))
        .pipe(minifyCSS({keepBreaks:false}))
        .pipe(gulp.dest('build/css'));
});

gulp.task('devscripts', function() {
    return gulp.src(paths.scripts)
      .pipe(gulpif(/[.]coffee$/, coffee()))
      .on('error', swallowError)
      .pipe(concat('main.min.js'))
      .pipe(gulp.dest('build/js'));
});

gulp.task('server', function () {
    server.run({
        file: 'server.js'
    });
  gulp.watch(paths.scripts, ['devscripts']);
  gulp.watch(paths.sass, ['devsass']);
});
