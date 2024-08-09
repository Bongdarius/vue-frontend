import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/LoginPage.vue'
import PageHome from '@/views/PageHome.vue'
// import BoardList from '@/views/board/BoardList.vue'
import CardPage from '@/views/card/CardPage.vue'
// import ToastEditor from '@/views/toast/ToastEditor.vue'
// import PageAbout from '@/views/PageAbout.vue'
import MemberPage from '@/views/member/MemberPage.vue';
import TestPage from '@/views/TestPage.vue';
import PurchaseMethodPage from '@/views/purchase/PurchaseMethodPage.vue';
import MemberCardPage from '@/views/member/MemberCardPage.vue';
import PurchasePage from '@/views/purchase/PurchasePage.vue';

const routes = [
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage
  }, 
  {
    path: '/',
    name: 'PageHome',
    component: PageHome
  },
  // {
  //   path: '/about',
  //   name: 'PageAbout',
  //   component: PageAbout
  // },
  // {
  //   path: '/board/list',
  //   name: 'BoardList',
  //   component: BoardList
  // },
  {
    path: '/card',
    name: 'CardPage',
    component: CardPage
  },
  // {
  //   path: '/editor',
  //   name: 'toast/editor',
  //   component: ToastEditor
  // }
  {
    path: '/member',
    name: 'MemberPage',
    component: MemberPage
  },
  {
    path: '/test',
    name: 'TestPage',
    component: TestPage
  },
  {
    path: '/purchase/method',
    name: 'PurchaseMethodPage',
    component: PurchaseMethodPage,
  },
  {
    path: '/member/card',
    name: 'MemberCardPage',
    component: MemberCardPage,
  },
  {
    path: '/purchase',
    name: 'PurchasePage',
    component: PurchasePage,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router