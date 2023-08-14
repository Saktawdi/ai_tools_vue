import axios from "../request";
import { requestConfig } from "../request";

//登录接口
export const loginApi = (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    return axios.post(`${requestConfig.baseURL1}/v1/user/pub/login`, formData);
};

// 注册接口
export const registerApi = (loginName, email, avatar, password) => {
    const requestData = {
        loginName: loginName,
        email: email,
        avatar: avatar,
        password: password
    };
    return axios.post(`${requestConfig.baseURL1}/v1/user/pub/register`, requestData, {
        headers: {
            "Content-Type": "application/json"
        }
    });
};

//获取信息
export const getUserInfoApi = (token) => {
    return axios.get(`${requestConfig.baseURL1}/v1/user/pri/getInfo`, {
        headers: {
            "token": token
        }
    });
};

// 上传头像文件接口
export const uploadAvatar = (file) => {
    // 构造上传请求
    const formData = new FormData();
    formData.append("file", file);
    return  axios.post( `${requestConfig.baseURL1}/common/pub/uploadAvatar`, formData, {
        headers: {
            "Content-Type": "multipart/form-data" 
        }
    });
}
