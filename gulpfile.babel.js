// gulpfile.js는 gulp를 컨트롤하는 정보들이 담겨져 있다.
// gulpfile.babel.js는 gulpfile.js파일인데 +babel을 추가한 gulpfile이다.

// gulp 패키지를 설치 후 gulp를 사용하기 위해 import해온다.
import gulp, { parallel } from "gulp";

// gulp에는 많은 플러그인들이 있는데 gulp pug는 pug template를 html로 컴파일 해주는 플러그인이다.
// (webpack으로 치면 loaders 플러그인이라고 보면 된다.)
import gulpPug from "gulp-pug";

// del은 파일을 삭제하거나 디렉토리를 삭제할 때 사용하는 모듈이다.
import del from "del";

// gulp-webserver모듈을 이용해서 로컬 서버를 생성한다.
import gulpWebserver from "gulp-webserver";

// PNG, JPEG, GIF, SVG등 각종 이미지 파일들을 최적화 시켜주는 gulp-image모듈을 가져옴
import gulpImage from "gulp-image";

// gulp를 통해 Sass(Scss)파일을 컴파일 시키려면 node-sass와 gulp-sass 패키지(모듈)가 필요하다.
// node-sass, gulp-sass (gulp용 sass플러그인)
// gulp-sass를 사용하기 위해 가져옴
import sass from "gulp-sass";

// gulp-autoprefixer는 기본적으로 우리가 작업한 코드를 구형 브라우저도 호환 가능하도록 해주는 패키지(모듈)이다.
import autoprefixer from "gulp-autoprefixer";

// gulp-csso는 기본적으로 CSS파일을 최소화 해준다.
// (공백 하나하나는 모두 byte용량인데 이 공백을 다 없애줘서 byte용량을 줄이고 파일을 최소화 해준다.)
import csso from "gulp-csso";

// Browserfiy는 최신 자바스크립트 문법을 브라우저가 이해하도록 도와주는 플러그인이다.
// gulp-bro플러그인은 gulp의 browerify 플러그인이다.
import bro from "gulp-bro";

// babelify플러그인을 이용하면 babel의 여러가지 설정 기능을 추가할 수 있다.
// babelify를 이용하면 바벨의 설정값을 설정할 수 있다.
import babelify from "babelify";

// gulp-gh-pages플러그인은 깃허브 페이지에 최종적으로 배포할 때 사용할 수 있는 플러그인이다.
import ghPages from "gulp-gh-pages";

// 가져온 gulp-sass를 compiler로 보낸다.
// 기본적으로 gulp-sass가 node-sass로 sass(scss)파일을 전해주는 것이다.
sass.compiler = require("node-sass");

// Task를 실행할 파일들의 디렉토리와 Task가 실행된 후 결과물을 지정할 디렉토리를 모아놓은 routes객체를 생성함
const routes = {
  // pug파일을 html파일로 컴파일 해주는 task
  pug: {
    // 아래에서 pug파일들을 컴파일 하기전에 미리 컴파일할 파일들의 경로를 지정해준다.
    // 만약 src폴더 밑에 있는 모든 pug 파일들을 컴파일하고 싶다면 src/**/*.pug라고 지정해주면 된다.
    // (현재는 src바로 밑에 있는 모든 pug 파일들만 해당됨)
    watch: "src/**/*.pug",
    src: "src/*.pug",
    dest: "build", // task를 실행한 후 최종 결과물을 저장할 디렉토리를 설정한다. (build폴더)
  },
  // 이미지 파일을 압축 및 최적화 시켜주는 task
  img: {
    src: "src/img/*", // src폴더 아래 모든 파일들을 의미함(만약 png확장자만 가진 이미지를 지정하고 싶다면 *.png로 쓰면 된다.)
    dest: "build/img", // task를 실행한 후 최종 결과물을 저장할 디렉토리: build/img
  },
  // sass(scss) 파일을 css파일로 컴파일 해주는 task
  scss: {
    watch: "src/scss/**/*.scss", // style.scss파일 외에 모든 것을 지켜보고 싶기 때문에 src/scss/**/*.scss를 통해 scss폴더 아래 모든 .scss파일들을 감시하게 한다.
    src: "src/scss/style.scss",
    dest: "build/css", // 원래 컴파일된 결과물을 지정하는 dest는 build/css이런 식으로 디렉토리만 적지만 단 하나의 파일만을 다룰 때는 build/css/style.css 이렇게 상세하게 적을 수도 있다.
  },
  js: {
    watch: "src/js/**/*.js",
    src: "src/js/main.js",
    dest: "build/js",
  },
};

