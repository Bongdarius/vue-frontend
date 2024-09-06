<template>
  <div class="container">
    <h1 @click="search">등록 카드 관리</h1>
    <div class="flex justify-end gap-2 mb-2 w-full">
      <Button label="행추가" @click="appendRow" class="flex-grow" />
      <Button label="삭제" @click="deleteRows" class="flex-grow" />
      <Button label="저장" @click="save" class="flex-grow" />
    </div>
    <div id="grid"></div>   
  </div>
</template>
<script>
import { onMounted } from 'vue';
import MemberCardService from '@/service/MemberCardService';
import CardService from '@/service/CardService';
import GridUtils from '@/utilities/GridUtils';
// eslint-disable-next-line no-unused-vars
import Grid from 'tui-grid';

export default {
  setup() {
    onMounted(async () => {
      grid = await GridUtils.createGrid({
          el: document.getElementById('grid'),
          columns: [
          {
            header: '일련번호',
            name: 'mcSeq',
          },      
          {
            header: '카드명',
            name: 'cardSeqStr',
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
      });

      cardService.selectListByItems().then(data => GridUtils.setListItems(grid, "cardSeqStr", data));

      search();
    });
    
    /**
     * @type {Grid}
     */
    let grid = null

    const search = () => {
      memberCardService.selectList()
        .then(data => {
          grid.resetData(data);
        });
    }

    const appendRow = () => {
      grid.appendRows([{}]);
    }
    const deleteRows = () => {
      const checkedList = grid.getCheckedRowKeys();
      //행을 화면상에서 삭제 후 삭제 상태로 만듦
      grid.removeRows(checkedList);

      //삭제상태인 행을 삭제
      const modifiedRows = grid.getModifiedRows();
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
      const modifiedRows = grid.getModifiedRows();
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
      // const errorRows = gridRef.value.invoke("validate", saveRowKeys);
      const errorRows = grid.validate(saveRowKeys);
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
    return {
      grid,
      appendRow, 
      save, search, deleteRows, 
    }
  },
};
</script>