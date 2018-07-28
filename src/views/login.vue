<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login"
         @keydown.enter="handleSubmit">
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
</template>

<script>
import Cookies from 'js-cookie';
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
            }
        };
    },
    methods: {
        handleSubmit() {
            this.$refs.loginForm.validate(async valid => {
                if (valid) {
                    var newpwd = sha1(this.form.password);
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
