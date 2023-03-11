import { axiosInstance } from './axios';

// 获取所有book_clipping记录
export const getAllbookClipping = () => {
  return axiosInstance.get('/api/book_clipping/get/all').then((data: any) => {
    return data.data;
  });
};

// 更新book_clipping记录
export const updateBookClipping = async (book_meta_uuid: string, clipping_book_name: string, action: any) => {
  const data = await axiosInstance.post(`/api/book_clipping/update`, {
    book_meta_uuid: book_meta_uuid,
    clipping_book_name: clipping_book_name,
    action: action,
  });
  return data.data;
};
