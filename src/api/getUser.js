import axios from "../request";

//登录接口
export const loginApi = (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    return axios.post("/v1/user/pub/login", formData);
};

// 注册接口
export const registerApi = (loginName, email, avatar, password) => {
    const requestData = {
        loginName: loginName,
        email: email,
        avatar: avatar,
        password: password
    };
    return axios.post("/v1/user/pub/register", requestData, {
        headers: {
            "Content-Type": "application/json"
        }
    });
};

//获取信息
export const getUserInfoApi = (token) => {
    return axios.get("/v1/user/pri/getInfo", {
        headers: {
            "token": token
        }
    });
};