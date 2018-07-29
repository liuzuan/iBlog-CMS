<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login"
         @keydown.enter="handleSubmit">
        <div class='bg1'
             :style='{ backgroundImage: `url(${url1})`,opacity:op1}'></div>
        <div class='bg2'
             :style='{ backgroundImage: `url(${url2})`,opacity:op2}'></div>
        <div class="login-con">
            <p class='login-con-header'
               slot="title">
                欢迎注册
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
                    <FormItem v-show='"1"'
                              prop="password2">
                        <Input type="password"
                               v-model="form.password2"
                               placeholder="确认密码">
                        </Input>
                    </FormItem>
                    <FormItem>
                        <Button @click="handleSubmit"
                                type="primary"
                                icon='log-in'
                                long>注册</Button>
                    </FormItem>
                </Form>
                <div class="login-tip">
                    <p>我有账号
                        <router-link to='/login'>前往登录</router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import { register } from '../libs/api.js';
import sha1 from 'sha1';
export default {
    data() {
        const valideRePassword = (rule, value, callback) => {
            if (value !== this.form.password) {
                callback(new Error('两次输入密码不一致'));
            } else {
                callback();
            }
        };
        return {
            form: {
                userName: '',
                password: ''
            },
            rules: {
                userName: [{ required: true, message: '账号不能为空', trigger: 'change' }],
                password: [
                    { required: true, message: '请输入新密码', trigger: 'change' },
                    { min: 6, message: '请至少输入6个字符', trigger: 'change' },
                    { max: 16, message: '最多输入16个字符', trigger: 'change' }
                ],
                password2: [
                    { required: true, message: '请再次输入新密码', trigger: 'change' },
                    { validator: valideRePassword, trigger: 'change' }
                ]
            },
            url1: '',
            url2: '',
            op1: 1,
            op2: 0,
            is_firstBg: true,
            loading: false,
            timer: ''
        };
    },
    created() {
        this.timer = setInterval(() => {
            !this.loading && this.randomBg();
        }, 4000);
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    methods: {
        bghandle(url) {
            this.is_firstBg = !this.is_firstBg;
            this.loading = false;
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
            var img = new Image();
            var url = `https://picsum.photos/1624/1027?image=${Math.round(Math.random() * 1000)}&gravity=north`;
            this.loading = true;
            img.src = url;
            if (img.complete) {
                this.bghandle(url);
            } else {
                img.onload = () => {
                    this.bghandle(url);
                };
                img.onerror = () => {
                    this.loading = false;
                };
            }
        },
        handleSubmit() {
            this.$refs.loginForm.validate(async valid => {
                if (valid) {
                    var newpwd = sha1(this.form.password);
                    await register({ userName: this.form.userName, password: newpwd }).then(
                        res => {
                            if (res.data.success) {
                                this.$Message.success('登录成功！');
                                localStorage.setItem('userInfo', JSON.stringify(res.data.data));
                                Cookies.set('user', res.data.data.userName);
                                this.$router.push('/');
                            } else {
                                this.$Message.success(res.data.desc);
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
