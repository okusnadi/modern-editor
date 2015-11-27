import gulp from "gulp"
import jade from "gulp-jade"
import stylus from "gulp-stylus"
import rename from "gulp-rename"
import bom from "gulp-bom"
import webpackStream from "webpack-stream"
import webpack from "webpack"
import path from "path"

gulp.task("copy-winjs", () => {
  return gulp.src(["node_modules/winjs/**/*"])
    .pipe(gulp.dest("./winjs/"))
})

gulp.task("copy-ace", () => {
  return gulp.src(["node_modules/ace-builds/src-min-noconflict/**/*"])
    .pipe(gulp.dest("./ace/"))
})

gulp.task("jade", () => {
  return gulp.src("src/index.jade")
    .pipe(jade())
    .pipe(bom())
    .pipe(gulp.dest("www/"))
})

gulp.task("stylus", () => {
  return gulp.src(["src/styles/app-dark.styl", "src/styles/app-light.styl"])
    .pipe(stylus({
      compress: true
    }))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(bom())
    .pipe(gulp.dest("www/"))
})


gulp.task("webpack", () => {
  return gulp.src("src/app.js")
    .pipe(webpackStream({
      cache: true,
      output: {
        filename: "bundle.min.js"
      },
      module: {
        loaders: [
          { test: /\.js/, loader: "babel-loader", query: { stage: 0 }, exclude: /(node_modules|bower_components)/, }
        ]
      },
      resolve: {
        root: path.resolve("src")
      },
      plugins: [
       /*new webpack.optimize.UglifyJsPlugin({
          sourceMap: false,
          mangle: false
        })*/
      ]
    }))
    .pipe(bom())
    .pipe(gulp.dest("www/"))
})

gulp.task("add-bom", () => {
  return gulp.src("sql.jsx")
    .pipe(bom())
    .pipe(gulp.dest("sql.js"))
})

gulp.task("default", ["jade", "stylus", "webpack"])
