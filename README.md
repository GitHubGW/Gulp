# Gulp-Class

## 🔗 Demo

## 🔥 Stack
### Front-end
<img height="30" src="https://img.shields.io/badge/Gulp-CF4647?style=for-the-badge&logo=Gulp&logoColor=white"/> <img height="30" src="https://img.shields.io/badge/Pug-A86454?style=for-the-badge&logo=Pug&logoColor=white"/>
<img height="30" src="https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=Sass&logoColor=white"/>

## ✅ Packages
- [x] Gulp
- [x] Pug
- [x] Autoprefixer
- [x] Browserify
- [x] SCSS

## ✨ Automating
- [x] Pug
- [x] SCSS
- [x] Image Optimization
- [ ] Live Reload
- [ ] Github Pages
- [ ] Babel


## What is gulp?
* Automation - gulp is a toolkit that helps you automate painful or time-consuming tasks in your development workflow.
* Platform-agnostic - Integrations are built into all major IDEs and people are using gulp with PHP, .NET, Node.js, Java, and other platforms.
* Strong Ecosystem - Use npm modules to do anything you want + over 3000 curated plugins for streaming file transformations.
* Simple - By providing only a minimal API surface, gulp is easy to learn and simple to use.

## Use Latest JavaScript Version in your gulpfile
Most new versions of node support most features that Babel provides, except the import/export syntax. When only that syntax is desired, rename to gulpfile.esm.js, install the esm module, and skip the Babel portion below.

Node already supports a lot of ES2015+ features, but to avoid compatibility problems we suggest to install Babel and rename your ```gulpfile.js``` to ```gulpfile.babel.js```.

```javascript
npm install --save-dev @babel/register @babel/core @babel/preset-env
```

Then create a .babelrc file with the preset configuration.

```javascript
{
  "presets": [ "@babel/preset-env" ]
}
```

And here's the same sample from above written in ES2015+.

```javascript

import gulp from 'gulp';
import less from 'gulp-less';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import del from 'del';

const paths = {
  styles: {
    src: 'src/styles/**/*.less',
    dest: 'assets/styles/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'assets/scripts/'
  }
};

/*
 * For small tasks you can export arrow functions
 */
export const clean = () => del([ 'assets' ]);

/*
 * You can also declare named functions and export them as tasks
 */
export function styles() {
  return gulp.src(paths.styles.src)
    .pipe(less())
    .pipe(cleanCSS())
    // pass in options to the stream
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest));
}

export function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

 /*
  * You could even use `export as` to rename exported tasks
  */
function watchFiles() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
}
export { watchFiles as watch };

const build = gulp.series(clean, gulp.parallel(styles, scripts));
/*
 * Export a default task
 */
export default build;

```
