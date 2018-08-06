<style lang="less">
    @import './login.less';
</style>

<template>
    <div>
        <div class="login"
             @keydown.enter="handleSubmit">
            <div class='bg1'
                 :style='{ backgroundImage: `url(${url1})`,opacity:op1}'></div>
            <div class='bg2'
                 :style='{ backgroundImage: `url(${url2})`,opacity:op2}'></div>
            <div class="login-con">
                <p class='login-con-header'
                   slot="title">
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm"
                          :model="form"
                          :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName"
                                   placeholder="用户名">
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password"
                                   v-model="form.password"
                                   placeholder="密码">
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit"
                                    type="primary"
                                    icon='log-in'
                                    long>登录</Button>
                        </FormItem>
                    </Form>
                    <div class="login-tip">
                        <p>没有账号
                            <router-link to='/register'>前往注册</router-link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import Cookies from 'js-cookie';
import axios from 'axios';
import { login } from '../libs/api.js';

import sha1 from 'sha1';
export default {
    data() {
        return {
            form: {
                userName: '',
                password: ''
            },
            rules: {
                userName: [{ required: true, message: '账号不能为空', trigger: 'change' }],
                password: [{ required: true, message: '密码不能为空', trigger: 'change' }]
            },
            url1: '',
            url2: '',
            op1: 1,
            op2: 0,
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
    methods: {
        bghandle(url) {
            this.is_firstBg = !this.is_firstBg;
            this.pending = false;
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
            this.$refs.loginForm.validate(async valid => {
                if (valid) {
                    let newpwd = sha1(this.form.password);
                    await login({ userName: this.form.userName, password: newpwd }).then(
                        res => {
                            if (res.data.success) {
                                const userInfo = res.data.data;
                                if (userInfo.is_manager === 1) {
                                    Cookies.set('access', 0);
                                } else {
                                    Cookies.set('access', 1);
                                }
                                this.$Notice.success({
                                    title: '登录成功！',
                                    duration: 3
                                });
                                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                                Cookies.set('user', userInfo.userName);
                                this.$router.push('/');
                            } else {
                                this.$Message.warning(res.data.desc);
                            }
                        },
                        err => {
                            console.log(err);
                        }
                    );
                }
            });
        }
    }
};
</script>

<style>
</style>
