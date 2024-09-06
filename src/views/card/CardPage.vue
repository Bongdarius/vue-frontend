<template>
  <div class="container">
    <h1 @click="search">카드 관리</h1>
    <div class="flex justify-end gap-2 mb-2 w-full">
      <Button label="행추가" @click="appendRow" class="flex-grow" />
      <Button label="삭제" @click="deleteRows" class="flex-grow" />
      <Button label="저장" @click="save" class="flex-grow" />
    </div>
    <div id="grid" ></div>  
  </div>
</template>
<script>
import 'tui-grid/dist/tui-grid.css';
// eslint-disable-next-line no-unused-vars
import Grid from 'tui-grid';
import { onMounted } from 'vue';
import CardService from '@/service/CardService';
import GridUtils from '@/utilities/GridUtils';

export default {
  setup() {
    onMounted(async () => {
      grid = await GridUtils.createGrid({
        columns: [
          {
            header: '일련번호',
            name: 'cardSeq',
          },
          {
            header: '카드명',
            name: 'cardNm',
            editor: 'text',
          }
        ],
      });

      search();
    });
    /**
     * @type {Grid}
     */
    let grid = null;

    const search = () => {
      cardService.selectList()
        .then((data) => {
          // gridRef.value.invoke("resetData", data);
          grid.resetData(data);
        })
    }
    const appendRow = () => {
      // gridRef.value.invoke("appendRows", [{}]);
      grid.appendRows([{}]);
    }
    const deleteRows = () => {
      /**
       * @type {Number[]}
       */
       const checkedList = grid.getCheckedRowKeys();
       grid.removeRows(checkedList);
    }
    const save = () => {
      const modifiedRows = grid.getModifiedRows();
      const createdRows = modifiedRows.createdRows;
      const updatedRows = modifiedRows.updatedRows;
      const deletedRows = modifiedRows.deletedRows;

      if(createdRows.length > 0) {
        createdRows.forEach(each => {
          cardService.insertOne(each)
            .catch((e) => { alert(e.message); })
            .finally(() => { search(); })
        });
      }
      if(updatedRows.length > 0) {
        updatedRows.forEach(each => {
          cardService.updateOne(each)
            .catch((e) => { alert(e.message); })
            .finally(() => { search(); })
        })
      }
      if(deletedRows.length > 0) {
        deletedRows.forEach(each => {
          cardService.deleteOne(each.cardSeq)
            .catch((e) => { alert(e.message); })
            .finally(() => { search(); })
        })
      }
    }
    const cardService = new CardService();
    return {
      grid,
      cardService, 
      appendRow, 
      save, search, deleteRows
    }
  },
};
</script>