import axios from "../request";
import { requestConfig } from "../request";

// 获取通知列表接口
export const getNoticeListApi = (token) => {
  return axios.get(`${requestConfig.baseURL1}/v1/notice/pri/list`, {
    headers: {
      "token": token
    }
  });
};
