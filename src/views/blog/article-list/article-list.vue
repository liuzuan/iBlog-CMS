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
            <Select v-model="searchParams.category"
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
                    icon="ios-close"
                    @click='clearSearch'>清除</Button>
            <!-- <Button type="primary"
                    icon="ios-checkmark"
                    @click='updateAll'>更新全部文章</Button> -->
            <i-switch style='float:right;margin-top:4px;'
                      v-model="canDel">
            </i-switch>

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
import { getAllCategories, getArticle, editArticle, delArticle, updateAllArticle } from '@/libs/api';
export default {
    name: 'artical-list',
    data() {
        return {
            categoryOptions: [],
            statusOptions: [{ label: '已发布', value: 1 }, { label: '草稿', value: 0 }],
            searchParams: { status: 1 },
            page: 1,
            pageSize: 10,
            total: 0,
            canDel: false,
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
                    key: 'category',
                    render: (h, params) => {
                        return h('span', params.row.category ? params.row.category.name : params.row.categoryName);
                    }
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
                                this.canDel ? '删除' : '隐藏'
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
        this.getList(this.searchParams);
        this.getAllCategories();
    },
    mounted() {
        window.onresize = () => {
            this.tableHeight = window.innerHeight - 210;
        };
    },
    methods: {
        getList(data) {
            data = data || { status: 1 };
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
                    this.categoryOptions.push({ label: val.name, value: val._id });
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
        async updateAll() {
            const res = await updateAllArticle();
            console.log(res);
            this.$Message.success(res.data.desc);
        },
        toEditor(data) {
            this.$router.push({ path: `article-publish?_id=${data._id}` });
        },
        handelArticleStatus(id, status) {
            if (this.canDel && status === 0) {
                delArticle({ _id: id }).then(res => {
                    this.$Message.success('文章删除成功！');
                    this.getList(this.searchParams);
                });
            } else {
                editArticle({ _id: id, status: status }).then(res => {
                    status === 0 && this.$Message.success('文章隐藏成功！');
                    status === 1 && this.$Message.success('文章恢复成功！');
                    this.getList(this.searchParams);
                });
            }
        },
        pageChange(page) {
            this.getList(this.searchParams);
        }
    }
};
</script>
<style lang="less">
</style>


