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
               :height='tableHeight'
               :columns="columns"
               :data="tableData"></Table>
        <Page style="margin:10px 0;float:right;"
              :total="total"
              :current.sync='page'
              :page-size='pageSize'
              show-total
              @on-change='pageChange'></Page>
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
            page: 1,
            pageSize: 10,
            total: 0,
            tableHeight: window.innerHeight - 210,
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
                    key: 'updateTime',
                    render: (h, params) => {
                        return h('span', params.row.updateTime.slice(0, 10));
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
                                        display: params.row.status == 1 ? '' : 'none'
                                    },
                                    on: {
                                        click: () => {
                                            this.handelArticleStatus(params.row._id, 0);
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
                                            this.handelArticleStatus(params.row._id, 1);
                                        }
                                    }
                                },
                                '恢复'
                            )
                        ]);
                    }
                }
            ],
            tableData: []
        };
    },
    created() {
        this.getList();
        this.getAllCategories();
    },
    mounted() {
        window.onresize = () => {
            this.tableHeight = window.innerHeight - 210;
        };
    },
    methods: {
        getList(data) {
            data = data || {};
            data.page = this.page;
            data.pageSize = this.pageSize;
            getArticle(data).then(res => {
                this.tableData = res.data.data;
                this.total = res.data.count;
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
            this.page = 1;
            this.getList(this.searchParams);
        },
        clearSearch() {
            this.searchParams = {};
        },
        toEditor(data) {
            this.$router.push({ path: `article-publish?_id=${data._id}` });
        },
        handelArticleStatus(id, status) {
            editArticle({ _id: id, status: status }).then(res => {
                status === 0 && this.$Message.success('文章删除成功！');
                status === 1 && this.$Message.success('文章恢复成功！');
                this.getList(this.searchParams);
            });
        },
        pageChange(page) {
            this.getList(this.searchParams);
        }
    }
};
</script>
<style lang="less">
</style>


