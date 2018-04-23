<template>
  <div class="wrapper">
    <mu-appbar class="header" :title="data.title">
        <mu-icon-button @click="goback" icon="arrow_back" slot="left"/>
        <mu-icon-menu icon="more_vert" slot="right">
            <mu-menu-item title="顶部" href="#content-tip"/>
            <mu-menu-item title="评论区" href="#comments-main" />
            <mu-menu-item title="写评论" href="#comments-input" />
            <mu-menu-item title="返回首页" to="/vue-home/dist" />
        </mu-icon-menu>
    </mu-appbar> 
    <div class="main">
        <div id="content-tip">
            <span v-if="data.top">置顶</span>
            <span v-else-if="data.good">精华</span>
            <span v-else-if="data.tab === 'share'" :style="styleObj">分享</span>
            <span v-else-if="data.tab === 'ask'" :style="styleObj">问答</span>
            <span v-else-if="data.tab === 'job'" :style="styleObj">招聘</span>
            <strong>  {{data.title}}  </strong>
        </div>
        <!-- 相关内容 -->
        <div class="content-about">
            <router-link :to="{path: '/vue-home/dist/people',query:{user:data.author.loginname}}" alt="user">
                <img class="content-author-pic" v-if="data.author" :src="data.author.avatar_url" alt="">
            </router-link>
            <div class="detail-msg">
                <span>作者: {{ data.author.loginname }}</span>
                <span>发表时间: {{ data.create_at | formatDate }}</span><br>
                <span>最后回复: {{ data.last_reply_at | formatDate }}</span>
                <span>浏览量: {{ data.visit_count }}</span>
            </div>
        </div>
        <div class="collect">
            <mu-checkbox v-if="accesstoken" v-model="collect"  :label="collectText" class="demo-checkbox" uncheckIcon="favorite_border" checkedIcon="favorite"/>
        </div>
        <!-- 正文 -->
        <div class="content-text" v-html="data.content"></div>
        <!-- 评论区 -->
        <ul id="comments-main">
            <li class="comments-num">{{ data.replies.length }}条评论</li>
            <li v-for="(list,index) in data.replies" :key="list.id">
                <router-link :to="{path: '/vue-home/dist',query:{user: list.author.loginname}}" alt="user">
                    <img v-if="list.author" :src="list.author.avatar_url" alt="">
                </router-link>
                <strong>{{ list.author.loginname }}</strong>
                 <!-- 时间 -->
                 <span class="comments-people-time">{{ list.create_at | formatDate }}</span>
                <!-- 点赞 -->
                <span class="comments-people-ups">
                    <mu-icon @click="good(index)" value="thumb_up" :size="16" color="#a9a9a9"/>{{list.ups.length}}
                </span><br>
                <!-- 评论图标按钮 -->
                <mu-icon @click="commentReply(index)" class="textsms" value="textsms" :size="16" color="#a9a9a9"/>
                <!--评论内容渲染-->
               <p v-html="list.content"></p>
                <!--回复评论-->
                <!--判断用户是否已登录 reply_show是否为true 来决定是否显示评论框；这里用v-show是考虑到频繁点击评论 比v-if开销低-->
                <div v-if="accesstoken" v-show="list.reply_show" class="comment-reply">
                    <mu-text-field v-model="commentReplyText" class="comment-reply-text" hintText="请输入评论" multiLine :rows="2" :rowsMax="6" fullWidth />
                    <mu-raised-button @click="commentReplyOn(index)" label="确认" class="demo-raised-button " primary />
                    <mu-raised-button @click="commentReplyOf(index)" label="取消" class="demo-raised-button " primary/>
                </div>
            </li>
        </ul>
        <!-- 评论 -->
        <div id="comments-input">
            <mu-text-field v-model="commentText" hintText="这里输入评论内容" multiLine :rows="3" :rowsMax="6"/><br>
            <mu-raised-button  @click="commentOn" label="评论" class="demo-raised-button" primary/>
            <!-- // -->
        </div>
        <div class="toast">
            <mu-toast v-if="!accesstoken" message="点赞评论及收藏文章请先登录"/>
            <mu-toast v-if="commentSuccess" message="评论成功" @close="commentReplyOf(index)"/>            
            <mu-toast v-if="commentFalse" message="评论失败" @close="commentReplyOf(index)"/>
        </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import api from '../api'
