import axios from 'axios';
import { logoutUser } from './authService';

const BASE_URL= "http://localhost:9090/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const privateApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const refreshToken = async () => {
  try{
    const response = await axios.post(`${BASE_URL}/auth/refresh-token`);
    return response.data.accessToken;
  }catch (error) {
    console.error("Error refreshing token", error);
    throw error;
  }
}
privateApi.interceptors.request.use(
  (config)=>{
    const accessToken = localStorage.getItem("authToken");
    if(accessToken){
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;

  }
);
privateApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry && error) {
      originalRequest._retry = true;
      try{
      const newAccessToken = await refreshToken();
      localStorage.setItem("authToken", newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return privateApi(originalRequest);
      }catch (error) {
        logoutUser();
        return Promise.reject(error);
      }    
    }
    return Promise.reject(error);
  }
);
export default api;







