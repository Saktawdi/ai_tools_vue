import axios from "../utils/request";

const baseURL = 'https://api.replicate.com'


//获取进度
export const getPredictions = (id) => {
    return axios({
      method: 'get',
      headers: {
        Authorization: `Token ${process.env.VUE_APP_REPLICATETOKEN}`
      },
      url: baseURL +`/v1/predictions/${id}`,
    });
};

// 创建预测
export const createPrediction = (inputData) => {
    return axios({
      method: 'post',
      url: baseURL + '/v1/predictions',
      headers: {
        Authorization: `Token ${process.env.VUE_APP_REPLICATETOKEN}`
      },
      data: inputData
    });
};

