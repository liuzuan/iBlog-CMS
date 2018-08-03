import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login.vue')
};

export const registerRouter = {
    path: '/register',
    name: 'register',
    meta: {
        title: 'register - 注册'
    },
    component: () => import('@/views/register.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: '首页', name: 'home_index', component: () => import('@/views/home/home.vue') },
        {
            path: 'ownspace',
            title: '个人中心',
            name: 'ownspace_index',
            component: () => import('@/views/own-space/own-space.vue')
        },
        {
            path: 'message',
            title: '消息中心',
            name: 'message_index',
            component: () => import('@/views/message/message.vue')
        }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/access',
        icon: 'key',
        name: 'access',
        title: '权限管理',
        component: Main,
        children: [
            {
                path: 'index',
                title: '权限管理',
                name: 'access_index',
                component: () => import('@/views/access/access.vue')
            }
        ]
    },
    {
        path: '/access-test',
        icon: 'lock-combination',
        title: '权限测试页',
        name: 'accesstest',
        access: 0,
        component: Main,
        children: [
            {
                path: 'index',
                title: '权限测试页',
                name: 'accesstest_index',
                access: 0,
                component: () => import('@/views/access/access-test.vue')
            }
        ]
    },
    {
        path: '/blog',
        icon: 'social-buffer',
        name: 'component',
        title: '博文管理',
        component: Main,
        children: [
            {
                path: 'category-list',
                icon: 'ios-pricetags-outline',
                name: 'category-list',
                title: '分类列表',
                component: () => import('@/views/blog/category-list/category-list.vue')
            },
            {
                path: 'article-publish',
                icon: 'compose',
                name: 'article-publish',
                title: '文章发布',
                component: () => import('@/views/blog/article-publish/article-publish.vue')
            },
            {
                path: 'article-list',
                icon: 'ios-list-outline',
                name: 'article-list',
                title: '文章列表',
                component: () => import('@/views/blog/article-list/article-list.vue')
            }
        ]
    },
    {
        path: '/image',
        icon: 'android-upload',
        name: 'image',
        title: '图片管理',
        component: Main,
        children: [
            {
                path: 'upload',
                title: '文件上传',
                name: 'upload',
                component: () => import('@/views/image-manage/upload/upload.vue')
            }
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [loginRouter, registerRouter, otherRouter, locking, ...appRouter, page500, page403, page404];
