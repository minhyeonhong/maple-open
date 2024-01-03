import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_MAPLE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export {instance};