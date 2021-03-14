// gulpfile.babel.js는 gulpfile을 babel을 이용해서 컴파일한다.

// gulp 패키지를 설치 후 gulp를 사용하기 위해 import해온다.
import gulp, { src } from "gulp";

// gulp에는 많은 플러그인들이 있는데 gulp pug는 pug template를 html로 컴파일 해주는 플러그인이다.
// (webpack으로 치면 loaders 플러그인이라고 보면 된다.)
import pug from "gulp-pug";

const routes = {
  pug: {
    src: "src",
  },
};

// task는 함수의 기능을 해야 한다.
// gulp객체는 몇 가지 API들을 가진다. ex: src(), dest(), task() 등등
// 참고: https://gulpjs.com/docs/en/api/concepts
export const pug = () => {
  // gulp.src()함수는 task를 실행할 파일들을 지정해준다.
  // gulp.dest()는 task를 실행한 후 결과물이 저장될 경로를 설정한다.
  // pipe()는 gulp.src()를 통해 지정된 각각의 파일들을 stream형태로 읽은 후 다음으로 실행되야 할 플러그인으로 연결해준다.
  gulp.src();

  return;
};

// npm run dev를 통해 gulp dev(gulp 실행)을 해주면 gulp가 실행된다.
// gulp는 task와 함께 동작하기 때문에 task가 필요하다
// 여기서 task의 의미는 gulp가 컴파일이 필요한 각종 파일들을 컴파일한 후 파일을 최적화 및 최소화시켜서 필요한 폴더에 넣어주거나 하는 것들을 말한다.
// 이런 task들은 그룹으로 묶을 수 있고 한 task는 이미지를 최적화하고 한 task는 js파일을 압축하고,
// 한 task는 모든 파일들을 한 폴더에 집어넣고 그 폴더를 브라우저에 출력시키는 등등 여러가지 task들을 나눌 수 있고 그 task들을 실행시킬 수 있다.
export const dev = () => console.log("I will dev");
