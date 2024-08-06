<template>
  <div class="container">
    <h1 @click="search">회원 관리</h1>
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
import MemberService from '@/service/MemberService';

export default {
  components: {
    grid: Grid,
  },
  setup() {
    onMounted(async () => {
      search();

      console.log(gridRef.value.getInstance());
    });
    const search = () => {
      memberService.selectList()
        .then((data) => {
          gridRef.value.invoke("resetData", data);
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
    const gridRef = ref(null);
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
      virtual: {
        height: 300, // 가상 스크롤 영역 높이
        rowHeight: 30 // 각 행의 높이
      },
      options: {
        rowHeaders: ['checkbox'],
      },
    });
    return {
      gridProps, memberService, gridRef, appendRow, save, search, deleteRows
    }
  },
};
</script>
<style>
@import 'https://uicdn.toast.com/tui-grid/latest/tui-grid.css';
</style>