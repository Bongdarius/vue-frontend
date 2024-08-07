<template>
  <div class="container">
    <h1 @click="search">등록 카드 관리</h1>
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
import MemberCardService from '@/service/MemberCardService';

export default {
  components: {
    grid: Grid,
  },
  setup() {
    onMounted(async () => {
      search();
    });
    const search = () => {
      memberCardService.selectList()
        .then((data) => {
          gridProps.data = data;
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
          memberCardService.insertOne(each)
            .catch((e) => { alert(e.message); })
            .finally(() => { search(); })
        });
      }
      if(updatedRows.length > 0) {
        updatedRows.forEach(each => {
          memberCardService.updateOne(each)
            .catch((e) => { alert(e.message); })
            .finally(() => { search(); })
        })
      }
      if(deletedRows.length > 0) {
        deletedRows.forEach(each => {
          memberCardService.deleteOne(each.cardSeq)
            .catch((e) => { alert(e.message); })
            .finally(() => { search(); })
        })
      }
    }
    const memberCardService = new MemberCardService();
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
          name: 'mcSeq',
        },      
        {
          header: '카드명',
          name: 'cardSeq',
          onBeforeChange(ev) {
            console.log('executes before the value changes : ', ev);
          },
          onAfterChange(ev) {
            console.log('executes after the value has changed : ', ev);
          },
          // copyOptions: {
          //   useListItemText: true,
          // },
          // formatter: 'listItemText',
          editor: {
            type: 'select',
            options: {
              listItems: [
                {
                    value: 55,
                    text: "KB국민은행"
                },
                {
                    value: 56,
                    text: "카카오뱅크"
                },
                {
                    value: 57,
                    text: "농협중앙회"
                },
                {
                    value: 58,
                    text: "지역농협"
                },
                {
                    value: 59,
                    text: "IBK기업은행"
                },
                {
                    value: 60,
                    text: "우리은행"
                },
                {
                    value: 61,
                    text: "토스뱅크"
                },
                {
                    value: 62,
                    text: "하나은행"
                },
                {
                    value: 63,
                    text: "부산은행"
                },
                {
                    value: 64,
                    text: "경남은행"
                },
                {
                    value: 65,
                    text: "광주은행"
                },
                {
                    value: 66,
                    text: "제주은행"
                },
                {
                    value: 67,
                    text: "현대"
                },
                {
                    value: 68,
                    text: "삼성"
                },
                {
                    value: 69,
                    text: "LG"
                },
                {
                    value: 70,
                    text: "BC"
                },
                {
                    value: 71,
                    text: "신협"
                },
                {
                    value: 72,
                    text: "기타"
                }
              ],
            },
          },
        },
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
      gridProps, gridRef, appendRow, save, search, deleteRows, listItems,
    }
  },
};
</script>
<style>
@import 'https://uicdn.toast.com/tui-grid/latest/tui-grid.css';
</style>