<style lang="less">
    @import '../../../styles/common.less';
    @import './article-publish.less';
    .CodeMirror{
        height: ~'calc(100vh - 255px)';
    }
    .CodeMirror-code {
        margin-bottom: 10px;
    }
</style>

<template>
    <div style='background:#fff;'>
        <Form inline>
            <FormItem>
                <Input clearable
                       style="width:240px"
                       placeholder="文章标题"
                       v-model="articleData.title" />
            </FormItem>
            <FormItem>
                <Input clearable
                       style="width:240px"
                       placeholder="文章软链"
                       v-model="articleData.alias" />
            </FormItem>
            <FormItem>
                <Select placeholder="状态" style="width:120px"
                        v-model="articleData.status">
                    <Option v-for="item in articleStateList"
                            :value="item.value"
                            :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem>
                <Select style="width:120px"
                        placeholder="文章分类"
                        v-model="articleData.categoryName">
                    <Option v-for="item in categories"
                            :value="item.name"
                            :key="item.name">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem>
                <i-switch size="large"
                          v-model="articleData.isTop">
                    <span slot="open">是</span>
                    <span slot="close">否</span>
                </i-switch>
            </FormItem>
            <FormItem style="margin-right:0;float:right;">
                <Button @click="handlePublish"
                        :loading="publishLoading"
                        icon="ios-checkmark"
                        type="primary">发布</Button>
            </FormItem>
        </Form>
        <textarea ref='mde'
                  id="markdown_editor"></textarea>
    </div>
</template>

<script>
import SimpleMDE from 'simplemde';
import './simplemde.min.css';
import { getAllCategories, getArticle, editArticle, addArticle } from '@/libs/api';
export default {
    name: 'artical-publish',
    data() {
        return {
            articleData: {},
            articleStateList: [{ label: '公开', value: 1 }, { label: '草稿', value: 0 }],
            categories: [],
            publishLoading: false
        };
    },
    created() {
        if (this.$route.query._id) {
            this.getArticle({ _id: this.$route.query._id });
            this.isAdd = false;
        } else {
            this.isAdd = true;
        }
        this.getAllCategories();
    },
    methods: {
        getAllCategories() {
            getAllCategories().then(res => {
                this.categories = res.data;
            });
        },
        getArticle(data) {
            data = data || {};
            getArticle(data).then(res => {
                this.articleData = res.data.data[0];
                this.articleData.categoryName = this.articleData.category.name;
                this.mde.value(this.articleData.content);
            });
        },
        canPublish() {
            let { categoryName, content, alias, title } = this.articleData;
            if (!title) {
                this.$Message.error('请输入文章标题');
                return false;
            } else if (!content) {
                this.$Message.error('请输入文章内容');
                return false;
            } else if (!alias) {
                this.$Message.error('请输入文章软链URL');
                return false;
            } else if (!categoryName) {
                this.$Message.error('请选择文章分类');
                return false;
            } else {
                return true;
            }
        },
        handlePublish() {
            if (this.canPublish()) {
                this.publishLoading = true;
                this.categories.forEach(val => {
                    if (val.name === this.articleData.categoryName) {
                        this.articleData.category = val._id;
                    }
                });
                delete this.articleData.createTime;
                delete this.articleData.updateTime;
                !this.isAdd &&
                    editArticle(this.articleData).then(
                        res => {
                            this.$Message.success(res.data.desc);
                            this.publishLoading = false;
                        },
                        err => {
                            this.$Message.error(err.data.desc);
                        }
                    );
                this.isAdd &&
                    addArticle(this.articleData).then(
                        res => {
                            this.$Message.success(res.data.desc);
                            this.publishLoading = false;
                            this.mde.value('');
                            this.articleData = {};
                        },
                        err => {
                            console.log(err);
                            this.$Message.error(err.data.desc);
                        }
                    );
            }
        },
        setMde() {
            this.mde = new SimpleMDE({
                element: this.$refs.mde,
                tabSize: 4,
                spellChecker: false,
                insertTexts: {
                    horizontalRule: ['', '\n\n-----\n\n'],
                    image: ['![](http://', ')'],
                    link: ['[', '](http://)'],
                    table: [
                        '',
                        '\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text      | Text     |\n\n'
                    ]
                },
                toolbar: [
                    'bold',
                    'italic',
                    'strikethrough',
                    'heading',
                    'heading-smaller',
                    'heading-bigger',
                    'heading-1',
                    'heading-2',
                    'heading-3',
                    '|',
                    'code',
                    'quote',
                    'unordered-list',
                    'clean-block',
                    '|',
                    'link',
                    'image',
                    'table',
                    'horizontal-rule',
                    'side-by-side',
                    'fullscreen',
                    '|',
                    'preview',
                    'guide'
                ]
            });
            this.mde.codemirror.on('change', () => {
                this.articleData.content = this.mde.value();
            });
        }
    },
    computed: {},
    watch: {},
    mounted() {
        this.setMde();
    },
    beforeDestroy() {
        this.mde.toTextArea();
    }
};
</script>