// task는 함수의 기능을 해야 한다.
// gulp객체는 몇 가지 API들을 가진다. ex: src(), dest(), task() 등등
// 참고: https://gulpjs.com/docs/en/api/concepts

// pug함수는 gulp에게 모든 pug파일을 html로 컴파일하는 task를 실행하도록 한다.
const pug = () => {
  // src()메소드는 task를 실행할 파일들을 지정해준다.(파일들의 경로와 함께)
  // pipe()는 gulp.src()를 통해 지정된 각각의 파일들을 stream형태로 읽은 후 다음으로 실행되야 할 플러그인으로 연결해준다.
  // gulp.src(routes.pug.src)를 통해 gulp가 task를 실행할 파일들의 위치를 src/*.pug로 지정했다
  // gulp는 pipe()메소드와 함께 쓰인다. gulp는 사용자가 지정한 파일들을 pipe(파이프)에 넣는다.
  // 그러면 pipe()가 파일들의 흐름을 만들어준다.
  // 예를들면 한 pipe는 파일을 컴파일을 하고, 한 pipe는 파일을 복사하고, 또 다른 pipe는 코드를 최적화하고 등등 여러 pipe들이 역할을 처리한다.
  // dest()는 task를 실행한 후 최종 결과물이 저장될 경로를 설정한다.

  // 즉 전체적인 흐름은 src()를 통해 task를 실행할 파일을 지정해주고 그 다음 pipe(gulpPug())를 통해 gulpPug()함수를 실행하는 파이프를 연결하고 그리고 마지막으로 그 결과를 특정 폴더에 저장한다.
  // -> src폴더 아래에 있는 index.pug 파일을 찾아서 컴파일한 후 build라는 폴더를 만들고 거기에 컴파일한 파일을 넣어준다.
  // ()=>{}화살표 함수를 쓸 때 유의할 점은 ()=>{}로 쓰게 되면 반드시 return을 써줘야 하고 코드가 한 줄일 때는 ()=> 만 쓰면 알아서 return을 붙여서 실행해준다.
  return gulp.src(routes.pug.src).pipe(gulpPug()).pipe(gulp.dest(routes.pug.dest));
};

// clean함수는 실수로 잘못 build한 폴더나 파일들을 삭제하고 다시 re-build할 때 유용하다.
const clean = () => {
  // del()함수는 ()안에 삭제할 확장자 파일이나 폴더 이름을 적어주면 된다. (우리는 build폴더를 삭제할 것이기 때문에 build를 써준다.)
  // ()안에 ["build"] 형태로 배열을 사용하는 이유는 build폴더 하나만이 아니라 여러 개를 삭제할 수도 있기 때문이다.
  return del(["build"]);
};

// webserver함수는 로컬 서버를 생성한다.
const webserver = () => {
  // src()를 통해 빌드할 폴더를 지정한다. (컴파일한 파일들이 저장되는 build폴더를 지정하면 된다.)
  // gulpWebserver()를 통해 웹 서버를 생성한다. ()괄호안에는 웹 서버를 생성할 때 지정할 옵션을 넣어준다.
  // livereload는 파일을 저장하면 자동으로 새로고침 해주는 옵션이다. livereload의 기본값은 false인데 true를 넣어줌.
  // open은 웹 서버 생성시 브라우저 창에 로컬 서버를 열어준다. 기본값은 false이고 true를 넣어줌.
  return gulp.src("build").pipe(gulpWebserver({ livereload: true, open: true }));
};

