<template>
  <div class="container">
    <h1 @click="search">결제 수단 관리</h1>
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
import PurchaseMethodService from '@/service/PurchaseMethodService';

export default {
  components: {
    grid: Grid,
  },
  setup() {
    onMounted(async () => {
      search();
    });
    const search = () => {
      purchaseMethodService.selectList()
        .then((data) => {
          // data.forEach((each, idx) => {
          //   data[idx].text = each.pcmNm;
          //   data[idx].value = each.pcmSeq;
          // })

          gridRef.value.invoke("resetData", data);
          // gridProps.columns[2].editor.options.listItems = data;
          // gridRef.value.invoke("setColumns", gridProps.columns);
        })
    }
    const appendRow = () => {
      gridRef.value.invoke("appendRows", [{}]);
    }
    const deleteRows = () => {
      /**
       * @type {Number[]}
       */
      const checkedList = gridRef.value.invoke("getCheckedRowKeys");
      gridRef.value.invoke("removeRows", checkedList);
    }
    const save = () => {
      const modifiedRows = gridRef.value.invoke("getModifiedRows");
      const createdRows = modifiedRows.createdRows;
      const updatedRows = modifiedRows.updatedRows;
      const deletedRows = modifiedRows.deletedRows;
      if(createdRows.length > 0) {
        createdRows.forEach(each => {
          purchaseMethodService.insertOne(each)
            .catch((e) => { alert(e.message); })
            .finally(() => { search(); })
        });
      }
      if(updatedRows.length > 0) {
        updatedRows.forEach(each => {
          purchaseMethodService.updateOne(each)
            .catch((e) => { alert(e.message); })
            .finally(() => { search(); })
        })
      }
      if(deletedRows.length > 0) {
        deletedRows.forEach(each => {
          purchaseMethodService.deleteOne(each.cardSeq)
            .catch((e) => { alert(e.message); })
            .finally(() => { search(); })
        })
      }
    }
    const purchaseMethodService = new PurchaseMethodService();
    const gridRef = ref(null);
    const listItems = ref([]);
    const gridProps = reactive({
      rowHeaders: ['checkbox', 'rowNum'],
      columnOptions: {
        resizable: true,
        frozenCount: 1,
      },
      scrollX: true,
      scrollY: true,
      bodyHeight: 200,
      columns: [
        {
          header: '일련번호',
          name: 'pcmSeq',
        },
        {
          header: '결제수단',
          name: 'pcmNm',
          editor: 'text',
        },       
        // {
        //   header: 'Type',
        //   name: 'typeCode',
        //   formatter: 'listItemText',
        //   editor: {
        //     type: 'select',
        //     options: {
        //       listItems: []
        //     }
        //   }
        // },
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
      gridProps, purchaseMethodService, gridRef, appendRow, save, search, deleteRows, listItems,
    }
  },
};
</script>
<style>
@import 'https://uicdn.toast.com/tui-grid/latest/tui-grid.css';
</style>