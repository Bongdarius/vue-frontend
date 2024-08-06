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

export default {
  name: 'App',
  components: {
    PageFooter,
    PageHeader
  },
  setup() {
    onBeforeMount(async () => {
      if(!state.value) {
        router.push('/login');
      }
    });

    const router = useRouter();
    const state = computed(() => store.state.module.isLogin);

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
