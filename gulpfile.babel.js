// gulpfile.js파일에서는 gulp를 이용해서 파일들을 컴파일하고 변환하고 최적화한다.
// gulpfile.babel.js는 gulpfile.js파일에 +babel을 추가한 gulp file이다.

// gulp모듈을 사용하기 위해 import해온다.
import gulp from "gulp";

// gulp에는 많은 플러그인들이 있는데 gulp pug는 pug template를 html파일로 컴파일할 때 사용하는 모듈이다.
// (webpack으로 치면 loaders 플러그인이라고 보면 된다.)
import gulpPug from "gulp-pug";

// del은 파일을 삭제하거나 디렉토리를 삭제할 때 사용하는 모듈이다.
import del from "del";

// gulp-webserver는 로컬 서버를 생성할 때 사용하는 모듈이다.
import gulpWebserver from "gulp-webserver";

// gulp-image는 PNG, JPEG, GIF, SVG등 각종 이미지 파일들을 최적화 시킬 때 사용하는 모듈이다.
// 이미지 파일들의 크기를 줄여주고 압축해준다.
import gulpImage from "gulp-image";

// gulp를 이용해서 Sass(Scss)파일을 컴파일 시키려면 node-sass와 gulp-sass 2개의 모듈이 필요하다.
// node-sass, gulp-sass는 gulp용 sass플러그인이다.
import sass from "gulp-sass";

// gulp-autoprefixer는 기본적으로 우리가 작업한 코드를 구형 브라우저에서도 호환 가능하도록 변환해주는 모듈이다.
import autoprefixer from "gulp-autoprefixer";

// gulp-csso는 기본적으로 CSS파일을 최소화할 때 사용하는 모듈이다.
// 파일에서 코드 사이사이의 공백 하나하나는 모두 byte용량인데 이 공백을 다 없애줘서 byte용량을 줄이고 파일의 크기를 최소화 해준다.
import csso from "gulp-csso";

// Browserfiy는 최신 자바스크립트 문법을 브라우저가 이해할 수 있도록 도와주는 모듈이다.
// gulp-bro플러그인은 gulp용 Browerify 플러그인이다.
import bro from "gulp-bro";

// babelify는 babel에 여러가지 추가 설정을 할 수 있도록 도와주는 모듈이다.
// babelify를 이용하면 바벨의 여러 설정 값을 바꿀 수 있다.
import babelify from "babelify";

// gulp-gh-pages는 깃허브 페이지에 최종적으로 사이트를 배포할 때 사용하는 플러그인이다.
import ghPages from "gulp-gh-pages";

// sass.compiler = require("node-sass"): gulp-sass(sass)의 컴파일러를 node-sass로 지정해준다.
sass.compiler = require("node-sass");

// Task(작업)를 실행할 파일들의 디렉토리와 Task가 실행된 후 결과물을 지정할 디렉토리를 모아놓은 routes객체를 생성한다.
// 여기서 Task란 gulp가 파일들을 최적화 및 컴파일, 변환 해주는 과정들을 말한다.
// routes객체를 통해 실행할 파일들의 디렉토리와 결과물을 지정할 디렉토리들을 한 눈에 정리해서 볼 수 있다.
const routes = {
  // pug파일을 html파일로 컴파일 해주는 task
  pug: {
    // 컴파일할 파일들의 디렉토리와 컴파일한 후 저장할 디렉토리를 정리해서 지정해준다.
    // 만약 src폴더 밑에 있는 모든 pug 파일들을 컴파일하고 싶다면 src/**/*.pug라고 지정해주면 된다.
    // (현재는 src바로 밑에 있는 모든 pug 파일들만 해당된다.)
    watch: "src/**/*.pug",
    src: "src/*.pug",
    dest: "build", // dest에는 task를 실행한 후 최종 결과물을 저장할 디렉토리를 설정한다. (build폴더)
  },

  // 이미지 파일을 압축 및 최적화 시켜주는 task
  img: {
    src: "src/img/*", // src폴더 아래 모든 파일들을 의미함 (만약 png확장자만 가진 이미지를 지정하고 싶다면 *.png로 지정해준다.)
    dest: "build/img", // task를 실행한 후 최종 결과물을 저장할 디렉토리: build/img
  },

  // sass(scss) 파일을 css파일로 컴파일 해주는 task
  scss: {
    watch: "src/scss/**/*.scss", // style.scss파일 외에 모든 것을 지켜보고 싶기 때문에 src/scss/**/*.scss를 통해 scss폴더 아래 모든 .scss파일들을 지켜보도록 한다.
    src: "src/scss/style.scss",
    dest: "build/css", // 원래 컴파일된 결과물을 지정하는 dest는 build/css이런 식으로 디렉토리만 적지만 단 하나의 파일만을 다룰 때는 build/css/style.css 이렇게 상세하게 적을 수도 있다.
  },

  // 최신 자바스크립트 문법을 오래된 자바스크립트 문법으로 컴파일 해주는 task
  js: {
    watch: "src/js/**/*.js",
    src: "src/js/main.js",
    dest: "build/js",
  },
};

