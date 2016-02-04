'use strict';

var gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    fileInclude = require('gulp-file-include'),
    reload = browserSync.reload;



var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        images: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/main.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'src/style/main.scss',
        images: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        images: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
	server: {
		baseDir: 'build'
	},
	tunnel: true,
	host: 'localhost',
	port: 9000,
	logPrefix: 'gulp_tutorial'
};

var catch_error = {errorHandler: notify.onError("Error: <%= error.message %>")};

gulp.task('build:html',function(){
	return gulp.src(path.src.html)
			.pipe(plumber(catch_error))
			.pipe(fileInclude())
			.pipe(gulp.dest(path.build.html))

			.pipe(reload({stream: true}));
});

gulp.task('build:js',function(){
	gulp.src(path.src.js)
		.pipe(plumber(catch_error))
		.pipe(rigger())
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream: true}));
});

gulp.task('build:style',function(){
	gulp.src(path.src.style)
		.pipe(plumber(catch_error))
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(prefixer())
		.pipe(cssmin())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({stream:true}));
});

gulp.task('build:images',function(){
	gulp.src(path.src.images)
		.pipe(gulp.dest(path.build.images));
});

gulp.task('build:fonts',function(){
	gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts));
});

gulp.task('build',['build:html','build:js','build:style','build:images','build:fonts']);

gulp.task('watch',function(){
	gulp.watch(path.watch.html, ['build:html']);
	gulp.watch(path.watch.js, ['build:js']);
	gulp.watch(path.watch.style, ['build:style']);
	gulp.watch(path.watch.images, ['build:images']);
	gulp.watch(path.watch.fonts, ['build:fonts']);
});

gulp.task('webbrowser',function(){
	browserSync(config);
});

gulp.task('default',['build','webbrowser','watch']);