//Cleanup code for making calls to url (localhost:5147/api)
import axios from "axios";

const api = axios.create({
    baseURL : "http://localhost:2222/api"
})

export default api;