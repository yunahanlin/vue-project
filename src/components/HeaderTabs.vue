<template>
  <div class="demo-infinite-container HeaderTabs">
    <mu-tabs class="tabs" :value="activeTab" @change="handleTabChange">
        <mu-tab value="all" title="全部"/>
        <mu-tab value="good" title="精华"/>
        <mu-tab value="weex" title="weex"/>
        <mu-tab value="share" title="分享"/>
        <mu-tab value="ask" title="问答"/>
        <mu-tab value="job" title="招聘"/>    
    </mu-tabs>
    <div class="inloading" v-if="inloading">
        <mu-circular-progress :size="24" color="red"/>
    </div>
    <mu-list>
        <div v-for="(item,index) in items">
            <div class="list">
                <router-link :to="{path: '/vue-home/dist/people',query:{user: item.author.loginname}}" :src="item.author.avatar_url" tag="img" alt="user"></router-link>
                <router-link :to="{path: '/vue-home/dist/content',query:{id:item.id}}" tag="div" class="content">
                    <div class="list-title">
                        <span v-if="item.top">置顶</span>
                        <span v-else-if="item.good">精华</span>
                        <span v-else-if="item.tab ==='share'"  :style="styleObj">分享</span>
                        <span v-else-if="item.tab ==='ask'"  :style="styleObj">问答</span>
                        <span v-else-if="item.tab ==='job'"  :style="styleObj">招聘</span>
                        <strong>{{item.title}}</strong>
                    </div>
                    <div class="timer">
                        <span class="fl"><mu-icon value='chat' :size='14'/>{{item.reply_count}}</span>
                        <span class="fl"><mu-icon value='visibility' :size='14'/>{{item.reply_count}}</span>
                        <span class="fr">{{item.last_reply_at | formatDate}}</span>
                    </div>
                </router-link>
            </div>
        </div>
        <p v-if="nomore" v-show="nomore">内容到底啦</p>
    </mu-list>
    <!--若无item 显示这个  -->
    <!-- <div v-if="!items.length">
      <strong>暂无话题</strong>
    </div> -->
     <!--下拉加载更多的组件-->
    <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore" />
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
      return {
          activeTab: 'all',
          loading: false,
          inloading: false,
          scroller: null,
          nomore: false,
          items: [],
          styleObj: {
            background: '#C5C5C7'
          },
          page: 1,
          url: 'https://www.vue-js.com/api/v1/topics?tab=all' + '&page=' + this.page
          
      }
  },
   // 先导航和渲染组件，然后在组件的 created 钩子中获取数据
     // 组件创建完后获取数据，
  created () {
      this.getData ()
  },
  // 挂载完毕
  mounted() {
    this.scroller = this.$el
  },
  methods: {
      //tab切换
      handleTabChange (val) {
          this.page = 1 //切换tab，页数重置为第一页
          this.nomore = false //切换tab，重置
          this.activeTab = val
          this.url = 'https://www.vue-js.com/api/v1/topics?tab=' + val
        //   this.urls = 'https://www.vue-js.com/api/v1/topics?tab=' + val + '&page=' + this.page
           this.getData()
        //    loadMore (val) 
      },
      getData () {
          let that = this
          that.inloading = true
          axios.get(this.url).then(function (response) {
              that.items = response.data.data
               console.log(response.data.data)
              that.inloading = false
          })
      },
      loadMore () {
          if (!this.nomore && !this.inloading) {
              this.loading = true
              this.page += 1
              let url = 'https://www.vue-js.com/api/v1/topics?tab=all' + '&page=' + this.page
              let arr = []
              setTimeout(() => {
                  let that = this
                  axios.get(url).then(function (response) {
                      arr = response.data.data
                      console.log(arr)
                      if (arr.length === 0) {
                          that.loading = false
                          that.nomore = true
                          return
                      }
                    //   that.items = arr.push(arr);

                       that.items = [...that.items, ...arr]
                       arr = []
                  })
                  this.loading = false
              }, 600);
          }
          
      }
  }
}
</script>

<style lang="scss" scoped>
    .HeaderTabs {
        overflow: auto;
        height: 100vh;
        -webkit-overflow-scrolling: touch;
        .tabs {
            margin-top: 0.4rem;
            height: 0.4rem;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            display: flex;
            justify-content: space-around;
        }
        .inloading {
            text-align: center;
            margin-top: 0.3rem;
        }
    }
    
    .material-icons {
        vertical-align: middle;
        padding-right: 0.16rem;
    }

    .list {
        display: flex;
        border-bottom: 0.06rem solid #eff2f7;
        padding: 0.1rem;
        &>img {
            width: .3rem;
            height: .3rem;
            margin-right: 0.1rem;
        }
        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .list-title {
                text-align: left;
                >span {
                    color: #fff;
                    background: #369219;
                    padding: 0.02rem;
                    border-radius: 0.02rem;
                    font-size: 0.1rem;
                    margin-right: 0.05rem;
                }
                &>strong {
                    font-size: 0.14rem;
                }
            }
            .timer {
                color: #808080;
                padding-top: 0.1rem;
                &>span {
                    display: inline-block;
                }
                 &>span:nth-of-type(1) {
                     margin-right: 0.16rem;
                 }
                &>span.fl {
                    float: left;
                } 
                &>span.fr {
                    float: right;
                } 
            }
            

        }
    }
</style>

