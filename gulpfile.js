var gulp = require('gulp');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var cp = require('child_process');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync');

//var server = require('gulp-server-livereload');


var jekyllCommand = (/^win/.test(process.platform)) ? 'jekyll.bat' : 'jekyll';

/*
 * Build the Jekyll Site
 * runs a child process in node that runs the jekyll commands
 */
/*
gulp.task('jekyll-build', function (done) {
	return cp.spawn(jekyllCommand, ['build'], {stdio: 'inherit'})
		.on('close', done);
});
*/

gulp.task('jekyll-build', () => {
	return cp.exec('bundle exec jekyll build');
});


/*
 * Rebuild Jekyll & reload browserSync
 
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
	browserSync.reload();
});
*/
gulp.task('jekyll-rebuild', gulp.series('jekyll-build', function (done) {
	browserSync.reload();
	done();
}));

/*
 * Build the jekyll site and launch browser-sync
 
gulp.task('browser-sync', ['jekyll-build'], function() {
	browserSync({
		server: {
			baseDir: '_site'
		}
	});
});
*/


gulp.task('browser-sync', gulp.series('jekyll-build', function() {
	browserSync({
		server: {
			baseDir: '_site'
		}
	});
}));

/*
* Compile and minify sass
*/
gulp.task('sass', function() {
  return gulp.src(['src/scss/**/*.scss'])
  	.pipe(plumber())
    .pipe(sass())
    //.pipe(csso())
    .pipe(gulp.dest('assets/css/'))
	.pipe(browserSync.stream({match: '**/*.css'}));
});


/*
 * Minify images
 */
gulp.task('imagemin', function() {
	return gulp.src('src/docs/img/**/*.{jpg,png,gif}')
		.pipe(plumber())
		.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
		.pipe(gulp.dest('assets/docs/img/'));
});
/*
 * Pipe audio
 */
gulp.task('audio', function() {
	return gulp.src('src/docs/audio/**/*.{wav,mp3,aac}')
		.pipe(plumber())
		.pipe(gulp.dest('assets/docs/audio/'));
});

/*
 * Pipe texts
 */
gulp.task('texts', function() {
	return gulp.src('src/docs/texts/**/*.{txt,html,rtf}')
		.pipe(plumber())
		.pipe(gulp.dest('assets/docs/texts/'));
});

/*
 * Pipe fonts
 */
gulp.task('fonts', function() {
	return gulp.src('src/fonts/**/*.{woff,woff2,ttf}')
		.pipe(plumber())
		.pipe(gulp.dest('assets/fonts/'));
});



/**
 * Compile and minify js
 */
gulp.task('js', function(){
	return gulp.src('src/js/**/*.js')
		//.pipe(plumber())
		.pipe(concat('main.js'))
		//.pipe(uglify())
		.pipe(gulp.dest('assets/js/'))
});

//gulp.task('watch', function() {
//  gulp.watch('src/scss/**/*.scss', ['sass']);
//  gulp.watch('src/js/**/*.js', ['js']);
//  gulp.watch('src/img/**/*.{jpg,png,gif}', ['imagemin']);
//  gulp.watch(['*html','_includes/*html', '_layouts/*.html', 'posts/*html' ], ['jekyll-rebuild']);
//});

gulp.task('watch', function() {
	gulp.watch(['src/scss/*.scss', 'src/scss/**/*.scss'], gulp.series('sass', 'jekyll-rebuild'));
	gulp.watch('src/js/**/*.js', gulp.series('js', 'jekyll-rebuild'));
	//gulp.watch('src/img/**/*.{jpg,png,gif}', gulp.series('imagemin', 'jekyll-rebuild'));
	//gulp.watch(['_layouts/*.html','_pages/*.html','_posts/*.html', '_includes/**/*.html'], gulp.series('jekyll-rebuild'));
  });

//gulp.task('default', ['js', 'sass', 'browser-sync', 'watch']);
//gulp.task('default', gulp.series('js', 'fonts', 'sass', 'imagemin', 'audio', 'texts','browser-sync', 'watch'));

gulp.task('default', gulp.series('js', 'fonts', 'imagemin', 'sass', 'audio', 'texts', gulp.parallel('browser-sync', 'watch')));
gulp.task('serve', gulp.parallel('browser-sync', 'watch')); 