// task는 함수의 기능을 해야 한다.
// gulp는 다양한 API(함수)들을 가지고 있다. ex: src(), dest(), pipe(), task() 등등
// 참고: https://gulpjs.com/docs/en/api/concepts

// pug함수는 gulp에게 모든 pug파일을 html로 컴파일하는 task를 실행한다.
const pug = () => {
  // src()는 task(최적화 및 컴파일)를 실행할 파일들을 파일의 경로와 함께 지정해준다.
  // pipe()는 gulp.src()를 통해 지정된 각각의 파일들을 stream형태로 읽은 후 다음으로 실행되어야 할 함수로 연결해준다.
  // gulp.src(routes.pug.src)를 이용해서 gulp가 task를 실행할 파일들을 지정한다.(src폴더 아래 모든 pug파일(src/*.pug)로 지정했다.)
  // gulp는 pipe()메서드와 함께 쓰인다. pipe()메서드는 다음으로 실행되어야 할 함수를 연결해준다.
  // gulp는 src()를 통해 사용자가 변환하려고 지정한 파일들을 pipe(파이프)에 넣는다.
  // 그러면 pipe()가 파일들의 흐름을 만들어준다.
  // 예를들면 한 pipe는 파일을 컴파일을 하고, 한 pipe는 파일을 복사하고, 또 다른 pipe는 코드를 최적화하고 등등 여러 pipe들이 역할을 처리한다.
  // dest()는 task(최적화 및 컴파일)를 실행한 후 최종 결과물 파일이 저장될 경로를 설정한다.

  // 즉 전체적인 흐름은 src()를 통해 task를 실행할 파일들을 지정해주고 그 다음 pipe(gulpPug())를 통해 gulpPug()함수를 실행하는 파이프를 연결하고
  // 그리고 마지막으로 그 결과를 dest()를 통해 특정 디렉토리(폴더)에 저장한다.
  // 과정 정리: src폴더 아래에 있는 index.pug 파일을 찾아서 컴파일한 후 build라는 폴더를 만들고 거기에 컴파일한 파일을 넣어준다.
  // ()=>{}화살표 함수를 쓸 때 유의할 점은 ()=>{}로 쓰게 되면 반드시 return을 써줘야 하고 코드가 한 줄일 때는 ()=> 만 쓰면 알아서 return을 붙여서 실행해준다.
  return gulp.src(routes.pug.src).pipe(gulpPug()).pipe(gulp.dest(routes.pug.dest));
};

// clean함수는 실수로 잘못 build한 폴더나 파일들이 있을 때, 삭제하고 다시 re-build하기 위해 만들었다.
const clean = () => {
  // del()함수의 인자에는 삭제할 확장자 파일이나 폴더 이름을 적어주면 된다. (우리는 build폴더를 삭제할 것이기 때문에 build를 써준다.)
  // ()안에 ["build"] 형태로 배열을 사용하는 이유는 build폴더 하나만이 아니라 여러 개를 삭제할 수도 있기 때문이다.
  // ghDeploy함수를 실행해서 깃허브에 배포를 하는 과정에서 .public이라는 폴더가 자동으로 생성되고 그 안에 일종의 백업용 파일들이 저장되게 된다.
  // 하지만 우리는 .public파일이 필요하지 않기 때문에 clean함수 안에서 제거해준다.
  return del(["build", ".public"]);
};

// webserver함수는 로컬 서버를 생성하는 함수이다.
const webserver = () => {
  // src()함수의 인자로 build폴더를 지정한다.
  // 그렇게 되면 로컬 서버를 실행할 때 컴파일한 파일들이 저장되어 있는 build폴더 안에 파일들을 가지고 로컬 서버를 실행한다.
  // gulpWebserver()를 통해 웹 서버를 생성한다. ()괄호 안에는 웹 서버를 생성할 때 설정할 옵션을 지정해준다.
  // livereload는 파일을 저장하면 자동으로 서버를 새로고침 해주는 옵션이다. 기본값은 false인데 true를 넣어줬다.
  // open은 웹 서버가 생성 및 실행되면 우리가 보는 브라우저 창에 로컬 서버를 열어준다. 기본값은 false인데 true를 넣어줬다.
  return gulp.src("build").pipe(gulpWebserver({ livereload: true, open: true }));
};

