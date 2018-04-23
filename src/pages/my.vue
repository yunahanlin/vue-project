<template>
  <div class="wrapper">
      <mu-appbar class="header" title="个人中心">
        <mu-icon-button icon="email" to="/vue-home/dist/message" slot="right"/>
        <!-- <span class="my-news-title">个人中心</span> -->
      </mu-appbar>
      <div class="main">
        <div class="user-msg">
          <div class="user-avatar fl">
            <img :src="user_msg.avatar_url" alt="user">
          </div>
          <div class="user-detail fl">
            <span class="name">{{user_msg.loginname}}</span><br/>
            <span class="score same">积分：{{user_msg.score}}</span>
            <span class="regist-time same">注册时间：{{user_msg.create_at | formatDate}}</span>
          </div>
        </div>
        <mu-list>
          <mu-list-item class="my-information-firstitem list-item" title="最近的话题" v-if="user_msg.recent_topics" toggleNested :open="false">
              <mu-icon slot="left" value="chat"/>
              <mu-list-item class="list-item-content" :to="{path
              : '/vue-home-dist/content',query:{id:item.id}}" v-for="item in user_msg.recent_topics"
              :key="item.id" slot="nested" :title="item.title" :afterText="item.last_reply_at | formatDate">
                <mu-icon slot="left" value="hdr_weak"/>
              </mu-list-item>
              <span class="msg-num">{{user_msg.recent_topics.length}}</span>
          </mu-list-item>
          <!-- 最近的回复 -->
          <mu-list-item class="list-item" v-if="user_msg.recent_replies" title="最近的回复" toggleNested :open="false">
              <mu-icon slot="left" value="public"/>
              <mu-list-item class="list-item-content" :to="{path: '/vue-home-dist/content',query:{id:item.id}}" v-for="item in user_msg.recent_replies" :key="item.id" slot="nested" :title="item.title" :afterText="item.last_reply_at | formatDate">
                <mu-icon slot="left" value="hdr_weak"/>
              </mu-list-item>
              <span class="msg-num">{{user_msg.recent_replies.length}}</span>
          </mu-list-item>
              <!--收藏的话题-->
          <mu-list-item class="list-item" v-if="user_msg.collect_topics" title="收藏的话题" toggleNested :open="false">
            <mu-icon slot="left" value="star" />
            <mu-list-item class="list-item-content" :to="{path:'/vue-home/dist/content',query:{id:item.id}}" v-for="item in user_msg.collect_topics" :key="item.id" slot="nested" title="Starred" :title="item.title" :afterText="item.last_reply_at| formatDate">
              <mu-icon slot="left" value="hdr_weak" />
            </mu-list-item>
            <span class="msg-num">{{user_msg.collect_topics.length}}</span>
          </mu-list-item>
       <!--退出登录-->
        <div class="logout">
          <mu-raised-button label="退出登录" @click="logout" class="demo-raised-button" primary/>
        </div>
        </mu-list>
     
      </div>

      <FooterNav></FooterNav>
  </div>
</template>

<script>
import FooterNav from '../components/FooterNav.vue'
import axios from 'axios'
import api from '../api'
export default {
  data() {
    return {
      accesstoken: '',
      user_msg: '',
      user: ''
    }
  },
  components: {
      FooterNav
  },
  created() {
    this.accesstoken = localStorage.getItem("accesstoken")
    this.getData()
  },
  methods: {
    getData() {
      let that = this
      axios.post(api.getAccessToken(that.accesstoken))
      .then(function (res) {
        that.user = res.data
        that.getUserData()
      })
    },
    getUserData () {
      let that = this
      axios.get(api.getUser(that.user.loginname))
      .then(function (res) {
        that.user_msg = res.data.data
      })
    },
    logout() {
      localStorage.removeItem('accesstoken')
      localStorage.removeItem('user_id')
      localStorage.removeItem('loginname')
      this.$router.push({
          path: "/vue-home/dist"
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../assets/sass/_base.scss';
  .wrapper {
    @include wrapper;
      .main {
        padding-bottom: 0.7rem;
      }
      .user-msg {
        position: relative;
        width: 100%;
        padding: 0.1rem;
        overflow: hidden;
        .fl {
          float: left;
        }
        .user-avatar {
          width: 0.6rem;
          height: 0.6rem;
          &>img {
            width: 100%;
            height: 100%;
          }
        }
        .user-detail {
          height: 0.6rem;
          margin-left: 0.26rem;
          overflow: hidden;
          box-sizing: border-box;
          .name {
            font-weight: 600;
            font-size: 16px;
          }
          .same {
            display: block;
            font-size: 12px;
          }
        }
      }
      .list-item {
        .list-item-content {
        @include border-btm;
        padding: 0.1rem;
        border-top: 1px #dcdcdc solid;
      }
      .msg-num {
          position: absolute;
          background: #f5f5f5;
          padding: 0 0.06rem;
          right: 0.5rem;
          top: 0.12rem;
          border-radius: 50%;
        }
      }

      .logout {
        text-align: center;
        .demo-raised-button {
          margin-top: .2rem;
        }
      }
      
  }

</style>


