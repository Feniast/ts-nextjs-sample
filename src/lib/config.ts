const isProd = process.env.NODE_ENV === 'production';

export const API_BACKEND_CLIENT_ADDR = isProd
  ? process.env.API_BACKEND_CLIENT_ADDR
  : process.env.API_BACKEND_CLIENT_ADDR ||
    'https://jsonplaceholder.typicode.com';

export const API_BACKEND_SERVER_ADDR = isProd
  ? process.env.API_BACKEND_SERVER_ADDR
  : process.env.API_BACKEND_SERVER_ADDR ||
    'https://jsonplaceholder.typicode.com';

export const API_BACKEND_CORS = process.env.API_BACKEND_CORS === 'true';

export const DEBUG = isProd ? false : true;
