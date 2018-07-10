import util from './util';

const axios = util.ajax;

const http = (methods, url, data) => {
    if (methods === 'get') {
        return axios.get(url, { params: data });
    } else if (methods === 'post') {
        return axios.post(url, data);
    }
};

// 获取所有文章分类
export const getAllCategories = () => http('get', '/getAllCategories');

// 获取文章内容
export const getArticle = data => http('post', '/getArticle', data);

// 文章软删除
export const editArticle = data => http('post','/editArticle',data)
