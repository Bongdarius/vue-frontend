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
import CardService from '@/service/CardService';

export default {
  components: {
    grid: Grid,
  },
  setup() {
    onMounted(async () => {
      await cardService.selectListByItems()
        .then(data => {
          gridRef.value.columns[1].editor.options.listItems = data;
          // console.log(gridRef.value.columns[1].editor.options.listItems);
          gridRef.value.invoke("setColumns", gridRef.value.columns);
        })  

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
      const checkedIdxList = gridRef.value.invoke("getCheckedRowKeys");
      //행을 화면상에서 삭제 후 삭제 상태로 만듦
      gridRef.value.invoke("removeRows", checkedIdxList);

      //삭제상태인 행을 삭제
      const modifiedRows = gridRef.value.invoke("getModifiedRows");
      const deletedRows = modifiedRows.deletedRows;
      if(deletedRows.length > 0) {
        memberCardService.deleteList(deletedRows)
          .then(() => {
            search();
          }) 
          .catch(e => {
            alert(e.message);
          })
      }
    }

    const save = async () => {
      //getModifiedRows : 그리드에서 수정된 행을 배열로 가져오는 api 3가지 상태가 존재한다. (createdRows, updatedRows, deletedRows) 
      const modifiedRows = gridRef.value.invoke("getModifiedRows");
      const createdRows = modifiedRows.createdRows;
      const updatedRows = modifiedRows.updatedRows;
      
      //신규행 + 수정행
      const saveRows = createdRows.concat(updatedRows);
      
      //신규 + 수정 행이 1건 미만일 경우 리턴
      if(saveRows.length < 1) return;

      //신규 + 수정 행의 그리드상 인덱스 번호를 반복문을 통해 saveRowKeys에 저장
      const saveRowKeys = [];
      saveRows.forEach(each => {
          saveRowKeys.push(each.rowKey);
      })

      //validate : 벨리데이션 체크를 하는 api 문제가 있는 행의 개수만큼 배열로 반환한다.
      const errorRows = gridRef.value.invoke("validate", saveRowKeys);
      if(errorRows.length > 0) {
          alert("검증 오류");
          return;
      }

      memberCardService.saveList(saveRows)
          .then(() => {
              search();
          })
          .catch(e => {
              alert(e.message);
          })
    }
    const memberCardService = new MemberCardService();
    const cardService = new CardService();
    const gridRef = ref(null);
    const listItems = ref([]);
    const gridProps = reactive({
      rowHeaders: ['rowNum', 'checkbox'],
      columnOptions: {
        resizable: true,
        frozenCount: 1,
      },
      columns: [
        {
          header: '일련번호',
          name: 'mcSeq',
        },      
        {
          header: '카드명',
          name: 'cardSeqStr',
          onBeforeChange(ev) {
            console.log('executes before the value changes : ', ev);
          },
          onAfterChange(ev) {
            console.log('executes after the value has changed : ', ev);
          },
          formatter: 'listItemText',
          editor: {
            type: 'select',
            options: {
              listItems: []
            },
          },
          validation: {
              required: true
          },
        },
        {
          header: '카드 별명',
          name: 'mcNick',
          editor: 'text',
          validation: {
              required: true
              , dataType: "string"
          },
        },    
      ],
      data: [],
      myTheme: "default",
      options: {
        rowHeaders: ['rowNum', 'checkbox'],
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