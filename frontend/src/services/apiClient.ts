import axios from "axios";

const isDevelopment = import.meta.env.MODE === 'development'

const baseURL = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD 


const apiClient = axios.create({
    baseURL: baseURL,
    withCredentials: false, 
});


apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 and this isn't already a refresh token request
    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url?.includes('/api/users/token/refresh/')
    ) {
      const refreshToken = localStorage.getItem('refresh_token');
      
      // If no refresh token, clear auth and redirect to login
      if (!refreshToken) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Mark the request as retried to prevent infinite loops
        originalRequest._retry = true;

        // Create a new instance for refresh request to avoid interceptor loop
        const refreshResponse = await axios.post(
          `${baseURL}/api/users/token/refresh/`,
          { refresh: refreshToken },
          { withCredentials: false }
        );
          
        const { access } = refreshResponse.data;
        localStorage.setItem('access_token', access);
          
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Clear auth and redirect on refresh failure
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    
    // If it's a 401 on refresh token endpoint or any other error, reject
    if (error.response?.status === 401 && originalRequest.url?.includes('/api/users/token/refresh/')) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;