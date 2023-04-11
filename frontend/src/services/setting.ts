import { axiosInstance } from './axios';

// 查询某项设置
export const getSetting = (key: string) => {
  return axiosInstance.get(`/api/setting/get?key=${key}`);
};

// upsert设置
export const upsertSetting = (key: string, value: any) => {
  return axiosInstance.post(`/api/setting/upsert`, {
    key,
    value,
  });
};
