import axios from "axios";

const isDevelopment = import.meta.env.MODE === 'development'

const baseURL = isDevelopment ? import.meta.env.VITE_AGENTIC_API_BASE_URL_LOCAL : import.meta.env.VITE_AGENTIC_API_BASE_URL_PROD 


const apiAgenticClient = axios.create({
    baseURL: baseURL,
    withCredentials: false, 
});


export default apiAgenticClient;