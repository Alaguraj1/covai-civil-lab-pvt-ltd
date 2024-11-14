import axios from 'axios';

export const instance = () => {
  const data = axios.create({
    baseURL: 'https://xvt7fwb7-8000.inc1.devtunnels.ms/',
  });

  data.interceptors.request.use(async function (config) {
    const accessToken = localStorage.getItem('crmToken');
    if (accessToken) {
      config.headers['authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  });

  return data;
};

export default instance;
