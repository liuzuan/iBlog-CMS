<style lang="less">
    @import './home.less';
    @import '../../styles/common.less';
</style>
<template>
    <div class="home-main">
        <Row :gutter="10">
            <Col :md="24"
                 :lg="8">
            <Row class-name="home-page-row1"
                 :gutter="10">
                <Col :md="12"
                     :lg="24"
                     :style="{marginBottom: '10px'}">
                <Card>
                    <Row type="flex"
                         class="user-infor">
                        <Col span="8">
                        <Row class-name="made-child-con-middle"
                             type="flex"
                             align="middle">
                            <img class="avator-img"
                                 :src="userInfo.avatar_url" />
                        </Row>
                        </Col>
                        <Col span="16"
                             style="padding-left:6px;">
                        <Row class-name="made-child-con-middle"
                             type="flex"
                             align="middle">
                            <div>
                                <b class="card-user-infor-name">{{userInfo.userName}}</b>
                                <p>{{userInfo.is_manager?'管理员':'游客'}}</p>
                            </div>
                        </Row>
                        </Col>
                    </Row>
                    <div class="line-gray"></div>
                    <Row class="margin-top-8">
                        <Col span="8">
                        <p class="notwrap">上次登录时间:</p>
                        </Col>
                        <Col span="16"
                             class="padding-left-8">{{lastLoginTime}}</Col>
                    </Row>
                    <!-- <Row class="margin-top-8">
                        <Col span="8">
                        <p class="notwrap">上次登录地点:</p>
                        </Col>
                        <Col span="16"
                             class="padding-left-8">北京</Col>
                    </Row> -->
                </Card>
                </Col>
            </Row>
            </Col>
        </Row>

    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'home',
    components: {},
    data() {
        return {};
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo
        }),
        lastLoginTime() {
            return this.userInfo.lastLoginTime? new Date(this.userInfo.lastLoginTime).toLocaleString() : '这是您第一次登陆'
        }
    },
    methods: {}
};
</script>
