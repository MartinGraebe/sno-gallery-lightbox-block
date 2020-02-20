const { src, dest, task, watch, parallel } = require('gulp');






// css plugins
var sass    = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');


// js plugins

var uglify  = require('gulp-uglify');
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var stripDebug = require('gulp-strip-debug');

// utility

var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var options = require('gulp-options');
var gulpif = require('gulp-if');






// Variables

var styleAdminSRC     = './src/scss/admin/admin.scss';
var styleAdminURL     = './admin/css/';
var mapAdminURL       = './';

var stylePublicSRC     = './src/scss/public/public.scss';
var stylePublicURL     = './public/css/';
var mapPublicURL       = './';



var jsPublicSRC        = './src/js/public/';
var jsPublicFront      = 'public.js';
var jsPublicFiles      = [ jsPublicFront ];
var jsPublicURL        = './public/js/';

var jsAdminSRC        = './src/js/admin/';
var jsAdminFront      = 'blocks.js';
var jsAdminFiles      = [ jsAdminFront ];
var jsAdminURL        = './admin/js/';

var styleAdminWatch = './src/scss/admin/**/*.scss';
var stylePublicWatch = './src/scss/public/**/*.scss';
var jsPublicWatch      = './src/js/public/**/*.js';
var jsAdminWatch      = './src/js/admin/**/*.js';


// tasks

function adminCss(done) {
	src( [ styleAdminSRC ] )
		.pipe( sourcemaps.init() )
		.pipe( sass({
			errLogToConsole: true,
			outputStyle: 'compressed'
		}) )
		.on( 'error', console.error.bind( console ) )
		.pipe( autoprefixer() )
		
		.pipe( sourcemaps.write( mapAdminURL ) )
		.pipe( dest( styleAdminURL ) )
	 ;
	done();
};
function publicCss(done) {
	src( [ stylePublicSRC ] )
		.pipe( sourcemaps.init() )
		.pipe( sass({
			errLogToConsole: true,
			outputStyle: 'compressed'
		}) )
		.on( 'error', console.error.bind( console ) )
		.pipe( autoprefixer() )
		
		.pipe( sourcemaps.write( mapPublicURL ) )
		.pipe( dest( stylePublicURL ) )
	 ;
	done();
};

function publicJs(done) {
	jsPublicFiles.map( function( entry ) {
		return browserify({
			entries: [jsPublicSRC + entry]
		})
		.transform( babelify, { presets: [ '@babel/preset-env' ] }, { plugins: ["@babel/transform-runtime"]} )
		.bundle()
		.pipe( source( entry ) )
		.pipe( rename( {
			extname: '.min.js'
        } ) )
		.pipe( buffer() )
		.pipe( gulpif( options.has( 'production' ), stripDebug() ) )
		.pipe( sourcemaps.init({ loadMaps: true }) )
		.pipe( uglify() )
		.pipe( sourcemaps.write( '.' ) )
		.pipe( dest( jsPublicURL ) )
		;
	});
	done();
};
function adminJs(done) {
	jsAdminFiles.map( function( entry ) {
		return browserify({
			entries: [jsAdminSRC + entry]
		})
		.transform( babelify, { presets: [ '@babel/preset-react', "@babel/preset-env"] }, { plugins: ["@babel/transform-runtime"]} )
		.bundle()
		.pipe( source( entry ) )
		.pipe( rename( {
			extname: '.min.js'
        } ) )
		.pipe( buffer() )
		.pipe( gulpif( options.has( 'production' ), stripDebug() ) )
		.pipe( sourcemaps.init({ loadMaps: true }) )
		.pipe( uglify() )
		.pipe( sourcemaps.write( '.' ) )
		.pipe( dest( jsAdminURL ) )
		;
	});
	done();
};






function watch_files() {
	watch(styleAdminWatch, adminCss);
	watch(stylePublicWatch, publicCss);
	watch(jsAdminWatch, adminJs);
	watch(jsPublicWatch, publicJs);


	src(jsAdminURL + 'blocks.min.js')
	src(jsPublicURL + 'public.min.js')
		.pipe( notify({ message: 'Gulp is Watching, Happy Coding!' }) );
}

task("css", parallel(adminCss, publicCss));
task("js", parallel(adminJs, publicJs));


task("default", parallel(adminCss, publicCss, adminJs, publicJs));
task("watch", watch_files);