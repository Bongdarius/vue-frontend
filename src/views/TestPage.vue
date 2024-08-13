<template>
  <h1 @click="pushVal">TEST</h1>
  <div>
    <tui-grid 
      ref="GridTable"
      :data="data"
      :columns="columns"
      :bodyHeight="400"
      :options="{rowHeaders: ['rowNum', 'checkbox']}"
      @check="onCheck"
      @uncheck="onUnCheck"
    >
    </tui-grid>
  </div>
</template>
<script>
import { onMounted, ref } from 'vue';
export default {
  methods: {
    onCheck(ev) {
      console.log(ev);
    },
    onUnCheck(ev) {
      console.log(ev);
    },
  },
  setup() {
    const data = ref([
      {
        id: '10012',
        city: 'Seoul',
        country: 'South Korea'
      },
      {
        id: '10013',
        city: 'Tokyo',
        country: 'Japan'    
      },
      {
        id: '10014',
        city: 'London',
        country: 'England'
      },
      {
        id: '10015',
        city: 'Ljubljana',
        country: 'Slovenia'
      },
      {
        id: '10016',
        city: 'Reykjavik',
        country: 'Iceland'
      }
    ]);
    const columns = ref([
      {
        header: 'ID',
        name: 'id'
      },
      {
        header: 'CITY',
        name: 'city',
        editor: 'text'
      },
      {
        header: 'COUNTRY',
        name: 'country'
      }
    ]);
    const pushVal = () => {
      const temp = { id: '999999', city: 'test', country: 'test' };
      data.value.push(temp);
      const grid = GridTable.value;
      grid.invoke("resetData", data.value);
    };
    const GridTable = ref();
    onMounted(async () => {
      const grid = GridTable.value;

      console.log(grid);

      grid?.applyTheme("default");
      grid?.setLanguage("ko");
    });
    return {
      data, columns, GridTable, pushVal,
    }
  }
}
</script>