// img함수는 이미지를 최적화 및 압축시키는 함수이다.
const img = () => {
  // src()를 통해 routes.img.src경로에 있는 이미지 파일들을 지정한 후 그 파일들을 gulpImage()를 통해 최적화 및 압축을 해준 후 결과 파일을 dest()를 통해 routes.img.dest경로에 저장한다.
  return gulp.src(routes.img.src).pipe(gulpImage()).pipe(gulp.dest(routes.img.dest));
};

// styles함수는 sass(scss)파일을 css로 컴파일 시키는 함수이다.
const styles = () => {
  // gulp-sass에서 가져온 sass()함수를 실행시킨다.
  // 그리고 만약 에러가 있다면 on('error', sass.logError)를 통해 error이벤트를 듣고 있다가 sass.logError를 통해 에러를 출력한다.
  // (sass에러는 콘솔을 죽이는 자바스크립트 같은 에러가 아니라, 정의되지 않거나 찾을 수 없는 css속성들이 있다는 것을 보여주는 정도의 정보이다.)
  // autoprefixer()를 통해 scss파일을 css로 변환할 때 구형 브라우저에서도 호환 가능하도록 변환해준다.
  // csso()를 코드 사이사이의 공백들을 제거해줘서 byte용량을 줄이고 파일의 크기를 최소화 해준다.
  return gulp.src(routes.scss.src).pipe(sass().on("error", sass.logError)).pipe(autoprefixer()).pipe(csso()).pipe(gulp.dest(routes.scss.dest));
};

// js함수는 js파일을 컴파일 시켜는 함수이다.
const js = () => {
  // bro()의 인자에 다양한 옵션을 지정해줄 수 있다.
  // transform 프로퍼티에 babelify.configure()를 통해 babelify의 presets를 현재 이 프로젝트에 맞는 @babel-preset-env로 바꿔준다.
  // babelify를 이용하면 바벨의 다양한 옵션을 설정할 수 있다. (babelify에 다른 presets들을 추가해줄 수도 있다.)
  // 그리고 uglifyify옵션을 통해 긴 코드를 짧게 압축시켜줄 수 있다. (uglifyify는 npm install uglifyify로 설치 필요)
  return gulp
    .src(routes.js.src)
    .pipe(bro({ transform: [babelify.configure({ presets: ["@babel/preset-env"] }), ["uglifyify", { global: true }]] }))
    .pipe(gulp.dest(routes.js.dest));
};

// ghDeploy함수는 깃허브 페이지에 빌드한 파일들을 배포할 때 사용하는 함수이다.
// 이 프로젝트는 npm으로 패키지들을 설치하면 배포 과정에서 문제가 발생하는 거 같다. (yarn으로 install하고 진행하기!)
// 주의! 만약 Deploy과정에서 "Cannot read property '0' of null" 오류가 난다면 node_modules폴더와 package-lock.json파일을 모두 다 지우고 재설치하고
// node_modules/gulp-gh-pages/node_modules 안에 있는 gift폴더를 지우고 배포를 실행해보기. 아니면 지우고 yarn install gift로 gift를 재설치해보고 실행해보기
const ghDeploy = () => {
  // 최종적으로 빌드한 파일들을 배포할 것이기 때문에 src()함수를 통해 src디렉토리가 아닌 build폴더 아래 있는 모든 파일들을 지정해준다.
  // ghPages()함수를 통해 build폴더 아래에 모든 디렉토리와 파일들을 깃허브로 배포한다.
  return gulp.src("build/**/*").pipe(ghPages());
};

// watch함수는 지켜봐야 하는 파일들을 지정하는 함수이다.
const watch = () => {
  // watch()메서드는 지켜봐야 하는 파일들을 지정할 수 있다. 지켜봐야 할 파일들과 옵션을 인자로 넣어주면 된다.
  // 우리는 어떤 pug파일에 무언가 변화(코드 수정)가 생겼을 때 컴파일을 시켜줘야 하기 때문에 하나의 파일만 watch하면 안되고 모든 파일을 다 watch해야 한다.
  // 그래서 위에 routes객체안에 watch의 값으로 "src/**/*.pug" 을 넣어줘서 src폴더 밑에 있는 모든 pug파일들을 다 watch하게 만든다.
  // 만약 "src/*.pug"라고 하게 되면 src폴더 아래에 있는 partials나 templates폴더 안에 있는 pug파일의 변화는 watch하지 못하기 때문이다.
  // gulp.watch(routes.pug.watch, pug): routes.pug.watch경로에 파일들을 지켜보고 있다가 변화가 생겼을 때 pug함수를 실행시킨다.
  // pug함수는 위에서 만든 pug파일을 html파일로 컴파일 시켜주는 함수이다.
  gulp.watch(routes.pug.watch, pug);

  // gulp에게 src/img아래 있는 모든 파일들을 지켜보도록 하고 파일의 변화가 생기면 img함수를 통해 이미지 최적화를 실행한다.
  gulp.watch(routes.img.src, img);

  // gulp에게 src/scss아래 있는 .scss파일에 변화가 생기면 styles함수를 실행하게 한다.
  gulp.watch(routes.scss.watch, styles);

  // gulp에게 routes.js.watch아래 있는 .js파일을 지켜보도록 한다.
  gulp.watch(routes.js.watch, js);
};

