<template>
    <div>
        <div style="width:100%;overflow:hidden;">
            <Button @click="createNew"
                    style="float:right;margin-bottom:10px;"
                    icon="ios-plus-outline"
                    type="primary">新增分类</Button>
        </div>
        <Table stripe
               :columns="columns"
               :data="tableData"></Table>
        <Modal v-model="showModal"
               title='新增分类'
               @on-visible-change='handleBeforeClose'
               width="360">
            <Form ref="newData"
                  :model="newData"
                  :rules="ruleValidate"
                  :label-width="80">
                <FormItem label="分类名称"
                          prop="name">
                    <Input v-model="newData.name"
                           placeholder="请输入分类名称"></Input>
                </FormItem>
                <FormItem label="链接URL">
                    <Input v-model="newData.link"
                           placeholder="请输入链接URL"></Input>
                </FormItem>
                <FormItem label="状态">
                    <Select v-model="newData.status"
                            style="width:200px">
                        <Option :value="1">公开</Option>
                        <Option :value="0">隐藏</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary"
                        :loading="loading"
                        @click="handleSubmit">确认</Button>
                <Button type="ghost"
                        @click="handleCancel">取消</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { getAllCategories, addCategory, editCategory } from '@/libs/api';

export default {
    data() {
        return {
            tableData: [],
            showModal: false,
            newData: {
                status: 1
            },
            loading: false,
            ruleValidate: {
                name: [{ required: true, message: '请填写分类名称', trigger: 'blur' }]
            },
            columns: [
                {
                    title: '分类名称',
                    align: 'center',
                    key: 'name'
                },
                {
                    title: '所含文章数',
                    align: 'center',
                    render: (h, params) => {
                        return h('span', params.row.articles.length || '-');
                    }
                },
                {
                    title: '创建时间',
                    align: 'center',
                    key: 'createTime',
                    render: (h, params) => {
                        return h('span', params.row.createTime.slice(0, 10));
                    }
                },
                {
                    title: '操作',
                    align: 'center',
                    key: 'address',
                    render: (h, params) => {
                        return h('div', [
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.editorRow(params.row);
                                        }
                                    }
                                },
                                '编辑'
                            ),
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        display: params.row.status == 1 ? '' : 'none'
                                    },
                                    on: {
                                        click: () => {
                                            this.handelCategoryStatus(params.row._id, 0);
                                        }
                                    }
                                },
                                '删除'
                            ),
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        display: params.row.status == 0 ? '' : 'none'
                                    },
                                    on: {
                                        click: () => {
                                            this.handelCategoryStatus(params.row._id, 1);
                                        }
                                    }
                                },
                                '恢复'
                            )
                        ]);
                    }
                }
            ]
        };
    },
    methods: {
        getList() {
            getAllCategories().then(res => {
                this.tableData = res.data;
            });
        },
        createNew() {
            this.showModal = true;
            this.isCreate = true;
        },
        editorRow(row) {
            this.showModal = true;
            this.newData = { ...row };
            this.isCreate = false;
        },
        handleSubmit() {
            this.$refs.newData.validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.isCreate &&
                        addCategory(this.newData).then(
                            res => {
                                this.handleCancel();
                                this.$Message.success(res.data.desc);
                                this.getList();
                            },
                            err => {
                                this.handleCancel();
                                this.$Message.error(err.data.desc);
                            }
                        );
                    !this.isCreate &&
                        editCategory(this.newData).then(
                            res => {
                                this.handleCancel();
                                this.$Message.success(res.data.desc);
                                this.getList();
                            },
                            err => {
                                this.handleCancel();
                                this.$Message.error(err.data.desc);
                            }
                        );
                }
            });
        },
        handleCancel() {
            this.$refs['newData'].resetFields();
            this.newData = { status: 1 };
            this.loading = false;
            this.showModal = false;
        },
        handleBeforeClose(bool) {
            if (bool) {
                this.$refs.newData.resetFields();
            }
        },
        handelCategoryStatus(id, status) {
            editCategory({ _id: id, status: status }).then(
                res => {
                    this.$Message.success(res.data.desc);
                    this.getList();
                },
                err => {
                    this.$Message.error(err.data.desc);
                }
            );
        }
    },
    created() {
        this.getList();
    },
    mounted() {},
    watch: {}
};
</script>

<style lang="less">
</style>


