<!-- PageHeader.vue -->
<template>
  <header>
    <div :style="{textAlign: 'right', marginRight: '10px', marginTop: '10px'}">
      <a href="#" @click="logout">로그아웃</a>
    </div>
    <div id="nav">
      <router-link to="/">Home</router-link>
      <!-- 관리자 기능 -->
      <div v-show="userId == 'admin'">
        <router-link to="/member">회원 관리</router-link> |
        <router-link to="/card">카드 관리</router-link> |  
        <router-link to="/purchase/method">결제 수단 관리</router-link> |
        <router-link to="/test">테스트</router-link>
      </div>
      <!-- 사용자 기능 -->
      <div>
        <router-link to="/member/card">카드 등록</router-link> |
        <router-link to="/purchase">결제 내역</router-link>
      </div>
    </div>
  </header>
</template>

<script>
import { computed } from 'vue';
import store from '@/store/state'; // store 파일 import
import MemberService from '@/service/MemberService';
import { useRouter } from 'vue-router';
export default {
  setup() {
    const userId = computed(() => store.state.module.userId);
    const memberService = new MemberService();
    const router = useRouter();
    const logout = () => {
      memberService.logout()
        .then(() => {
          store.commit('changeIsLogin', false);
          store.commit('changeUserSeq', null);
          store.commit('changeUserId', null);
          store.commit('changeUserNick', null);
          router.push("/login");
        })
        .catch(e => {
          alert(e.message);
        })
    }
    return {
      userId,
      logout,
    }
  }
}
</script>

<style scoped>

</style>