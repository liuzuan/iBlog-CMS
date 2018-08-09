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

// 添加文章
export const addArticle = data => http('post', '/addArticle', data);

// 文章软删除
export const editArticle = data => http('post', '/editArticle', data);

// 文章删除
export const delArticle = data => http('post', '/delArticle', data);

// 添加分类
export const addCategory = data => http('post', '/addCategory', data);

// 修改分类
export const editCategory = data => http('post', '/editCategory', data);

// 新用户注册
export const register = data => http('post', '/register', data);

// 用户登录
export const login = data => http('post', '/login', data);

// 用户登录
export const editUserInfo = data => http('post', '/editUserInfo', data);

// 上传文件url
export const uploadUrl = util.ajaxUrl + '/upload';
