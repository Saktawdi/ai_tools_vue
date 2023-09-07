import axios from "axios";

export const requestConfig={
    baseURL1:"https://api.sakta.top",
    baseURL2:"",
    timeout:60000
}

const service = axios.create({
    timeout:requestConfig.timeout
});

export default service;