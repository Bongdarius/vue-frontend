<template>
  <div class="container">
    <h1 @click="search">TEST</h1>
    <div class="flex justify-end gap-2 mb-2 w-full">
      <Button label="행추가" @click="appendRow" class="flex-grow" />
      <Button label="삭제" @click="deleteRows" class="flex-grow" />
      <Button label="저장" @click="save" class="flex-grow" />
    </div>
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
// import MemberService from '@/service/MemberService';
// import TestService from '@/service/TestService';

export default {
  components: {
    grid: Grid,
  },
  setup() {
    onMounted(async () => {
      // search();

      // console.log(gridRef.value.getInstance());
    });

    const search = () => {
      // testService.selectList()
      //   .then((data) => {
      //     // console.log(data);
      //     gridRef.value.invoke("resetData", data);
      //   })
      const data = [];
      for(let i = 1; i <= 100000; i++) {
        data.push({testSeq: i, testNm: `test${i}`});
      }
      gridRef.value.invoke("resetData", data);
    }
    const appendRow = () => {
      gridRef.value.invoke("appendRows", [{}]);
    }
    const deleteRows = () => {
    }
    const save = () => {
    }
    // const testService = new TestService();
    const gridRef = ref(null);
    const gridProps = reactive({
      rowHeaders: ['checkbox', 'rowNum'],
      columnOptions: {
        resizable: true,
        frozenCount: 1,
      },
      columns: [
        {
          header: 'ID',
          name: 'testSeq',
          width: 30
        },
        {
          header: 'NAME',
          name: 'testNm'
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
      gridProps, gridRef, appendRow, save, search, deleteRows
    }
  },
};
</script>
<style>
@import 'https://uicdn.toast.com/tui-grid/latest/tui-grid.css';
</style>