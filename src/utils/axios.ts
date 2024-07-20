import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';
import EventEmitter from 'eventemitter3';

const eventEmitter = new EventEmitter();

// 创建 Axios 实例
const axiosInstance = axios.create();

const timers = {};
eventEmitter.on('progress', (requestId, progress) => {
  if (Number(progress) >= 100) {
    console.log(`请求 ${requestId} 已完成，进度 ${progress}%`);
    clearTimeout(timers[requestId]);
    delete timers[requestId];
  } else {
    timers[requestId] = setTimeout(async () => {
      await axios
        .get(`/api/v1/progress/?requestId=${requestId}`)
        .then((res) => {
          eventEmitter.emit('progress', requestId, Number(res.data?.progress));
        });
    }, 2000);
  }
});
// 添加请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // console.log({ config });
    // 生成一个新的 UUID
    // const uniqueID = uuidv4();
    // 将 UUID 添加到请求头中
    // config.headers['x-request-id'] = uniqueID;
    // 发射事件，传递请求的 UUID 和配置对象
    const requestId = config.headers['x-request-id'];

    console.log(`发射请求 ${requestId} 事件`);

    if (requestId) {
      eventEmitter.emit('progress', requestId, 0);
    }
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // 处理响应数据
    console.log(response);
    return response;
  },
  (error) => {
    // 处理响应错误
    return Promise.reject(error);
  }
);

export { axiosInstance, eventEmitter };
export default axiosInstance;