export default {
  data () {
      return {
          accesstoken: '',
          user_id: '',
          loginname: '',
          collectText: '收藏',
          commentReplyText:'',
          data: {
            author: {},
            replies: {}
          },
          styleObj: {
              background: '#999'
          },
          collect: false,
          commentSuccess: false,
          commentFalse: false,
          commentText: ''
      }
  },
  created() {
      this.accesstoken = localStorage.getItem("accesstoken");
      this.user_id = localStorage.getItem("user_id")
      this.loginname = localStorage.getItem("loginname")
      this.getData()
      this.hasCollected()
  },
   //v-model 双向数据绑定 collect
  watch: {
      collect: function (newVal) {
          if (newVal) {
              this.collectOn()
              this.collectText = '取消收藏'
          }else {
              this.collectOff()
              this.collectText = '收藏'
          }
      }
  }, 
  methods: {
      getData() {
          let id = this.$route.query.id
          console.log(id)
          let that = this
          axios.get("https://www.vue-js.com/api/v1/topic/" + id)
          .then(function (response) {
              that.data = response.data.data
              console.log(that.data)
          })
      },
      goback() {
          this.$router.go(-1)
      },
    //   收藏帖子
      collectOn() {
          let that = this
          axios.post('https://www.vue-js.com/api/v1/topic/collect',{
              accesstoken: that.accesstoken,
              topic_id: that.data.id
          }).then(function (response) {
            //   console.log(response.data)
          })
      },
      //取消收藏帖子
      collectOff() {
        let that = this
        axios.post('https://www.vue-js.com/api/v1/topic/de_collect', {
                accesstoken: that.accesstoken,
                topic_id: that.data.id
        })
        .then(function(response) {
            // console.log(response.data)
        })
      },
      hasCollected() {
          if (this.accesstoken) {
              let that =this
              axios.get('https://www.vue-js.com/api/v1/user/' + that.loginname)
              .then(function (response) {
                  let collecting = response.data.data.collect_topics
                  let thisId = that.data.id
                  collecting.find(function (item) {
                      if (item.id === thisId) {
                          that.collect = true
                      }
                  })
                  
              })
          }
      },
      //点赞
      good(index) {
          let that = this
          let replyId = that.data.replies[index].id
          axios.post('https://www.vue-js.com/api/v1/reply/' + replyId + '/ups', {
              accesstoken:that.accesstoken
          })
          .then(function (response) {
              that.getData()
            //   console.log(response);
              
          })
      },
      //点击评论图标进行回复
      commentReply(index) {
          console.log(index)
        this.data.replies[index].reply_show = true
        // console.log(this.data.replies[index].reply_show)
        this.commentReplyText = '@' + this.data.replies[index].author.loginname + ' '
      },
      //确认回复评论
      commentReplyOn(index) {
          let id = this.$route.query.id
          let that = this
          
           axios.post('https://www.vue-js.com/api/v1/topic/' + id + '/replies', {
                        accesstoken: that.accesstoken,
                        content: that.commentReplyText,
                        reply_id: that.data.replies[index].id
                    }).then((res) => {
              
              console.log(res)
              that.commentSuccess = true
              if (that.toastTimer) clearTimeout(that.toastTimer)
              that.toastTimer = setTimeout(() => { that.commentSuccess = false }, 2000)
              //  重新加载数据 刷新页面
            that.getData()
          })
          .catch(function (error) {
              that.commentFalse = true
              if (that.toastTimer) clearTimeout(that.toastTimer)
              that.toastTimer = setTimeout(() => {
                  that.commentFalse = false
              }, 2000)
          })
      },
      commentReplyOf(index) {
          let that = this
          this.commentReplyText = ''
          that.commentFalse = true
        //   that.data.replies[index].reply_show = false
          if (that.toastTimer) clearTimeout(that.toastTimer)
          that.toastTimer = setTimeout(() => { that.commentFalse = false }, 2000)
          this.data.replies[index].reply_show = false 
      },
      commentOn() {
          let id = this.$route.query.id
          let that = this
          axios.post('https://www.vue-js.com/api/v1/topic/' + id + '/replies', {
            accesstoken: that.accesstoken,
            content: that.commentText
          })
          .then(function (res) {
                that.commentSuccess = true
                if (that.toastTimer) clearTimeout(that.toastTimer)
                that.toastTimer = setTimeout(() => {
                    that.commentSuccess = false
                }, 2000)
            that.getData()
            // 清空输入
            that.commentText = ''
          })
          .catch(function (error) {
              that.commentFalse = true
              if (that.toastTimer) clearTimeout(that.toastTimer)
              that.toastTimer = setTimeout(() => {
                that.commentFalse = false
              }, 2000)
          })
      }

  }
}
</script>

