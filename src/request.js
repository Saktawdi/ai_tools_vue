import axios from "axios";

export const requestConfig={
    baseURL:"http://183.56.226.207:7868/",
    timeout:5000
}

const service =axios.create({
    baseURL:requestConfig.baseURL,
    //配置请求超时时间
    timeout:requestConfig.timeout
});

export default service;