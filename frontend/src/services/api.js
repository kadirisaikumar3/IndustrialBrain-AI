import axios from "axios";

console.log(import.meta.env.VITE_API_URL);

const API = axios.create({

  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://industrialbrain-backend.onrender.com/api",

});

export default API;