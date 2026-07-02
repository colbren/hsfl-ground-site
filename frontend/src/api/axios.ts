import axios from "axios";

const api = axios.create({
    baseURL: "http://192.168.150.110:8001/api",
    withCredentials: true,
});

export default api;