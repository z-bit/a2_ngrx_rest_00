/**************************************************************
gulpfile.js
***************************************************************/
var requireDir = require('require-dir');
// Require all tasks in tools/gulp/tasks, including sub folders
requireDir('./tools/gulp/tasks', { recurse: true });

/**************************************************************
 tools/gulp/config.js
 ***** **** *********/
var app = 'app';
var src = 'app/src';
var e2e = 'e2e';
var vendor = 'app/vendor';
var build = 'target';
var development = 'target/development';
var coverage = 'target/coverage';
var production = 'target/production';
var developmentAssets = 'target/development/assets';

module.exports = {
    browsersync: {
        development: {
            server: {
                baseDir: development
            },
            port: 3000,
            files: [
                development + '/**/*.js',
                developmentAssets + '/images/**'
            ]
        }
    },
    delete: {
        development: ['target/development/**/*', '!target/development/jspm/**'],
        production: production,
        coverage: coverage
    },
    copy: {
        development: {
            assets: app + '/assets/**/*.*',
            js: app + '/**/*.js',
            vendorFiles: ['node_modules/angular2/bundles/angular2-polyfills.min.js'],
            dest: development
        },
        production: {
            vendorFiles: ['node_modules/angular2/bundles/angular2-polyfills.min.js'],
            dest: production
        }
    },
    watch: {
        html: app + '/**/*.html',
        scripts: src + '/**/*.ts',
        sass: app + '/**/*.scss',
        assets: app + '/assets/**/*.*'
    },
    app: app,
    production: production,
    typescript: {
        development: {
            scripts: app + '/src/**/*.ts',
            dest: development + '/src',
            coverage: build + '/coverage/src'
        },
        production: {
            scripts: app + '/src/**/*.ts',
            dest: production + '/src'
        },
        e2e: {
            scripts: e2e + '/**/*.ts',
            dest: build + '/e2e'
        }
    },

    html: {
        development: {
            source: app + '/**/*.html',
            dest: development,
            coverage: build + '/coverage/js'
        },
        production: {
            source: app + '/**/*.html',
            dest: production
        }
    },

    sass: {
        development: {
            main: app + '/scss/app.scss',
            source: src + '/**/*.scss',
            dest: development + '/assets'
        },
        production: {
            main: app + '/scss/app.scss',
            source: src + '/**/*.scss',
            dest: production + '/assets'
        }
    },

    images: {
        production: {
            source: app + '/assets/**/*.*',
            dest: production + '/assets'
        }
    },

    scripts: {
        production: {
            source: production + '/src/boot.js' ,
            dest: production
        }
    }

};

/************************************************************
 tools/gulp/tasks/default.js
 ***** **** ***** **********/
var gulp = require('gulp');
gulp.task('default', ['watch']);

/************************************************************
 tools/gulp/tasks/development/browser-sync.js
 ***** **** ***** *********** ***************/
var gulp = require('gulp');
var browserSync = require('browser-sync');
var spa         = require("browser-sync-spa");
var config = require('../../config').browsersync.development;

/**
 * Run the build task and start a server with BrowserSync
 */
gulp.task('browsersync', function () {
    browserSync.use(spa({
        selector: "[ng-app]",
        history: {
            index: '/index.html'
        }
    }));
    browserSync(config);
});

/************************************************************
 tools/gulp/tasks/development/build.js
 ***** **** ***** *********** ********/
var gulp = require('gulp');
var runSequence = require('run-sequence');

/**
 * Run all tasks needed for a build in defined order
 */
gulp.task('build', function (callback) {
    runSequence('delete',
        'copy-dev',
        'html-dev',
        'typescript-dev',
        [
            'dev-templates',
            'sass'
        ],
        callback);
});

/************************************************************
 tools/gulp/tasks/development/copy.js
 ***** **** ***** *********** *******/
var gulp = require('gulp');
var replace = require('gulp-replace');
var conf = require('../../config').copy.development;

/**
 * Copy assets, html, jspm config & index.html from app directory to development directory
 */
