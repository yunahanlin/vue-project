<template>
<div class="wrapper">
    <mu-appbar class="header" title="发布帖子">
      <mu-icon-button @click="goback" icon="arrow_back" slot="left" />
  </mu-appbar>
  <div class="main">
      <mu-tabs :value="activeTab" @change="handleTabChange">
          <mu-tab value="edit" title="编辑"/>
          <mu-tab value="preview" title="预览"/>          
      </mu-tabs>
      <div class="text-field">
          <mu-text-field  v-model="editorTitle" label="请写标题" labelFloat fullWidth />
          <mu-select-field v-model="first" :labelFocusClass="['label-foucs']" label="请选择板块" fullWidth :errorText="errorText">
            <mu-menu-item v-for="(text,index) in list" :key="index" :value="index" :title="text" fullWidth/>
          </mu-select-field>
          <mu-text-field v-model="editorText" label="正文" hintText="建议使用Markdown 语法" multiLine :rows="10" :rowsMax="12" :fullWidth="true" labelFocusClass="label-focus" underlineFocusClass="underline-focus" />
      </div>
      <!--预览-->
      <mu-flexbox-item v-html="markedText" v-if="activeTab === 'preview'">
      </mu-flexbox-item>
      <!--确认按钮-->
      <div class="publishBtn">
        <mu-raised-button @click="publishText" label="发布" class="demo-raised-button" primary/>
      </div>
  </div>
   <!--输入提示-->
    <mu-dialog :open="publish" title="温馨提示：">
      {{tipMsg}}
      <mu-flat-button label="确定" slot="actions" primary @click="close" />
    </mu-dialog>
</div>
</template>

<script>
import axios from 'axios'
import marked from 'marked'
export default {
  data() {
      return {
          accesstoken: '',
          activeTab: 'edit',
          first: 0,
          list: ['回答', '分享', '招聘'],
          editorText: '',
          editorTitle: '',
          tipMsg: '',
          publish: false
      }
  },
  created() {
      this.accesstoken = localStorage.getItem("accesstoken")
      if (!this.accesstoken) {
          this.$router.push('/vue-home/dist/login')
      }
  },
  computed: {
      errorText() {
        return this.tab ? '' : '这是必选项'
      },
      markedText() {
          return marked(this.editorText)
      }
  },
  methods: {
      goback() {
          this.$router.go(-1)
      },
      handleTabChange (val) {
          this.activeTab = val
      },
      publishText () {
          let that = this
          if (that.editorTitle.length < 10) {
          that.publish = true
          that.tipMsg = "话题标题字数不能小于10个"
          setTimeout(function() {
            that.publish = false
          }, 2000)
        } else if (that.editorText.length < 1) {
          that.publish = true
          that.tipMsg = "文章内容不能为空"
          setTimeout(function() {
            that.publish = false
          }, 2000)
        };
         // 使用markdown编辑器
          that.editorText = marked(this.editorText)
           axios.post('https://www.vue-js.com/api/v1/topics', {
            accesstoken: that.accesstoken,
            title: that.editorTitle,
            tab: that.tab,
            content: that.editorText
          })
          .then (function (res) {
              that.publish = true
            that.tipMsg = "发布成功"
            setTimeout(function() {
              that.publish = false
            }, 2000)
          })
          .catch(function (error) {
              that.publish = true
          })
      },
      close() {
        this.publish = false
      }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/sass/_base.scss';
.wrapper {
    @include wrapper;
    .text-field {
        margin-top: 0.1rem;
        padding:0 0.1rem;
    }
    .publishBtn{
         text-align: center;
    }
}

</style>

