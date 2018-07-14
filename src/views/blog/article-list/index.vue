<template>
    <div class="articleList">
        <section class="searchPanel"
                 style="padding:0 0 15px 0;">
            <Select v-model="searchParams.status"
                    placeholder="文章状态"
                    style="width:150px">
                <Option v-for="item in statusOptions"
                        :value="item.value"
                        :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="searchParams.categoryName"
                    placeholder="文章分类"
                    style="width:150px">
                <Option v-for="item in categoryOptions"
                        :value="item.value"
                        :key="item.value">{{ item.label }}</Option>
            </Select>
            <Input style="width:200px;"
                   v-model="searchParams.title"
                   placeholder="文章标题"></Input>
            <Button type="primary"
                    style="margin-left: 20px;"
                    icon="ios-search"
                    @click='submitSearch'>查询</Button>
            <Button type="primary"
                    icon="ios-search"
                    @click='clearSearch'>清除</Button>
        </section>
        <Table stripe
               :columns="columns"
               :data="data"></Table>
    </div>
</template>
<script>
import { getAllCategories, getArticle, editArticle } from '@/libs/api';
export default {
    name: 'artical-list',
    data() {
        return {
            categoryOptions: [],
            statusOptions: [{ label: '已发布', value: 1 }, { label: '草稿', value: 0 }],
            searchParams: {},
            columns: [
                {
                    title: '状态',
                    align: 'center',
                    key: 'status',
                    render: (h, params) => {
                        return h('span', params.row.status == 1 ? '已发布' : '草稿');
                    }
                },
                {
                    title: '所属分类',
                    align: 'center',
                    key: 'categoryName'
                },
                {
                    title: '文章标题',
                    align: 'center',
                    key: 'title'
                },
                {
                    title: '发布时间',
                    align: 'center',
                    key: 'createTime',
                    render: (h, params) => {
                        return h('span', params.row.createTime.slice(0, 10));
                    }
                },
                {
                    title: '修改时间',
                    align: 'center',
                    key: 'modifyTime',
                    render: (h, params) => {
                        return h('span', params.row.modifyTime.slice(0, 10));
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
                                            this.toEditor(params.row);
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
                                        display: params.row.status == 1? '':'none'
                                    },
                                    on: {
                                        click: () => {
                                            this.handelArticleStatus(params.row._id,0);
                                        }
                                    }
                                },
                                '删除'
                            ),
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'ghost',
                                        size: 'small'
                                    },
                                    style: {
                                        display: params.row.status == 0? '':'none'
                                    },
                                    on: {
                                        click: () => {
                                            this.handelArticleStatus(params.row._id,1);
                                        }
                                    }
                                },
                                '恢复'
                            )
                        ]);
                    }
                }
            ],
            data: []
        };
    },
    created() {
        this.getArticle();
        this.getAllCategories();
    },
    mounted() {},
    methods: {
        getArticle(data) {
            data = data || {};
            getArticle(data).then(res => {
                this.data = res.data;
            });
        },
        getAllCategories() {
            getAllCategories().then(res => {
                res.data.forEach(val => {
                    this.categoryOptions.push({ label: val.name, value: val.name });
                });
            });
        },
        submitSearch() {
            this.getArticle(this.searchParams);
        },
        clearSearch() {
            this.searchParams = {};
        },
        toEditor(data){
            console.log(data)
            this.$router.push({path:`article-publish/${data._id}`})
        },
        handelArticleStatus(id,status){
            editArticle({_id:id,status:status}).then(res=>{
                this.$Message.success('文章删除成功！');
                this.submitSearch()
            })
        },
    }
};
</script>
<style lang="less">
</style>


