import { axiosInstance } from './axios';

// 从chatgpt获取信息
export const getAwnserFromChatgpt = (keywordType: string, keyword: string) => {
    return axiosInstance.post(`/api/chatgpt/get`, {
        keyword_type: keywordType,
        keyword: keyword,
    });
};