// 이미지를 최적화 시키는 img함수를 만듦
const img = () => {
  // routes.img.src경로에 있는 이미지 파일들을 지정한 후 그 파일들을 gulpImage()를 통해 최적화를 해준 후 routes.img.dest 경로에 빌드한다.
  return gulp.src(routes.img.src).pipe(gulpImage()).pipe(gulp.dest(routes.img.dest));
};

// sass(scss)파일을 css로 컴파일 시켜주는 styles함수를 만듦
const styles = () => {
  // sass()를 통해 gulp-sass에서 가져온 sass()를 실행시킨다.
  // 그리고 만약 에러가 있다면 on('error', sass.logError)를 통해 에러를 출력시킨다. (sass에러는 콘솔을 죽이는 자바스크립트 같은 에러가 아니라 찾을 수 없는 속성들을 띄워주는 정도의 에러이다.)
  // csso()를 통해 gulp-csso를 실행시킴(csso()는 css파일을 최소화 시켜주는 역할을 하는 함수이다.)
  return gulp.src(routes.scss.src).pipe(sass().on("error", sass.logError)).pipe(autoprefixer()).pipe(csso()).pipe(gulp.dest(routes.scss.dest));
};

// js파일을 컴파일 시켜주는 js함수를 만듦
const js = () => {
  // bro()메소드를 통해 gulp-bro를 실행시킨다.
  // 그리고 그 안에 옵션을 줄 수 있는데 transform에 babelify를 옵션 값으로 주고 babelify의 presets를 현재 프로젝트에 맞는 @babel-preset-env로 바꿔준다.
  // 만약 다른 presets를 추가하고 싶다면 presets에 추가해줄 수 있다.
  // babelify를 이용하면 바벨의 옵션 값을 설정할 수 있다.
  // uglifyify 옵션은 긴 코드를 짧게 압축할 때 사용하는 플러그인이다.(npm i uglifyify로 설치 필요함)
  return gulp
    .src(routes.js.src)
    .pipe(
      bro({
        transform: [babelify.configure({ presets: ["@babel/preset-env"] }), ["uglifyify", { global: true }]],
      })
    )
    .pipe(gulp.dest(routes.js.dest));
};

// 깃허브 페이지에 지금까지 빌드한 파일들을 배포해주는 ghDeploy함수를 만듦
const ghDeploy = () => {
  // 지금까지 빌드한 파일들을 배포할 것이기 때문에 src가 아니라 build폴더 아래 있는 모든 파일들을 지정한다.
  // ghPages()함수를 실행해
  return gulp.src("build/**/*").pipe(ghPages());
};

// gulp.watch()는 지켜봐야 할 파일들을 지정하는 메소드이다.
// 지켜봐야 할 파일들이랑 몇 가지 옵션을 인자로 태스크에 넣어주면 된다.
const watch = () => {
  // 우리는 어떤 pug파일에 무언가 변화가 생겼을 때 컴파일을 시켜야 하기 때문에 하나의 파일만 watch하면 안되고 모든 파일을 다 watch해야 한다.
  // 그래서 위에 routes객체안에 watch의 값으로 "src/**/*.pug" 을 넣어줘서 src폴더 밑에 있는 모든 pug파일들을 다 watch하게 만든다.
  // 만약 "src/*.pug"라고 하게 되면 src폴더 아래에 있는 partials나 templates폴더 안에 있는 pug파일의 변화는 watch하지 못하게 될 것이기 때문이다.
  // gulp.watch(routes.pug.watch, pug): routes.pug.watch경로에 존재하는 파일들을 지켜보고 있다가 변화가 발생하면 pug함수를 실행시킴(컴파일 시키는 함수)
  gulp.watch(routes.pug.watch, pug);

  // gulp에게 watch()메소드를 통해 지정한 파일을 감시하도록 한다.
  // gulp에게 src/img아래 있는 모든 파일들을 감시하도록 하고 파일의 변화가 생기면 img함수를 실행해 이미지 최적화를 실행한다.
  gulp.watch(routes.img.src, img);

  // gulp에게 watch()메소드를 src/scss아래 있는 .scss파일에 변화가 생기면 styles함수를 실행하게 한다.
  gulp.watch(routes.scss.watch, styles);

  // gulp.watch()를 통해 routes.js폴더 밑에 모든 .js파일을 지켜봄
  gulp.watch(routes.js.watch, js);
};

