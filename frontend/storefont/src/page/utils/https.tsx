
import axios from "axios";


const API_URL_BASE = "http://localhost:8001/"
export const Request = axios.create({
    baseURL: API_URL_BASE,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});