<template>
  <div class="container">
    <h1 @click="search()">결제 내역 관리</h1>
    <div class="flex gap-2 mb-2">
      <button :style="{width: '60px'}" @click="search()">전체</button>
      <button :style="{width: '60px'}" v-for="month in monthList" :key="month.value" @click="search(month.value)">
        {{month.text}}
      </button>
    </div>  
    <div class="flex justify-end gap-2 mb-2 w-full">
      <Button label="내역 추가" @click="newRow" class="flex-grow" />
      <Button label="내역 수정" @click="modifiyRow" class="flex-grow" />
      <Button label="삭제" @click="deleteRows" class="flex-grow" />
      <!-- <Button label="저장" @click="save" class="flex-grow" /> -->
    </div>
    <div id="grid"></div>  
  </div>
  <Dialog v-model:visible="visible" modal header="결제 내역 저장" :style="{ width: '20rem' }">
        <span class="text-surface-500 dark:text-surface-400 block mb-4">결제 정보를 입력하세요.</span>
        <label for="pcAmt" class="font-semibold w-100">결제수단</label>
        <Select v-model="appendRowData.pcmSeq" :options="purchaseMethodDatas" optionLabel="text" optionValue="value" placeholder="결제방법을 선택하세요." class="w-full md:w-56 mb-4" />
        <label v-if="appendRowData.pcmSeq == 1" for="pcAmt" class="font-semibold w-100">결제카드</label>
        <Select v-show="appendRowData.pcmSeq == 1" v-model="appendRowData.mcSeq" :options="memberCardDatas" optionLabel="text" optionValue="value" placeholder="카드를 선택하세요." class="w-full md:w-56 mb-4" />
        <label for="pcAmt" class="font-semibold w-100">금액</label>
        <InputNumber id="pcAmt" v-model="appendRowData.pcAmt" inputId="pcmAnt" :min="0" fluid class="mb-2"/>
        <label for="pcAmt" class="font-semibold w-100">결제일시</label>
        <div class="justify-end gap-2">
          <DatePicker v-model="appendRowData.pcDate" dateFormat="yy-mm-dd" showButtonBar class="w-full md:w-56 mb-1"/>
          <div class="flex w-full mb-4">
            <Select v-model="appendRowData.pcHour" :options="hours()" optionLabel="text" optionValue="value" :style="{width: '48%', marginRight: '2%'}"/>
            <Select v-model="appendRowData.pcMinute" :options="minutes()" optionLabel="text" optionValue="value" :style="{width: '48%'}"/>
          </div>
        </div>
        <label for="pcAmt" class="font-semibold w-100">비고</label>
        <InputText id="pcRemark" v-model.trim="appendRowData.pcRemark" autocomplete="off"/>

        <div class="flex justify-end gap-2">
            <Button type="button" label="취소" severity="secondary" @click="visible = false"></Button>
            <Button type="button" label="저장" @click="save"></Button>
        </div>
    </Dialog>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import Grid from 'tui-grid';
import { computed, onMounted, ref } from 'vue';
import PurchaseService from '@/service/PurchaseService';
import MemberCardService from '@/service/MemberCardService';
import PurchaseMethodService from '@/service/PurchaseMethodService';
import store from '@/store/state';
import GridUtils from '@/utilities/GridUtils';

