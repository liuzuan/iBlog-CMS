<style lang="less">
    @import './own-space.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                个人信息
            </p>
            <div>
                <Form ref="userForm"
                      :model="userForm"
                      :label-width="100"
                      label-position="right"
                      :rules="validate">
                    <FormItem label="用户头像：">
                        <img :src="userForm.avatar_url"
                             alt="">
                    </FormItem>
                    <FormItem label="用户姓名："
                              prop="userName">
                        <div style="display:inline-block;width:200px;">
                            <Input v-model="userForm.userName"></Input>
                        </div>
                    </FormItem>
                    <FormItem label="注册于：">
                        <div style="display:inline-block;width:200px;">
                            <span v-text='new Date(userInfo.createTime).toLocaleString()'></span>
                        </div>
                    </FormItem>
                    <FormItem label="最近登陆：">
                        <div style="display:inline-block;width:200px;">
                            <span v-text='new Date(userInfo.lastLoginTime).toLocaleString()'></span>
                        </div>
                    </FormItem>
                    <FormItem label="登录密码：">
                        <Button type="text"
                                size="small"
                                @click="showEditPassword">修改密码</Button>
                    </FormItem>
                    <div>
                        <Button type="text"
                                style="width: 100px;"
                                @click="cancelEditUserInfor">取消</Button>
                        <Button type="primary"
                                style="width: 100px;"
                                :loading="save_loading"
                                @click="saveEdit">保存</Button>
                    </div>
                </Form>
            </div>
        </Card>
        <Modal v-model="editPasswordModal"
               :closable='false'
               :mask-closable=false
               :width="500">
            <h3 slot="header"
                style="color:#2D8CF0">修改密码</h3>
            <Form ref="editPasswordForm"
                  :model="editPasswordForm"
                  :label-width="100"
                  label-position="right"
                  :rules="validate">
                <FormItem label="原密码"
                          prop="oldPass"
                          :error="oldPassError">
                    <Input v-model="editPasswordForm.oldPass"
                           placeholder="请输入原密码"></Input>
                </FormItem>
                <FormItem label="新密码"
                          prop="newPass">
                    <Input v-model="editPasswordForm.newPass"
                           placeholder="请输入新密码"></Input>
                </FormItem>
                <FormItem label="确认新密码"
                          prop="rePass">
                    <Input v-model="editPasswordForm.rePass"
                           placeholder="请再次输入新密码"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text"
                        @click="cancelEditPass">取消</Button>
                <Button type="primary"
                        :loading="savePassLoading"
                        @click="saveEditPass">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
    name: 'ownspace_index',
    data() {
        const validePhone = (rule, value, callback) => {
            var re = /^1[0-9]{10}$/;
            if (!re.test(value)) {
                callback(new Error('请输入正确格式的手机号'));
            } else {
                callback();
            }
        };
        const valideRePassword = (rule, value, callback) => {
            if (value !== this.editPasswordForm.newPass) {
                callback(new Error('两次输入密码不一致'));
            } else {
                callback();
            }
        };
        return {
            userForm: {
                userName: '',
                cellphone: '',
                company: '',
                department: ''
            },
            uid: '', // 登录用户的userId
            save_loading: false,
            editPasswordModal: false, // 修改密码模态框显示
            savePassLoading: false,
            oldPassError: '',
            editPasswordForm: {
                oldPass: '',
                newPass: '',
                rePass: ''
            },
            validate: {
                userName: [{ required: true, message: '请输入姓名', trigger: 'change' }],
                oldPass: [{ required: true, message: '请输入原密码', trigger: 'change' }],
                newPass: [
                    { required: true, message: '请输入新密码', trigger: 'change' },
                    { min: 6, message: '请至少输入6个字符', trigger: 'change' },
                    { max: 32, message: '最多输入32个字符', trigger: 'change' }
                ],
                rePass: [
                    { required: true, message: '请再次输入新密码', trigger: 'change' },
                    { validator: valideRePassword, trigger: 'change' }
                ]
            },
            initPhone: ''
        };
    },
    mounted() {
        const { userName, avatar_url, _id } = JSON.parse(localStorage.userInfo);
        this.userForm = { userName, avatar_url, _id };
    },
    computed: {
        userInfo() {
            return localStorage.userInfo ? JSON.parse(localStorage.userInfo) : {};
        }
    },
    methods: {
        showEditPassword() {
            this.editPasswordModal = true;
        },
        cancelEditUserInfor() {
            this.$store.commit('removeTag', 'ownspace_index');
            localStorage.pageOpenedList = JSON.stringify(this.$store.state.app.pageOpenedList);
            let lastPageName = '';
            if (this.$store.state.app.pageOpenedList.length > 1) {
                lastPageName = this.$store.state.app.pageOpenedList[1].name;
            } else {
                lastPageName = this.$store.state.app.pageOpenedList[0].name;
            }
            this.$router.push({
                name: lastPageName
            });
        },
        saveEdit() {},
        cancelEditPass() {
            this.editPasswordModal = false;
        },
        saveEditPass() {
            this.$refs['editPasswordForm'].validate(valid => {
                if (valid) {
                    this.savePassLoading = true;
                    // you can write ajax request here
                }
            });
        },

        cancelInputCodeBox() {
            this.userForm.cellphone = this.initPhone;
        }
    }
};
</script>
