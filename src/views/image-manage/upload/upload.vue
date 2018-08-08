<style lang="less">
    @import 'upload.less';
</style>

<template>
    <div class="margin-top-10 padding-left-10">
        <Card>
            <p slot="title">
                <Icon type="ios-analytics"></Icon>
                图片上传
            </p>
            <div class="height-492px">
                <Col span="8">
                <Upload ref="upload"
                        :show-upload-list="false"
                        :default-file-list="defaultList"
                        :on-success="handleSuccess"
                        :format="['jpg','jpeg','png']"
                        :max-size="2048"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        :before-upload="handleBeforeUpload"
                        multiple
                        type="drag"
                        action="http://localhost:3000/cms/upload"
                        style="display: inline-block;width:58px;">
                    <div style="width: 58px;height:58px;line-height: 58px;">
                        <Icon type="camera"
                              size="20"></Icon>
                    </div>
                </Upload>
                <Modal :title="imgName"
                       footer-hide
                       v-model="visible">
                    <img :src="modalUrl"
                         v-if="visible"
                         style="width: 100%">
                </Modal>
                </Col>
                <Col span="16"
                     class="padding-left-10">
                <div class="height-460px">
                    <div class="admin-upload-list"
                         v-for="item in uploadList"
                         :key="item.url">
                        <template v-if="item.status === 'finished'">
                            <img :src="item.url">
                            <div class="admin-upload-list-cover">
                                <Icon type="ios-eye-outline"
                                      @click.native="handleView(item)"></Icon>
                                <Icon type="ios-trash-outline"
                                      @click.native="handleRemove(item)"></Icon>
                            </div>
                        </template>
                        <template v-else>
                            <Progress v-if="item.showProgress"
                                      :percent="item.percentage"
                                      hide-info></Progress>
                        </template>
                    </div>
                </div>
                </Col>
            </div>
        </Card>
    </div>
</template>

<script>
export default {
    name: 'file-upload',
    data() {
        return {
            defaultList: [
                {
                    name: 'a42bdcc1178e62b4694c830f028db5c0',
                    url: 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
                }
            ],
            modalUrl: '',
            imgName: '',
            visible: false,
            uploadList: []
        };
    },
    methods: {
        handleView(item) {
            this.modalUrl = item.url;
            this.imgName = item.name;
            this.visible = true;
        },
        handleRemove(file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        },
        handleSuccess(res, file) {
            file.url = res.url;
            file.name = res.name;
        },
        handleFormatError(file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
            });
        },
        handleMaxSize(file) {
            this.$Notice.warning({
                title: '超出文件大小限制',
                desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
            });
        },
        handleBeforeUpload() {
            const check = this.uploadList.length < 5;
            if (!check) {
                this.$Notice.warning({
                    title: '最多只能上传 5 张图片。'
                });
            }
            return check;
        }
    },
    mounted() {
        this.uploadList = this.$refs.upload.fileList;
    }
};
</script>
