import { axiosInstance } from './axios';

// 获取剪切列表
export const getAllClippings = () => {
  return axiosInstance.get(`/api/clipping/get/all`).then((data: any) => {
    return data.data;
  });
};

// 获取指定uuids的摘抄列表
//
// uuids是以分号连接的摘抄uuid字符串
export const getClippingByUUIDs = (uuids: string) => {
  return axiosInstance.get(`/api/clipping/get/uuids?uuids=${uuids}`).then((data: any) => {
    return data.data;
  });
};

// 删除摘抄
export const deleteClipping = (uuid: string) => {
  return axiosInstance.delete(`/api/clipping/delete?uuid=${uuid}`).then((data: any) => {
    return data.data;
  });
};

// 更新摘抄
export const updateClippingByKeyword = (keyword: string, new_value: any, old_value: any) => {
  return axiosInstance
    .post(
      `/api/clipping/update/bykeyword?keyword=${keyword}&new_value=${new_value}&old_value=${old_value}`,
    )
    .then((data: any) => {
      return data.data;
    });
};

// 修改clipping信息
export const updateClipping = async (uuid: string, key: string, value: any) => {
  if (value == null) {
    value = '';
  }
  const data = await axiosInstance.post(`/api/clipping/update`, {
    uuid: uuid,
    key: key,
    value: value,
  });
  return data.data;
};

// 删除所有摘抄
export const deleteAllClipping = () => {
  return axiosInstance.delete(`/api/clipping/delete/all`);
};

// 添加高亮
export const addHighlight = async (uuid: string, highlight: string) => {
  const data = await axiosInstance.post(`/api/clipping/highlight/add`, {
    uuid: uuid,
    highlight,
  });
  return data.data;
};

// 删除高亮
export const deleteHighlight = async (uuid: string, highlight: string) => {
  const data = await axiosInstance.post(`/api/clipping/highlight/delete`, {
    uuid: uuid,
    highlight,
  });
  return data.data;
};

// 手动创建笔记
export const createClipping = async (book_name: string, author: string, clip_content: any) => {
  const data = await axiosInstance.post(`/api/clipping/create`, {
    book_name,
    author,
    clip_content,
  });
  return data.data;
};

// 根据书名获取笔记数
export const getClippingCountByBookName = async (bookName: string) => {
  const data = await axiosInstance.post('/api/clipping/count/get/by/book_name', {
    book_name: bookName,
  });
  return data.data;
};

// 根据book_meta_uuid获取笔记列表
export const getClippingsByBookMetaUuid = (book_meta_uuid: string) => {
  return axiosInstance
    .get(`/api/clipping/get/by/book_meta_uuid?book_meta_uuid=${book_meta_uuid}`)
    .then((data: any) => {
      return data.data;
    });
};
