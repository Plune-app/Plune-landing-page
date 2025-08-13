import axios from "axios";
export const api = axios.create({
  baseURL : "https://api.plune.app.br/api",
})
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@plune.app/token");
  if (token) {  
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config
})