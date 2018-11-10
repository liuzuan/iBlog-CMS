<style lang="less">
@import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class='bg3' :style='{ opacity: op3}'></div>
        <div class='bg1' :style='{ backgroundImage: `url(${url1})`,opacity:op1}'></div>
        <div class='bg2' :style='{ backgroundImage: `url(${url2})`,opacity:op2}'></div>
        <transition name="switch">
            <div class="login-con" v-show='is_login'>
                <p class='login-con-header' slot="title">欢迎登录</p>
                <div class="form-con">
                    <Form ref="loginForm" :model="loginForm" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="loginForm.userName" placeholder="用户名" />
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="loginForm.password" placeholder="密码" />
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" icon='log-in' long>登录</Button>
                        </FormItem>
                    </Form>
                    <div class="login-tip">
                        <p>没有账号
                            <router-link to='/register'>前往注册</router-link>
                        </p>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="switch">
            <div class="login-con" v-show='!is_login'>
                <p class='login-con-header' slot="title">
                    欢迎注册
                </p>
                <div class="form-con">
                    <Form ref="registerForm" :model="registerForm" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="registerForm.userName" placeholder="用户名" />
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="registerForm.password" placeholder="密码" />
                        </FormItem>
                        <FormItem v-show='"1"' prop="password2">
                            <Input type="password" v-model="registerForm.password2" placeholder="确认密码" />
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" icon='log-in' long>注册</Button>
                        </FormItem>
                    </Form>
                    <div class="login-tip">
                        <p>我有账号
                            <router-link to='/login'>前往登录</router-link>
                        </p>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import { login, register } from '../../libs/api.js';
import { mapActions } from 'vuex';

import sha1 from 'sha1';
export default {
    data() {
        const valideRePassword = (rule, value, callback) => {
            if (value !== this.registerForm.password) {
                callback(new Error('两次输入密码不一致'));
            } else {
                callback();
            }
        };
        return {
            loginForm: {
                userName: '',
                password: ''
            },
            registerForm: {
                userName: '',
                password: '',
                password2: ''
            },
            rules: {
                userName: [{ required: true, message: '账号不能为空', trigger: 'change' }],
                password: [
                    { required: true, message: '请输入密码', trigger: 'change' },
                    { min: 6, message: '请至少输入6个字符', trigger: 'change' },
                    { max: 16, message: '最多输入16个字符', trigger: 'change' }
                ],
                password2: [
                    { required: true, message: '请再次输入密码', trigger: 'change' },
                    { validator: valideRePassword, trigger: 'change' }
                ]
            },
            url1: '',
            url2: '',
            op1: 0,
            op2: 0,
            op3: 1,
            is_firstBg: true,
            pending: false,
            timer: ''
        };
    },
    created() {
        this.randomBg();
        this.timer = setInterval(() => {
            !this.pending && this.randomBg();
        }, 4000);
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    computed: {
        is_login() {
            return this.$route.name === 'login';
        }
    },
    methods: {
        ...mapActions(['setUserInfo']),
        bghandle(url) {
            this.is_firstBg = !this.is_firstBg;
            this.pending = false;
            this.op3 = 0;
            if (this.is_firstBg) {
                this.url1 = url;
                this.op1 = 1;
                this.op2 = 0;
            } else {
                this.url2 = url;
                this.op1 = 0;
                this.op2 = 1;
            }
        },
        randomBg() {
            let img = new Image();
            let abc = '';
            let url = `https://picsum.photos/1624/1027?image=${Math.round(Math.random() * 1000)}&gravity=north`;
            this.pending = true;
            img.src = url;
            if (img.complete) {
                this.bghandle(url);
            } else {
                img.onload = () => {
                    this.bghandle(url);
                };
                img.onerror = () => {
                    this.pending = false;
                };
            }
        },
        handleSubmit() {
            const ref = this.is_login ? 'loginForm' : 'registerForm';
            let params = this.is_login ? this.loginForm : this.registerForm;
            this.$refs[ref].validate(async valid => {
                if (valid) {
                    let newpwd = sha1(params.password);
                    const res = this.is_login
                        ? await login({ userName: params.userName, password: newpwd })
                        : await register({ userName: params.userName, password: newpwd });
                    if (res.data.success) {
                        const userInfo = res.data.data;
                        if (userInfo.is_manager === 1) {
                            Cookies.set('access', 0);
                        } else {
                            Cookies.set('access', 1);
                        }
                        localStorage.setItem('userInfo', JSON.stringify(userInfo));
                        Cookies.set('user', userInfo.userName);
                        await this.setUserInfo();
                        this.$router.push('/');
                    } else {
                        this.$Message.warning(res.data.desc);
                    }
                }
            });
        }
    }
};
</script>

<style>
</style>