gulp.task('copy-dev', function () {
    gulp
        .src([conf.assets])
        .pipe(gulp.dest(conf.dest + '/assets'));

    gulp
        .src(conf.vendorFiles)
        .pipe(gulp.dest(conf.dest + '/vendor'));

    return gulp
        .src([conf.js])
        .pipe(replace('"github:*": "target/development/jspm/github/*"', '"github:*": "jspm/github/*"'))
        .pipe(replace('"npm:*": "target/development/jspm/npm/*"', '"npm:*": "jspm/npm/*"'))
        .pipe(gulp.dest(conf.dest));
});

/************************************************************
 tools/gulp/tasks/development/delete.js
 ***** **** ***** *********** *********/
var gulp = require('gulp');
var del = require('del');
var config = require('../../config');
/**
 * Delete folders and files
 */
gulp.task('delete', function () {
    return del(config.delete.development);
});

/************************************************************
 tools/gulp/tasks/development/html.js
 ***** **** ***** *********** *******/
var gulp = require('gulp');
var flatten = require('gulp-flatten');
var config = require('../../config').html.development;
var removeCode = require('gulp-remove-code');
var inject = require('gulp-inject');
var browserSync = require('browser-sync');

gulp.task('html-dev', function () {
    return gulp.src(config.source)
        .pipe(removeCode({development: true}))
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.stream());
});

/************************************************************
 tools/gulp/tasks/development/karma.js
 ***** **** ***** *********** ********/
'use strict';

var path = require('path');
var gulp = require('gulp');
var Server = require('karma').Server;
var config = require('../../config').watch;
var del = require('del');
var runSequence = require('run-sequence');

/**
 * Run all tasks needed for a build in defined order
 */
gulp.task('test', function (callback) {
    runSequence(
        ['run-tests'],
        callback);
});

gulp.task('run-tests', [], function (done) {
    runTests(done);
});

function runTests(done) {
    new Server({
        configFile: path.join(__dirname, '/../../../../karma.conf.js')
    }, done).start();
}

/************************************************************
 tools/gulp/tasks/development/sass.js
 ***** **** ***** *********** *******/
