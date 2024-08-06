<!-- PageAbout.vue -->
<template>
  <!-- <div class="about">
    <h1 @click="test">This is an about page</h1>
  </div> -->
  <button>버튼 누르세요</button>
  <DataTable :value="cards" tableStyle="min-width: 50rem">
    <Column field="cardSeq" header="카드 일련번호"></Column>
    <Column field="cardNm" header="카드명"></Column>
  </DataTable>
</template>
<script>
import { ref, onMounted } from 'vue';
import { defineComponent } from '@vue/composition-api'
import TestService from '@/service/TestService';

export default defineComponent({
  setup() {
    onMounted( async () => {
      test();
    });
    const testService = new TestService();
    const cards = ref([]);

    const test = () => {
      testService.selectCardList()
        .then(data => cards.value = data);
    }

    return {
      cards,
      test,
    };
  },
})
</script>
