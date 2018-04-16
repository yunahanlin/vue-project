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
        Loading...
    </div>
    <mu-list>
        <div v-for="(item,index) in items">
            <div class="list">
                <router-link :to="{path: '/vue-home/dist/people',query:{user: item.author.loginname}}" :src="item.author.avatar_url" tag="img" alt="user"></router-link>
            </div>
        </div>
    </mu-list>
    <!--若无item 显示这个  -->
    <div v-if="!items.length">
      <strong>暂无话题</strong>
    </div>
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
          items: [],
          url: 'https://www.vue-js.com/api/v1/topics?tab=all'
      }
  },
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

          this.activeTab = val
          this.url = 'https://www.vue-js.com/api/v1/topics?tab=' + val
           this.getData()
      },
      getData () {
          let that = this
          that.inloading = true
          axios.get('this.url').then(function (response) {
              that.items = response.data.data
               console.log(response.data.data)
              that.inloading = false
          })
      },
      loadMore () {
          this.loading = true
      }
  }
}
</script>


<style lang="scss" scoped>
    .HeaderTabs {
        overflow: hidden;
        height: 100vh;
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
    }
</style>