'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var flatten = require('gulp-flatten');
var browserSync = require('browser-sync');
var globbing = require('gulp-css-globbing');
var config = require('../../config').sass.development;
gulp.task('sass', function () {
    gulp.src(config.main)
        .pipe(globbing({
            extensions: ['.scss']
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(flatten())
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.stream());
});

/************************************************************
 tools/gulp/tasks/development/template.js
 ***** **** ***** *********** ***********/
var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var insert = require('gulp-insert');
var browserSync = require('browser-sync');
var conf = require('../../config').html.development;

gulp.task('dev-templates', function () {
    return gulp.src(conf.source)
        .pipe(templateCache({root: '/src/', moduleSystem: 'Browserify', standalone: true}))
        //need to add an angular require to keep karma happy!
        .pipe(insert.prepend('var angular = require(\'angular\');'))
        .pipe(gulp.dest(conf.dest))
        .pipe(browserSync.stream());
});

/************************************************************
 tools/gulp/tasks/development/typescript.js
 ***** **** ***** *********** *************/
'use strict';

var gulp = require('gulp');
var conf = require('../../config').typescript.development;
var typescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var tslint = require('gulp-tslint');
var cache = require('gulp-cached');
var browserSync = require('browser-sync');
var tsProject = typescript.createProject('tsconfig.json');

gulp.task('typescript-dev', function () {
    return gulp.src(conf.scripts)
        .pipe(cache('typescript'))
        .pipe(sourcemaps.init())
        .pipe(tslint())
        .pipe(tslint.report('prose', {emitError: false}))
        .pipe(typescript(tsProject))
        //.pipe(sourcemaps.write('./maps', {includeContent: false, sourceRoot: '/app/src'}))
        .pipe(gulp.dest(conf.dest))
        .pipe(browserSync.stream());
});

/************************************************************
 tools/gulp/tasks/development/watch.js
 ***** **** ***** *********** ********/
var gulp = require('gulp');
var config = require('../../config').watch;

/**
 * Start browsersync task and then watch files for changes
 */
gulp.task('watch', ['build', 'browsersync'], function () {
    gulp.watch(config.sass, ['sass']);
    gulp.watch(config.scripts, ['typescript-dev']);
    gulp.watch(config.html, ['html-dev']);
    gulp.watch(config.assets, ['copy-dev']);
});

/************************************************************
 tools/gulp/tasks/e2e/e2e-tests.js
 ***** **** ***** *** ************/
'use strict';

var gulp = require('gulp');
var protractor = require('gulp-protractor');
var conf = require('../../config');
var browserSync = require('browser-sync');


// Downloads the selenium webdriver
gulp.task('webdriver-update', protractor.webdriver_update);

/************************************************************
 tools/gulp/tasks/e2e/typescript.js
 ***** **** ***** *** *************/
'use strict';

var gulp = require('gulp');
var conf = require('../../config').typescript.e2e;
var typescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var tslint = require('gulp-tslint');
var cache = require('gulp-cached');
var browserSync = require('browser-sync');
var tsProject = typescript.createProject('tsconfig.json');

gulp.task('typescript-e2e', function () {
    return gulp.src(conf.scripts)
        .pipe(cache('typescript'))
        .pipe(sourcemaps.init())
        .pipe(tslint())
        .pipe(tslint.report('prose', {emitError: false}))
        .pipe(typescript(tsProject))
        //.pipe(sourcemaps.write('./maps', {includeContent: false, sourceRoot: '/app/src'}))
        .pipe(gulp.dest(conf.dest))
        .pipe(browserSync.stream());
});

gulp.task('webdriver-standalone', protractor.webdriver_standalone);

function runProtractor(done) {
    var params = process.argv;
    var args = params.length > 3 ? [params[3], params[4]] : [];

    gulp.src(conf.app + '/e2e/**/*.spec.js')
        .pipe(protractor.protractor({
            configFile: 'protractor.conf.js',
            args: args
        }))
        .on('error', function (err) {
            // Make sure failed tests cause gulp to exit non-zero
            throw err;
        })
        .on('end', function () {
            // Close browser sync server
            browserSync.exit();
            done();
        });
}
gulp.task('e2e', ['typescript-e2e', 'webdriver-update'], runProtractor);

/************************************************************
 tools/gulp/tasks/production/config.js
 ***** **** ***** ********** *********/
var gulp = require('gulp');
var path = require('../../config').typescript.production.dest;
var configPath = path + '/common';
var rename = require('gulp-rename');
/**
 * Move production jspm-config into place
 */

gulp.task('production-jspm-config', function () {
    return gulp.src(configPath + '/jspm-config-production.js')
        .pipe(rename('config.js'))
        .pipe(gulp.dest(configPath));
});

/************************************************************
 tools/gulp/tasks/production/copy.js
 ***** **** ***** ********** *******/
var gulp = require('gulp');
var replace = require('gulp-replace');
var conf = require('../../config').copy.production;

/**
 * Copy vendor files to production directory
 */
gulp.task('copy-deploy', function () {
    gulp
        .src(conf.vendorFiles)
        .pipe(gulp.dest(conf.dest + '/vendor'));
});

/************************************************************
 tools/gulp/tasks/production/delete.js
 ***** **** ***** ********** *********/
var gulp = require('gulp');
var del = require('del');
var path = require('../../config').delete.production;
var deploySrc = path + '/src';
/**
 * Delete folders and files
 */
gulp.task('delete-deploy', function () {
    return del(path);
});

gulp.task('delete-deploy-src', function () {
    return del(deploySrc);
});

/************************************************************
 tools/gulp/tasks/production/deploy.js
 ***** **** ***** ********** *********/
var gulp = require('gulp');
var runSequence = require('run-sequence');

/**
 * Run all tasks needed for a build in defined order
 */
gulp.task('deploy', function (callback) {
    runSequence('delete-deploy',
        'typescript-deploy',
        'deploy-templates',
        'production-jspm-config',
        'test-deploy',
        'sass-deploy',
        'production-images',
        'copy-deploy',
        'scripts-bundle',
        'delete-deploy-src',
        'html-deploy',
        callback);
});

/************************************************************
 tools/gulp/tasks/production/html.js
 ***** **** ***** ********** *******/
var gulp = require('gulp');
var flatten = require('gulp-flatten');
var config = require('../../config').html.production;
var removeCode = require('gulp-remove-code');
var inject = require('gulp-inject');

gulp.task('html-deploy', function () {
    return gulp.src(config.source)
        .pipe(removeCode({production: true}))
        .pipe(gulp.dest(config.dest));

});

/************************************************************
 tools/gulp/tasks/production/images.js
 ***** **** ***** ********** *********/
var gulp = require('gulp');
var path = require('../../config').images.production;
/**
 * Move assets, eg. images into place
 */

gulp.task('production-images', function () {
    return gulp.src(path.source)
        .pipe(gulp.dest(path.dest));
});

/************************************************************
 tools/gulp/tasks/production/karma.js
 ***** **** ***** ********** ********/
'use strict';

var path = require('path');
var gulp = require('gulp');
var Server = require('karma').Server;

function runTests(done) {
    new Server({
        configFile: path.join(__dirname, '/../../../../karma.conf.js'),
        singleRun: true,
        autoWatch: false,
        jspm: {
            config: 'app/jspm-config/config.js',
            packages: "target/development/jspm/",
            loadFiles: [
                'target/production/src/**/*.spec.js'
            ],
            serveFiles: [
                'target/production/src/**/!(*spec).js'
            ]
        },
        reporters: ['dots', 'coverage'],
        preprocessors: {"target/production/src/**/!(*spec).js": "coverage"}
    }, function (code) {
        if (code == 1) {
            console.log('Unit Test failures, exiting process');
            done('Unit Test Failures');
        } else {
            console.log('Unit Tests passed');
            done();
        }
    }).start();
}

gulp.task('test-deploy', function (done) {
    runTests(done);
});

/************************************************************
 tools/gulp/tasks/production/sass.js
 ***** **** ***** ********** *******/
'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var flatten = require('gulp-flatten');
var config = require('../../config').sass.production;

var globbing = require('gulp-css-globbing');
gulp.task('sass-deploy', function () {
    gulp.src(config.main)
        .pipe(globbing({
            extensions: ['.scss']
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(flatten())
        .pipe(gulp.dest(config.dest));
});

/************************************************************
 tools/gulp/tasks/production/scripts.js
 ***** **** ***** ********** **********/
var gulp = require('gulp');
var shell = require('gulp-shell');
var config = require('../../config').scripts.production;
var jspm = require('jspm');
var source = require('vinyl-source-stream');
var vinylBuffer = require('vinyl-buffer');
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');
var uglify     = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('scripts-bundle', function () {
    var builder = new jspm.Builder();

    builder.config({
        paths: {
            "assets/material-icons.css": "target/production/assets/material-icons.css",
            "assets/app.css": "target/production/assets/app.css"
        },
        rootURL: "target/production/"
    });

    return new Promise(function(resolve, reject) {
        builder.buildStatic(config.source, { sourceMaps: true })
            .then(function (output) {
                var stream = source('app.js');

                stream.write(output.source);
                process.nextTick(function () {
                    stream.end();
                });

                return stream.pipe(vinylBuffer())
                    .pipe(sourcemaps.init())
                    .pipe(ngAnnotate())
                    .pipe(uglify())
                    .pipe(rename({ suffix: '.min' }))
                    .pipe(sourcemaps.write())
                    .pipe(gulp.dest(config.dest))
                    .on('end', resolve)
                    .on('error', reject);
            }, reject);
    });
});

/************************************************************
 tools/gulp/tasks/production/templates.js
 ***** **** ***** ********** ************/
var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var path = require('../../config');
var insert = require('gulp-insert');

gulp.task('deploy-templates', function () {
    return gulp.src(path.app + '/src/**/*.html')
        .pipe(templateCache({root: '/src/', moduleSystem: 'Browserify', standalone: true}))
        //need to add an angular require to keep karma happy!
        .pipe(insert.prepend('var angular = require(\'angular\');'))
        .pipe(gulp.dest(path.typescript.production.dest));
});

/************************************************************
 tools/gulp/tasks/production/typescript.js
 ***** **** ***** ********** *************/
'use strict';

var gulp = require('gulp');
var conf = require('../../config').typescript.production;
var typescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var tslint = require('gulp-tslint');
var tsProject = typescript.createProject('tsconfig.json');

gulp.task('typescript-deploy', function () {
    return gulp.src(conf.scripts)
        .pipe(sourcemaps.init())
        .pipe(tslint())
        .pipe(tslint.report('prose', {emitError: false}))
        .pipe(typescript(tsProject))
        .pipe(gulp.dest(conf.dest))
});