// 아래 gulp.series([clean, pug])를 보면 전혀 다른 일을 하는 두 task가 같이 묶여서 실행되고 있다.
// 그래서 이 여러 task들을 구분해서 관리하기 위해 아래와 같이 따로 따로 변수에 할당해주었다.
// gulp.series([clean])는 series()를 통해 최종 결과물의 위치에 가서 clean함수를 실행해주라는 의미이다.
// 여기도 마찬가지로 ()안에 [clean] 형태로 배열을 사용하는 이유는 clean태스크 뿐만 아니라 다른 여러 태스크들도 실행할 수도 있기 때문이다.
const prepare = gulp.parallel([clean, img]);

// gulp.series([pug, styles])를 통해 pug와 styles, js 태스크(함수)를 실행시켜준다.
const assets = gulp.series([pug, styles, js]);

// gulp.series([webserver])를 통해 웹 서버를 생성하는 태스크를 실행한다.
// gulp.series()안에 watch를 넣었을 때 제대로 동작하지 않으면 parallel()메소드로 바꿔서 해보기
// 만약 여러 task들을 동시에 실행되길 원한다면 series()대신 parallel()메소드를 사용하면 된다.
const postDev = gulp.series([webserver, watch]);

// npm run dev를 통해 gulp를 실행(gulp dev)을 해주면 gulp가 실행된다.
// 위에 만든 함수들은 package.json내에서 command(명령어)로 사용되지 않기 때문에 export가 필요없지만 아래 dev는 package.json에서 command(명령어)로 쓰고 있기 때문에 해줘야 한다. EX) dev: "gulp dev"
// 만약 export하지 않는다면 console이나 package.json에서 사용할 수 없다.
// gulp는 task와 함께 동작하기 때문에 우리는 task가 필요하다
// 여기서 task의 의미는 gulp가 컴파일이 필요한 각종 파일들을 컴파일한 후 파일을 최적화 및 최소화시켜서 필요한 폴더에 넣어주거나 하는 것들을 말한다.
// 이런 task들은 그룹으로 묶을 수 있고 한 task는 이미지를 최적화하고 한 task는 js파일을 압축하고,
// 한 task는 모든 파일들을 한 폴더에 집어넣고 그 폴더를 브라우저에 출력시키는 등등 여러가지 task들을 나눌 수 있고 그 task들을 실행시킬 수 있다.
// series함수는 Task들을 순차적으로 실행한다. gulp.series([pug, pug2, pug3])이라고 하면 pug, pug2, pug3의 task들을 순차적으로 실행해준다.
// export const dev = gulp.series([prepare, assets, postDev]);

// build는 prepare와 assets함수를 불러와서 차례대로 실행한다.
// export const build = gulp.series([prepare, assets]);

// 위에서 만든 build함수를 실행하고
// export const deploy = gulp.series([build, ghDeploy]);

// 위의 코드를 아래와 같이 쓸 수도 있다.
// prepare와 assets 태스크를 실행시키는 것을 build변수에 담고 dev에서 build를 실행시켜주면 prepare, assetss을 실행시키는 것과 같다.
export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, postDev]);
export const deploy = gulp.series([build, ghDeploy]);
