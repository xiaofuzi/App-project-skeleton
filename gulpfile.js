var gulp = require("gulp"),
 	gutil = require("gulp-util"),
 	webpack = require("webpack"),
 	WebpackDevServer = require("webpack-dev-server"),
 	path = require('path'),
 	browserSync = require('browser-sync'),
 	jshint = require('gulp-jshint'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    clean = require('gulp-clean'),
    minifycss = require('gulp-minify-css');

var reload = browserSync.reload;
webpackConfig = {
    cache: true,
    entry: "./entry.js",
    output: {
        path: path.join(__dirname, "dist/js"),
        publicPath: "dist/",
        filename: "bundle.js"
    },
    plugins: [
        new webpack.ProvidePlugin({
            // Automtically detect jQuery and $ as free var in modules
            // and inject the jquery library
            // This is required by many jquery plugins
            jQuery: "jquery",
            $: "jquery"
        })
    ]
};

// 样式
gulp.task('styles', function() {  
  return gulp.src('src/less/*.less')
    .pipe(less({ style: 'expanded', }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css'));
});

//脚本
gulp.task('scripts', function() {  
  return gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task("webpack:build", ['clean','scripts'],function(callback) {
	// modify some webpack config options
	var myConfig = Object.create(webpackConfig);
	myConfig.plugins = myConfig.plugins.concat(
		new webpack.DefinePlugin({
			"process.env": {
				// This has effect on the react lib size
				"NODE_ENV": JSON.stringify("production")
			}
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin()
	);

	// run webpack
	webpack(myConfig, function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build", err);
		gutil.log("[webpack:build]", stats.toString({
			colors: true
		}));
		callback();
	});
});

// 清理
gulp.task('clean', function() {  
  return gulp.src(['dist'], {read: false})
    .pipe(clean());
});

var src = './src';
gulp.task('watch', ["webpack:build"],function(){
	browserSync({
		
	  server:{ 
	    baseDir: __dirname
	  }
	});

	gulp.watch('src/js/*.js', ['webpack:build']);
	gulp.watch('*.js', ['webpack:build']);

	gulp.watch('dist/js/*.js',reload);
	gulp.watch('dist/css/*.js',reload);
})