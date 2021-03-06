import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Index from '../pages/index'
import Message from '../pages/message'
import Mine from '../pages/my'
import More from '../pages/more'
import Login from '../pages/login'
import Content from '../pages/content'
import Publish from '../pages/publish'


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/vue-home/dist',
      name: 'index',
      component: Index
    },
    {
      path: "/vue-home/dist/message",
      name: 'message',
      component: Message
    },
    {
      path: '/vue-home/dist/my',
      name: 'ine',
      component: Mine
    },
    {
      path: '/vue-home/dist/more',
      name: 'more',
      component: More
    },
    {
      path: "/vue-home/dist/login",
      name: "login",
      component: Login
    },
    {
      path: "/vue-home/dist/content",
      name: "content",
      component: Content
    },
    {
      path: "/vue-home/dist/publish",
      name: "publish",
      component: Publish
    },
    {
      path: '/',
      component: Index
    }
  ]
})
