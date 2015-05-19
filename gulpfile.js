var gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    editJson   = require('gulp-json-editor'),
    typescript = require('gulp-typescript'),
    sass       = require('gulp-sass'),
    jade       = require('gulp-jade'),
    zip        = require('gulp-zip'),
    exec       = require('child_process').exec,
    Promise    = require('es6-promise').Promise;

gulp.task('default', ['build', 'watch']);

var tsProject = typescript.createProject({
    module: 'commonjs',
    sortOutput: true,
    typescript: require('typescript'),
});
gulp.task('typescript', function() {
    return gulp.src('src/**/*.ts', { base: 'src' })
        .pipe(typescript(tsProject))
        .js.pipe(gulp.dest('app/'));
});

gulp.task('sass', function() {
    return gulp.src('src/**/*.scss', { base: 'src' })
        .pipe(sass({ errLogToConsole: true }))
        .pipe(gulp.dest('app/'));
});

gulp.task('jade', function() {
    return gulp.src('src/**/*.jade', { base: 'src' })
        .pipe(jade({ pretty: true }))
        .pipe(gulp.dest('app/'));
});

gulp.task('manifest', function() {
    return version().then(function(version) {
        return gulp.src('src/manifest.json', { base: 'src' })
            .pipe(editJson({ version : version }))
            .pipe(gulp.dest('app/'));
    });
});
function version() {
    var promise = new Promise(function(resolve, reject) {
        exec('git describe --tags --always --dirty', function(err, stdout, stderr) {
            return err ? reject(err) : resolve(stdout);
        });
    });
    return promise.then(function(desc) {
        if (!/\d.\d.\d/.test(desc)) {
            gutil.log(gutil.colors.yellow('add git tag 1-3 dot-separated intergers (e.g. 0.0.1) for auto-versioning'));
            desc = '0.0.0.0';
        }
        var version = desc.replace(/\n$/, '')
            .replace(/-(\d+)/, '.$1')
            .replace(/-g[0-9a-f]+/, '')
            .replace(/-dirty/, '');
        return version;
    });
}

gulp.task('build', ['manifest', 'sass', 'jade', 'typescript']);

gulp.task('release', ['build'], function() {
    return version().then(function(version) {
        return gulp.src('app/**/*')
            .pipe(zip('tabliver-' + version + '.zip'))
            .pipe(gulp.dest('releases'));
    });
});

gulp.task('watch', function() {
    gulp.watch('src/manifest.json', ['manifest']);
    gulp.watch('src/**/*.ts', ['typescript']);
    gulp.watch('src/**/*.scss', ['sass']);
    gulp.watch('src/**/*.jade', ['jade']);
});
