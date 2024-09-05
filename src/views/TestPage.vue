<template>
  <h1>TEST</h1>
  <div :style="{textAlign: 'right'}">
    <button :style="{width: '120px', margin: '5px'}" @click="resetData">데이터 추가</button>
    <button :style="{width: '100px', margin: '5px'}" @click="dummy1">컬럼 추가</button>
  </div>
  <div id="grid" 
    :style="{margin: '10px', border: '1px solid gray',}"
    @check="onCheck"
    >
  </div>
</template>
<script>
import { onMounted } from 'vue'
// eslint-disable-next-line no-unused-vars
import Grid from 'tui-grid'
import GridUtils from '@/utilities/GridUtils'
export default {
  setup() {
    onMounted(() => {
      grid = GridUtils.createGrid({
        el: document.getElementById("grid"),
        columns: [
          {
            header: 'ID',
            name: 'id',
            width: 60,
          },
          {
            header: '이름',
            name: 'name',
            editor: {
              type: 'text',
            },
          },
        ],      
        myTheme: "default",
        rowHeaders: [{type: 'rowNum'}, {type: 'checkbox'}],
      });
      grid.on('check', ev => {
        console.log(ev);
      });
      grid.on('uncheck', ev => {
        console.log(ev);
      });

      console.log(grid);
    })

    /**
     * @type {Grid}
     */
    let grid = null;

    const resetData = () => {
      const dataList = [];
      for(let i = 0; i < 100; i++) {
        dataList.push({id: i, name: 'name' + i})
      }
      grid.resetData(dataList);
    }

    const dummy1 = () => {
      const a = grid.store.data.rawData;
      console.log(a);
    }

    return {
      grid,
      resetData,
      dummy1,
    }
  }
}
</script>