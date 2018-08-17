<style lang="less">
    @import 'upload.less';
</style>

<template>
    <div>
        <Form>
            <FormItem label='上传至：'>
                <Select v-model="uploadTo"
                        style="width:200px">
                    <Option :value="0">文章</Option>
                    <Option :value="1">图库</Option>
                </Select>
            </FormItem>
        </Form>
        <Upload ref="upload"
                :show-upload-list="false"
                :default-file-list="defaultList"
                :on-success="handleSuccess"
                :max-size="5120"
                :on-exceeded-size="handleMaxSize"
                multiple
                type="drag"
                :action="uploadUrl">
            <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload"
                      size="52"
                      style="color: #3399ff"></Icon>
                <p>点击或者拖拽文件至此框</p>
            </div>
        </Upload>
        <div style='height:auto;margin-top:20px;'>
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
        <Modal :title="imgName"
               footer-hide
               v-model="visible">
            <img :src="modalUrl"
                 v-if="visible"
                 style="width: 100%">
        </Modal>
    </div>
</template>

<script>
import { uploadUrl } from '@/libs/api';

export default {
    name: 'file-upload',
    data() {
        return {
            defaultList: [],
            modalUrl: '',
            imgName: '',
            uploadTo: 0,
            visible: false,
            uploadList: []
        };
    },
    computed: {
        uploadUrl() {
            return this.uploadTo ? uploadUrl + '?gallery=true' : uploadUrl;
        }
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
            this.$Notice.success({
                title: `${res.name} 上传成功！`
            });
        },
        // handleFormatError(file) {
        //     this.$Notice.warning({
        //         title: '文件格式不正确',
        //         desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
        //     });
        // },
        handleMaxSize(file) {
            this.$Notice.warning({
                title: '文件大小不能超过 5M'
            });
        }
    },
    mounted() {
        this.uploadList = this.$refs.upload.fileList;
    }
};
</script>
