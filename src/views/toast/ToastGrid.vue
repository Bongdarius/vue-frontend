<template>
  <div class="container">
    <h1>🍞🔡 TOAST UI Grid + Vue</h1>
    <grid
      ref="gridRef"
      :data="gridProps.data"
      :columns="gridProps.columns"
      :options="gridProps.options"
      :theme="gridProps.myTheme"
      @check="onCheck"
      @uncheck="onUnCheck"
      :rowHeaders="gridProps.rowHeaders"
      :columnOptions="gridProps.columnOptions"
    ></grid>
  </div>
</template>
<script>
import 'tui-grid/dist/tui-grid.css';
import Grid from '@/Grid.vue';
import { onMounted, reactive, ref } from 'vue';
import TestService from '@/service/TestService';

export default {
  components: {
    grid: Grid,
  },
  setup() {
    onMounted(async () => {
      const data = await testService.selectCardList();
      if (gridRef.value) {
        gridRef.value.invoke("resetData", data);
      }
    });
    const testService = new TestService();
    const gridRef = ref(null);
    const gridProps = reactive({
      rowHeaders: ['checkbox', 'rowNum'],
      columnOptions: {
        resizable: true,
        frozenCount: 1,
      },
      columns: [
        {
          header: '카드일련번호',
          name: 'cardSeq',
          editor: 'text',
        },
        {
          header: '카드명',
          name: 'cardNm',
          editor: 'text',
        }
      ],
      data: [],
      myTheme: {
        name: 'myTheme',
        value: {
          cell: {
            normal: {
              background: '#00ff00',
              border: '#e0e0e0',
            },
            header: {
              background: '#ff0000',
              border: '#ffff00',
            },
            editable: {
              background: '#fbfbfb',
            },
          },
        },
      },
      options: {
        rowHeaders: ['checkbox'],
      },
    });
    return {
      gridProps, testService, gridRef,
    }
  },
};
</script>
<style>
@import 'https://uicdn.toast.com/tui-grid/latest/tui-grid.css';
</style>