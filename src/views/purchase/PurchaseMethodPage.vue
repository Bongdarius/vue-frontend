<template>
  <div class="container">
    <h1 @click="search">결제 수단 관리</h1>
    <div class="flex justify-end gap-2 mb-2 w-full">
      <Button label="행추가" @click="appendRow" class="flex-grow" />
      <Button label="삭제" @click="deleteRows" class="flex-grow" />
      <Button label="저장" @click="save" class="flex-grow" />
    </div>
  <div id="grid"></div>    
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import Grid from 'tui-grid'
import { onMounted } from 'vue';
import PurchaseMethodService from '@/service/PurchaseMethodService';
import GridUtils from '@/utilities/GridUtils';

export default {
  setup() {
    onMounted(async () => {
      grid = await GridUtils.createGrid({
        el: document.getElementById("grid"),
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
          {
            header: '정렬순서',
            name: 'pcmSortNo',
            editor: 'text',
            validation: {
              required: true,
              unique: true,
              dataType: 'number',
            }
          },     
        ],
      });

      search();
    });

    /**
     * @type {Grid}
     */
    let grid = null;

    const search = () => {
      purchaseMethodService.selectList()
        .then((data) => {
          grid.resetData(data);
        })
    }
    const appendRow = () => {
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
      const invalidRows = grid.validate();
      console.log(invalidRows);

      if(invalidRows.length > 0) {
        alert("데이터 검증 실패");
        return;
      }

      const modifiedRows = grid.getModifiedRows();
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
          purchaseMethodService.deleteOne(each.pcmSeq)
            .catch((e) => { alert(e.message); })
            .finally(() => { search(); })
        })
      }
    }
    const purchaseMethodService = new PurchaseMethodService();
    return {
      grid,
      purchaseMethodService, 
      appendRow, save, search, deleteRows, 
    }
  },
};
</script>