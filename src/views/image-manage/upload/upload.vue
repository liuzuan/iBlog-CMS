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
                        :on-success="handleSuccess2"
                        :format="['jpg','jpeg','png']"
                        :max-size="2048"
                        :on-format-error="handleFormatError2"
                        :on-exceeded-size="handleMaxSize"
                        :before-upload="handleBeforeUpload2"
                        multiple
                        type="drag"
                        action="//jsonplaceholder.typicode.com/posts/"
                        style="display: inline-block;width:58px;">
                    <div style="width: 58px;height:58px;line-height: 58px;">
                        <Icon type="camera"
                              size="20"></Icon>
                    </div>
                </Upload>
                <Modal title="查看图片"
                       v-model="visible">
                    <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'"
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
                                      @click.native="handleView(item.name)"></Icon>
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
                },
                {
                    name: 'bc7521e033abdd1e92222d733590f104',
                    url: 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
                }
            ],
            imgName: '',
            visible: false,
            uploadList: []
        };
    },
    methods: {
        handleFormatError(file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请选择图片文件。'
            });
        },
        handleBeforeUpload(file) {
            this.$Notice.warning({
                title: '文件准备上传',
                desc: '文件 ' + file.name + ' 准备上传。'
            });
        },
        handleProgress(event, file) {
            this.$Notice.info({
                title: '文件正在上传',
                desc: '文件 ' + file.name + ' 正在上传。'
            });
        },
        handleSuccess(evnet, file) {
            this.$Notice.success({
                title: '文件上传成功',
                desc: '文件 ' + file.name + ' 上传成功。'
            });
        },
        handleError(event, file) {
            this.$Notice.error({
                title: '文件上传成功',
                desc: '文件 ' + file.name + ' 上传失败。'
            });
        },
        handleView(name) {
            this.imgName = name;
            this.visible = true;
        },
        handleRemove(file) {
            // 从 upload 实例删除数据
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        },
        handleSuccess2(res, file) {
            // 因为上传过程为实例，这里模拟添加 url
            file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
            file.name = '7eb99afb9d5f317c912f08b5212fd69a';
        },
        handleFormatError2(file) {
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
        handleBeforeUpload2() {
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
