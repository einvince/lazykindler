import { axiosInstance } from './axios';

// 获取书籍列表
export const getVocabBookList = (book_key_list: string[]) => {
  return axiosInstance.post(`/api/vocab/book/get`, {
    book_key_list,
  });
};

// 获取生词列表
export const getVocabWordsByBookKeyList = (book_key_list: string[]) => {
  return axiosInstance.post(`/api/vocab/word/get`, {
    book_key_list,
  });
};

// 更新生词和用法
export const upsertWordAndUsage = (book_key: string, word: string, usage: string, translated_usage: string) => {
  return axiosInstance.post(`/api/vocab/word/upsert`, {
    book_key,
    word,
    usage,
    translated_usage
  });
};
