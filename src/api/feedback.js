import axios from "../request";
import { requestConfig } from "../request";

// 发送反馈接口
export const sendFeedbackApi = (token,file, userId, content, type) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("userId", userId);
  formData.append("content", content);
  formData.append("type", type);
  
  return axios.post(`${requestConfig.baseURL1}/v1/feedback/pri/send`, formData, {
    headers: {
      "token": token
    }
  });
};

// 获取反馈列表接口
export const getFeedbackListApi = (token) => {
    return axios.get(`${requestConfig.baseURL1}/v1/feedback/pri/list`, {
      headers: {
        "token": token
      }
    });
};
