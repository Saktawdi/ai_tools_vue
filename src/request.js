import axios from "axios";

export const requestConfig={
    baseURL1:"http://183.56.226.207:7868",
    baseURL2:"https://ai.fakeopen.com",
    timeout:60000
}

const service = axios.create({
    timeout:requestConfig.timeout
});

export default service;