import axios from "axios";

export const requestConfig={
    baseURL1:"http://temp.sakta.top:82",
    baseURL2:"",
    timeout:60000
}

const service = axios.create({
    timeout:requestConfig.timeout
});

export default service;