<style lang="scss" scoped>
    @import '../assets/sass/_base.scss';
    .wrapper {
        @include wrapper;
        #content-tip {
            position: relative;
            padding: .2rem;
            @include border-btm;
            >span {
                position: relative;
                background-color: $class-green;
                color: #fff;
                padding: 0.02rem;
                border-radius: 0.02rem;
                font-size: 0.1rem;
                bottom: 0.02rem;
            }
            >strong {
                font-size: 0.18rem;
            }
        }
        .content-about {
            @include border-btm;
            position: relative;
            padding: 0.05rem 0;
            overflow: hidden;
            .content-author-pic {
                display: block;
                float: left;
                width: 0.48rem;
                height: 0.48rem;
                border-radius: 50%;
                margin-left: 0.05rem;
            }
            .detail-msg {
                float: left;
                color: $gray;
                font-size: 0.12rem;
                // padding-left: 0.1rem;
                >span {
                    margin-left: 0.2rem;
                    line-height: 0.24rem
                }
            }
        }
        .collect {
            text-align: center;
        }
        .demo-checkbox {
            font-size: 0.16rem;
            margin-top: 0.16rem;
            text-align: center;
        }
        .content-text {
            padding-left: 0.1rem;
        }
        #comments-main {
            border-top: .1rem solid #EFF2F7;
            @include border-btm;
            list-style-type: none;
            padding-bottom: 0.05rem;
            padding-left: 0.2rem;
            padding-right: 0.1rem;
            .comments-num {
                border-left: 0.03rem solid #fa8072;
                font-size: .16rem;
                padding: 0.08rem 0.06rem;
            }
            li {
                @include border-btm;
                position: relative;
                padding: 0.1rem 0;

                img {
                    border-radius: 50%;
                    width: .4rem;
                    height: .4rem;
                    cursor: pointer;
                    top: 0.04rem;
                }
                strong {
                    position: relative;
                    font-size: .16rem;
                    bottom: .25rem;
                }
                .comment-reply {
                    text-align: center;
                    margin: 0.02rem;
                    .comment-reply .demo-raised-button {
                        width: 0.08rem;
                        height: .16rem;
                    }
                }
                .comments-people-ups {
                    float: right;
                    color: $gray;
                }
                .comments-people-time {
                    position: absolute;
                    font-size: .12rem;
                    line-height: .22rem;
                }
                .textsms {
                    float: right;
                    margin-right: 0.05rem;
                }
            }

            
        }
        #comments-input {
            text-align: center;
            margin: .1rem;
        }
        .toast {
            display: flex;
            bottom: 0;
            width: 100%;
        }

    } 
    .mu-icon {
        vertical-align: sub;
        padding-right: 0.06rem;
        width: 22px !important;
    }

</style>


