import Cookies from 'js-cookie';

const user = {
    state: {
        userInfo: {} // 用户信息
    },
    mutations: {
        logout(state, vm) {
            Cookies.remove('user');
            Cookies.remove('password');
            Cookies.remove('access');
            // 清空打开的页面等数据，但是保存主题数据
            let theme = '';
            if (localStorage.theme) {
                theme = localStorage.theme;
            }
            localStorage.clear();
            if (theme) {
                localStorage.theme = theme;
            }
        },
        setUserInfo(state, userInfo) {
            let user = JSON.parse(localStorage.userInfo);
            state.userInfo = user;
        }
    },
    actions: {
        setUserInfo({ commit }) {
            commit('setUserInfo');
        }
    }
};

export default user;
