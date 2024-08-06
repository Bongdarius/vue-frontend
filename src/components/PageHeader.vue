<!-- PageHeader.vue -->
<template>
  <header>
    <div id="nav">
      <router-link to="/">Home</router-link>
      <!-- 관리자 기능 -->
      <div v-show="loginId == 'admin'">
        <router-link to="/member">회원 관리</router-link> |
        <router-link to="/card">카드 관리</router-link> |  
        <router-link to="/purchase/method">결제 수단 관리</router-link> |
        <router-link to="/test">테스트</router-link>
      </div>
      <!-- 사용자 기능 -->
      <div>
        <router-link to="/member/card">등록 카드</router-link> |
        <router-link to="/purchase">결제 목록</router-link> |
        <router-link to="/purchase/card">카드 결제</router-link>
      </div>
    </div>
  </header>
</template>

<script>
import { computed } from 'vue';
import store from '@/store/state'; // store 파일 import
export default {
  setup() {
    console.log(computed(() => store.state.module.loginId).toUpperCase);
    const loginId = computed(() => store.state.module.loginId);
    return {
      loginId
    }
  }
}
</script>

<style scoped>

</style>