export default {
  setup() {
    onMounted(async () => {
      grid = await GridUtils.createGrid({
        columns: [
          {
            header: '일련번호',
            name: 'pcSeq',
            width: 60,
          },                  
          {
            header: '결제 방법 일련번호',
            name: 'pcmSeq',
            hidden: true,
          },                   
          {
            header: '결제 방법',
            name: 'pcmNm',
            width: 70,
          },               
          {
            header: '회원 카드 일련번호',
            name: 'mcSeq',
            hidden: true,
          },                    
          {
            header: '카드명',
            name: 'mcNick',
            width: 70,
          },                 
          {
            header: '카드 결제 일련번호',
            name: 'pccSeq',
            hidden: true,
          }, 
          {
            header: '결제 금액',
            name: 'pcAmt',
            width: 120,
          },          
          {
            header: '결제일시',
            name: 'pcDatetime',
            width: 180,
          },         
          {
            header: '비고',
            name: 'pcRemark',
            minWidth: 300,
          },
        ],
        summary: {
          height: 50,
          position: 'bottom', // or 'top'
          columnContent: {
            pcAmt: {
              template: function(valueMap) {
                const valueMap_ = valueMap;
                return `총 금액: ${valueMap_.sum}`;
              }
            },
          }
        },
      });
      
      await purchaseService.selectMonthList(userSeq.value)
        .then(data => {
          data.forEach(each => {
            monthList.value.push({
              text: each.pcMonth + "월",
              value: each.pcMonth,
            })
          })
        });

      await memberCardService.selectListByItems()
        .then(data => {
          memberCardDatas.value = data;
        })
      await purchaseMethodService.selectListByItems()
        .then(data => {
          purchaseMethodDatas.value = data;
        })

      search();
    });

    /**
     * @type {Grid}
     */
    let grid = null;

    const hours = () => {
      const hours = [];
      for(let i = 1; i <= 24; i++) {
        hours.push({text: String(i), value: String(i)})
      }
      return hours;
    }

    const minutes = () => {
      const minutes = [];
      for(let i = 1; i <= 60; i++) {
        minutes.push({text: String(i), value: String(i)})
      }
      return minutes;
    }
    
    const monthList = ref([]);
    const userSeq = computed(() => store.state.module.userSeq);
    /**
     * @type {Number}
     */
    const search = (month) => {
      purchaseService.selectList(month)
        .then((data) => {
          grid.resetData(data);
        })
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
        purchaseService.deleteList(deletedRows)
          .then(() => {
            search();
          }) 
          .catch(e => {
            alert(e.message);
          })
      }
    }
    const newRow = () => {
      Object.keys(appendRowData.value).forEach(key => {
            if(key != 'mbSeq') appendRowData.value[key] = null;
      });
      const date = new Date();
      appendRowData.value.pcDate = date;
      appendRowData.value.pcHour = String(date.getHours());
      appendRowData.value.pcMinute = String(date.getMinutes());

      visible.value = true;
    }

    const modifiyRow = () => {
      /**
       * @type {Number}
       */
      const rowKey = grid.getFocusedCell().rowKey;
      /**
       * @type {Object[]}
       */
      const selectedRow = grid.getRow(rowKey);

      try {
        Object.keys(appendRowData.value).forEach(each => {
          if(each != 'mbSeq' & each != 'pcDate' & each != 'pcHour' & each != 'pcMinute') {
            appendRowData.value[each] = String(selectedRow[each]);
          } 
          else if(each == 'pcDate') {
            const dateTime = new Date(selectedRow['pcDatetime']);
            appendRowData.value[each] = dateTime;
          } 
          else if(each == 'pcHour') {
            const dateTime = new Date(selectedRow['pcDatetime']);
            appendRowData.value[each] = String(dateTime.getHours());
          } 
          else if(each == 'pcMinute') {
            const dateTime = new Date(selectedRow['pcDatetime']);
            appendRowData.value[each] = String(dateTime.getMinutes());
          }
        });
        visible.value = true;
      } catch(e) {
        alert("선택된 셀이 없습니다.");
      }
    }

    const save = async () => {
      /**
       * @type {Date}
       */
      const pcDate = appendRowData.value.pcDate
      /**
       * @type {Number}
       */
      const pcHour = appendRowData.value.pcHour;
      /**
       * @type {Number}
       */
      const pcMinute = appendRowData.value.pcMinute;
      
      if(pcDate != null && pcHour != null && pcMinute != null) {
        const year = String(pcDate.getFullYear()).padStart(4, '0');
        const month = String(pcDate.getMonth()+1).padStart(2, '0');
        const date = String(pcDate.getDate()).padStart(2, '0');
        const hour = String(pcHour).padStart(2, '0');
        const minute = String(pcMinute).padStart(2, '0');

        appendRowData.value.pcDatetime = `${year}-${month}-${date} ${hour}:${minute}:00`;
      }

      purchaseService.saveList([appendRowData.value])
        .then(() => {
          Object.keys(appendRowData.value).forEach(key => {
            if(key != 'mbSeq') appendRowData.value[key] = null;
          });
          search();
        })
        .catch(e => {
            alert(e.message);
        })
    }
    const visible = ref(false);
    const appendRowData = ref({
      pcSeq: null,
      mbSeq: userSeq,
      pcmSeq: null,
      pccSeq: null,
      mcSeq: null,
      pcAmt: null,
      pcDatetime: null,
      pcDate: null,
      pcHour: null,
      pcMinute: null,
      pcRemark: null,
    });
    const purchaseService = new PurchaseService();
    const memberCardService = new MemberCardService();
    const purchaseMethodService = new PurchaseMethodService();
    const memberCardDatas = ref([]);
    const purchaseMethodDatas = ref([]);

    return {
      grid,
      appendRow, save, search, deleteRows, 
      visible,
      appendRowData,
      memberCardDatas,
      purchaseMethodDatas,
      userSeq,
      modifiyRow,
      newRow,
      hours,
      minutes,
      monthList,
    }
  },
};
</script>