// series()함수와 parallel()함수를 통해 위에서 만든 함수(task)들을 묶어서 변수에 담은 후, 부분적으로 실행할 수 있다.
// 예륻들어 clean과 img만 실행되게 하고 싶다면 두 개를 묶어서 prepare변수에 넣어준 후 prepare만 실행하면 된다.
// 아래 gulp.series([pug, styles, js])를 보면 전혀 다른 일을 하는 함수(task)들이 같이 묶여서 실행되고 있다.
// 그래서 이 여러 task들을 구분해서 관리하기 위해 아래와 같이 따로 따로 변수에 할당해주었다.
// const prepare = gulp.parallel([clean, img]), const assets = gulp.series([pug, styles, js]), const postDev = gulp.series([webserver, watch]);
// 위와 마찬가지로 여기서도 ()괄호안에 [clean] 형태로 배열을 사용하는 이유는 clean태스크 뿐만 아니라 다른 여러 태스크들도 실행할 수도 있기 때문이다.
// parallel함수는 series와 다르게 [clean, img] clean과 img함수를 순차적으로 실행하는 것이 아닌 동시에 실행한다.
const prepare = gulp.parallel([clean, img]);

// gulp.series([pug, styles])를 통해 pug와 styles, js 함수(태스크)를 실행시켜준다.
const assets = gulp.series([pug, styles, js]);

// gulp.series([webserver])를 통해 웹 서버를 생성하는 함수(태스크)를 실행한다.
// gulp.series()안에 watch를 넣었을 때 제대로 동작하지 않으면 parallel()메소드로 바꿔서 해보기
// 만약 여러 task들을 동시에 실행되길 원한다면 series()대신 parallel()메소드를 사용하면 된다.
const postDev = gulp.series([webserver, watch]);

// npm run dev를 통해 gulp를 실행(gulp dev)을 해주면 gulp가 실행된다.
// 위에 만든 함수들은 package.json내에서 command(명령어)로 사용되지 않기 때문에 export가 필요없지만 아래 build, dev, deploy는 package.json에 script부분에서 command(명령어)로 쓰고 있기 때문에 export 해줘야 한다. ex) dev: "gulp dev"
// 만약 export해주지 않으면 console이나 package.json에서 사용할 수 없다.
// gulp는 task와 함께 동작하기 때문에 우리는 task가 필요하다.
// 여기서 task의 의미는 gulp가 컴파일이나 변환이 필요한 각종 파일들을 컴파일 및 변환한 후 파일을 최적화 및 최소화시켜서 필요한 폴더에 넣어주거나 하는 동작 및 과정들을 말한다.
// 이런 task들은 그룹으로 묶을 수 있어서, 어떤 task는 이미지를 최적화하고 어떤 task는 js파일을 변환하고, 어떤 task는 모든 파일들을 한 폴더에 집어넣고,
// 어떤 task는 그 폴더를 브라우저에 띄우는 등 여러가지 task들을 실행 방법에 따라 나눠서 실행시킬 수 있다.
// series함수는 Task들을 순차적으로 실행한다. 예를들면 gulp.series([pug1, pug2, pug3])이라고 하면 pug1, pug2, pug3의 task들을 순차적으로 실행시킨다.
// export const dev = gulp.series([prepare, assets, postDev]);

// series()함수를 통해 prepare와 assets함수를 차례대로 실행하고 그 과정을 build 변수에 할당시켜줬다.
// export const build = gulp.series([prepare, assets]);

// 위에서 만든 build함수와 ghDeploy함수를 실행해서 최종적으로 깃허브에 배포를 한다.
// 마지막에 clean함수를 통해서 배포가 끝난 후에는 .public폴더와 build폴더를 삭제해준다.
// export const deploy = gulp.series([build, ghDeploy, clean]);

// 위의 코드를 아래와 같이 쓸 수도 있다.
// prepare와 assets 태스크를 실행시키는 것을 build변수에 담고 dev에서 build를 실행시켜주면 prepare, assetss을 실행시키는 것과 같다.
export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, postDev]);
export const deploy = gulp.series([build, ghDeploy, clean]);
