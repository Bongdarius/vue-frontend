<!-- PageHome.vue -->
<template>
  <div class="home">
    <h1>안녕하세요!!</h1>
    <h2>{{userNick}} 님 로그인을 환영합니다.</h2>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import store from '@/store/state'; 

export default {

  setup() {
    onMounted( async () => {
      // console.log(userNick.value);
    })

    const userSeq = ref(computed(() => store.state.module.userSeq));
    const userId = ref(computed(() => store.state.module.userId));
    const userNick = ref(computed(() => store.state.module.userNick));

    return {
      userSeq,
      userId,
      userNick,
    }
  }
  
}
</script>