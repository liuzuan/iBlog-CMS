<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login"
         @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎注册
                </p>
                <div class="form-con">
                    <Form ref="loginForm"
                          :model="form"
                          :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName"
                                   placeholder="请输入用户名">
                            <span slot="prepend">
                                <Icon :size="16"
                                      type="person"></Icon>
                            </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password"
                                   v-model="form.password"
                                   placeholder="请输入密码">
                            <span slot="prepend">
                                <Icon :size="14"
                                      type="locked"></Icon>
                            </span>
                            </Input>
                        </FormItem>
                        <FormItem v-show='"1"'
                                  prop="password">
                            <Input type="password"
                                   v-model="form.password2"
                                   placeholder="请再次输入密码">
                            <span slot="prepend">
                                <Icon :size="14"
                                      type="locked"></Icon>
                            </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit"
                                    type="primary"
                                    long>注册</Button>
                        </FormItem>
                    </Form>
                    <div class="login-tip">
                        <p>我有账号
                            <router-link to='/login'>前往登录</router-link>
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import {register} from '../libs/api.js';
import sha1 from 'sha1';
export default {
    data() {
        const valideRePassword = (rule, value, callback) => {
            if (value !== this.editPasswordForm.newPass) {
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
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
                    { max: 32, message: '最多输入32个字符', trigger: 'blur' }
                ],
                password2: [
                    { required: true, message: '请再次输入新密码', trigger: 'blur' },
                    { validator: valideRePassword, trigger: 'blur' }
                ],
            },
        };
    },
    methods: {
        handleSubmit() {
            this.$refs.loginForm.validate(async valid => {
                if (valid) {
                    var newpwd = sha1(this.form.password);
                    await register({userName:this.form.userName,password:newpwd}).then(res=>{
                        if (res.data.success) {
                            
                            this.$Message.success('登录成功！')
                            localStorage.setItem('userInfo',JSON.stringify(res.data.data))
                            Cookies.set('user', res.data.data.userName);
                            this.$router.push('/')
                        } else {
                            this.$Message.success(res.data.desc)
                        }
                    },err=>{
                        console.log(err)
                    })
                    // Cookies.set('user', this.form.userName);
                    // // Cookies.set('password', newpwd);
                    // this.$store.commit(
                    //     'setAvator',
                    //     'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg'
                    // );
                    // if (this.form.userName === 'admin') {
                    //     Cookies.set('access', 0);
                    // } else {
                    //     Cookies.set('access', 1);
                    // }
                    // this.$router.push({
                    //     name: 'home_index'
                    // });
                }
            });
        },
    }
};
</script>

<style>
</style>
