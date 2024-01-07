import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_MAPLE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    switch (error.response.status) {
      // case 401: {
      //   alert("로그인 정보가 만료되어 로그아웃 합니다.");
      //   localStorage.clear();
      //   window.location.replace("/");
      //   break;
      // }
    }

    return Promise.reject(error);
  }
);

export { instance };