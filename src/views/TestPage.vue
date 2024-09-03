<template>
  <h1>TEST</h1>
  <div :style="{textAlign: 'right'}">
    <button :style="{width: '100px', margin: '5px'}" @click="resetData">버튼</button>
  </div>
  <div id="grid"></div>
</template>
<script>
import { onMounted } from 'vue'
// import Grid from 'tui-grid';
import GridUtils from '@/utilities/GridUtils'
export default {
  setup() {
    onMounted(() => {
      // grid = new Grid({
      //   el: document.getElementById('grid'),
      //   data: [],
      //   columns: [
      //     {
      //       header: 'ID',
      //       name: 'id'
      //     },
      //     {
      //       header: '이름',
      //       name: 'name'
      //     },
      //   ],
      //   bodyHeight: 500,
      // });

      // console.log(grid);

      grid = GridUtils.createGrid({
        el: "String",
        data: [],
        columns: [
          {
            header: 'ID',
            name: 'id'
          },
          {
            header: '이름',
            name: 'name'
          },
        ],
        bodyHeight: 500,
      });
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

    return {
      grid,
      resetData,
    }
  }
}
</script>
