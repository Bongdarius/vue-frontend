import axios from "axios";
//import {  useRouter } from 'vue-router';
import router from '@/router';
//import  store  from '@/store/module/auth';
//const router = useRouter();

/*export default axios.create({
  baseURL: "http://localhost:80/api",   // spring boot web server port
  headers: {
    "Content-type": "application/json",
    "Authorization": 'Bearer ' + localStorage.getItem('token'),
  }
})


const instance = axios.create({
  headers: {
    "Content-type": "application/json",
    "X-AUTH-TOKEN": localStorage.getItem("token"),
  }
});
*/

const instance = axios.create({
  baseURL: "/api",   // spring boot web server port
  headers: {
    "Content-type": "application/json",
    "Authorization": 'Bearer ' + localStorage.getItem('token'),
  }
});
// 요청 인터셉터 추가
instance.interceptors.request.use(
  function (config) {
    //console.log("config = "+ JSON.stringify(config));
    //console.log("config.url = "+ config.url);

    // 로그인/로그아웃을 제외한 다른 페이지에서 서버쪽으로 처리 요청 시,
    if(!config.url.startsWith('/auth') && !config.url.startsWith('/system/active')) {
      // 현재 사용자의 로그인 상태가 유지되고 있는 지 확인한다
      var user = JSON.parse(localStorage.getItem("user"));
      if(user == null) {
          alert("로그인 세션이 종료되었습니다. 다시 로그인하세요.");
          return config;
      }
    }

    // 요청을 보내기 전에 수행한다
    // 모든 HTTP 요청 헤더에 Authorization 을 추가한다.
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`; // 요청시 토큰 셋팅
    return config;
  },
  function (error) {
    // 오류 요청을 보내기 전에 수행한다
    alert(error);
    alert(error.message);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
instance.interceptors.response.use(
  function (response) {
    // 응답 데이터를 가공한다
    console.log(response.data);
     // 오류 응답을 처리한다
     if (response.data != undefined) {
      switch (response.data.status) {
        case 1005:
          //alert("토큰이 만료 되어 로그인 화면으로 이동합니다.");
          //store.dispatch('auth/logout');
          router.push('/LoginPage').catch(()=>{});  // 최초 페이지로 이동한다
          window.localStorage.removeItem('user');
          window.localStorage.removeItem('token');
          return new Promise(() => {});
        default:
          return response;
      }
    }

    return response;
  },

  function (error) {
    // 오류 응답을 처리한다
    if (error.response.data != undefined) {
      switch (error.response.data.status) {
        case 1005:
          //alert("토큰이 만료 되어 로그인 화면으로 이동합니다.");
          //store.dispatch('auth/logout');
          router.push('/LoginPage').catch(()=>{});  // 최초 페이지로 이동한다
          window.localStorage.removeItem('user');
          window.localStorage.removeItem('token');
          return new Promise(() => {});
        default:
          return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default instance

