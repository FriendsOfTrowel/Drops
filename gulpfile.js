let gulp = require('gulp');
let $ = require('gulp-load-plugins')();
let runSequence = require('run-sequence');
let browserSync = require('browser-sync');
let reload = browserSync.reload;

// Template
// ========

gulp.task('template_test', () => {
    return gulp.src('test/src/index.html')
        .pipe($.prettify({ indent_size: 2 }))
        .pipe(gulp.dest('test/dest'));
});

var report_error = function(error) {
  $.notify({
    title: 'An error occured with a Gulp task',
    message: 'Check you terminal for more informations'
  }).write(error);

  console.log(error.toString());
  this.emit('end');
};


// Style
// =====

let scssCompilation = (src, dest) => {
    return gulp.src(src)
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            precision: 6,
            indentWidth: 4,
        }))
        .on('error', report_error)
        .pipe($.autoprefixer({
            browsers: [
                'ie >= 10',
                'ie_mob >= 10',
                'ff >= 30',
                'chrome >= 34',
                'safari >= 7',
                'opera >= 23',
                'ios >= 7',
                'android >= 4.4',
                'bb >= 10'
            ]
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(dest));
}

gulp.task('style_test', () => scssCompilation('./test/src/style.scss', './test/dest'));
gulp.task('style_dest', () => scssCompilation('./test/src/trowel-drops.scss', './dest/css'));
gulp.task('style', ['style_test', 'style_dest']);


// Javascript
// ==========

let jsTranspilation = (src, dest) => {
    return gulp.src(src)
        .pipe($.sourcemaps.init())
        .pipe($.babel({
            presets: ['es2015']
        }))
        .on('error', report_error)
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(dest));
}

gulp.task('script_test', () => jsTranspilation('./src/javascript/**/*', './test/dest/javascript'));
gulp.task('script_dest', () => jsTranspilation('./src/javascript/**/*', './dest/javascript'));
gulp.task('script', ['script_test', 'script_dest']);

gulp.task('bower', () => gulp.src('./test/src/bower_components/**/*').pipe(gulp.dest('./test/dest/bower_components')));


gulp.task('default', ['bower', 'style', 'template_test', 'script']);
gulp.task('watch', ['default'], () => {
  browserSync({
    notify: false,
    logPrefix: 'Trowel Drops',
    server: ['test/dest']
  });

  gulp.watch('./**/*.scss', ['style', reload]);
  gulp.watch(['test/src/**/*.html'], ['template_test', reload]);
  gulp.watch('./src/javascript/**/*', ['script', reload]);
  gulp.watch('./test/src/bower_components/**/*', ['bower', reload]);
});
