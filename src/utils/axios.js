import axios from 'axios';

const url = {
  dev: 'http://localhost:8080/',
  prod: 'https://oa.lclong.top:8081/',
};

const http = axios.create({
  baseURL: url.dev,
  withCredentials: true,
});

export default http;
