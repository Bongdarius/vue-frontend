<template>
  <div v-show="state">
    <PageHeader/> <!-- 헤더 컴포넌트 -->
  </div>
  <router-view/>  <!-- 페이지 이동이 표시될 곳 -->
  <div v-show="state">
    <PageFooter/> <!-- 푸터 컴포넌트 -->
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader'
import PageFooter from '@/components/PageFooter'
import { computed, onBeforeMount } from 'vue';
import store from '@/store/state'; // store 파일 import
import { useRouter } from 'vue-router';
import MemberService from '@/service/MemberService';

export default {
  name: 'App',
  components: {
    PageFooter,
    PageHeader
  },
  setup() {
    onBeforeMount(async () => {
      const member = await memberService.isLogin();
      console.log(member);
      if(member) {
        store.commit('changeIsLogin', true);
        store.commit('changeUserSeq', member.mbSeq);
        store.commit('changeUserId', member.mbId);
        store.commit('changeUserNick', member.mbNick);
        router.push('/');
      } else {
        router.push('/login');
      }

      // if(!state.value) {
      //   router.push('/login');
      // }
    });

    const router = useRouter();
    const state = computed(() => store.state.module.isLogin);
    const memberService = new MemberService();
    return {
      state,
      router,
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
