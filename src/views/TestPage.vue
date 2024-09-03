<template>
  <h1>TEST</h1>
  <div id="grid"></div>
</template>
<script>
import { onMounted } from 'vue'
import Grid from 'tui-grid/dist/tui-grid';
export default {
  setup() {
    onMounted(() => {
      const grid = new Grid({
        el: document.getElementById('grid'),
        data: [],
        scrollX: false,
        scrollY: false,
        columns: [
          {
            header: 'Name',
            name: 'name'
          },
          {
            header: 'Artist',
            name: 'artist'
          },
          {
            header: 'Type',
            name: 'type'
          },
          {
            header: 'Release',
            name: 'release'
          },
          {
            header: 'Genre',
            name: 'genre'
          }
        ]
      });

      console.log(grid);
    })
    return {
    }
  }
}
</script>
