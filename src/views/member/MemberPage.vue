<template>
  <div class="container">
    <h1 @click="search">회원 관리</h1>
    <div class="flex justify-end gap-2 mb-2 w-full">
      <Button label="행추가" @click="appendRow" class="flex-grow" />
      <Button label="삭제" @click="deleteRows" class="flex-grow" />
      <Button label="저장" @click="save" class="flex-grow" />
    </div>
    <div id="grid" ></div>    
  </div>
</template>
<script>
import { onMounted } from 'vue';
import MemberService from '@/service/MemberService';
import GridUtils from '@/utilities/GridUtils';
// eslint-disable-next-line no-unused-vars
import Grid from 'tui-grid';

export default {
  setup() {
    onMounted(async () => {
      grid = await GridUtils.createGrid({
        columns: [
          {
            header: '일련번호',
            name: 'mbSeq',
          },
          {
            header: '닉네임',
            name: 'mbNick',
            editor: 'text',
          },
          {
            header: '아이디',
            name: 'mbId',
            editor: 'text',
          }
        ],
      })

      search();
    });
    /**
     * @type {Grid}
     */
    let grid = null;

    const search = () => {
      memberService.selectList()
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
      // const checkedList = gridRef.value.invoke("getCheckedRowKeys");
      // gridRef.value.invoke("removeRows", checkedList);
      const checkedList = grid.getCheckedRowKeys();
      grid.removeRows(checkedList);
    }
    const save = () => {
      // const modifiedRows = gridRef.value.invoke("getModifiedRows");
      const modifiedRows = grid.getModifiedRows();
      const createdRows = modifiedRows.createdRows;
      const updatedRows = modifiedRows.updatedRows;
      const deletedRows = modifiedRows.deletedRows;

      if(createdRows.length > 0) {
        createdRows.forEach(each => {
          memberService.insertOne(each)
            .catch((e) => { alert(e.message); })
            .finally(() => { search(); })
        });
      }
      if(updatedRows.length > 0) {
        updatedRows.forEach(each => {
          memberService.updateOne(each)
            .catch((e) => { alert(e.message); })
            .finally(() => { search(); })
        })
      }
      if(deletedRows.length > 0) {
        deletedRows.forEach(each => {
          memberService.deleteOne(each.mbSeq)
            .catch((e) => { alert(e.message); })
            .finally(() => { search(); })
        })
      }
    }
    const memberService = new MemberService();
    return {
      grid,
      memberService, 
      appendRow, 
      save, search, deleteRows
    }
  },
};
</script>