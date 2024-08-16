<template>
  <div class="container">
    <h1 @click="search">결제 내역 관리</h1>
    <div class="flex justify-end gap-2 mb-2 w-full">
      <Button label="내역 추가" @click="newRow" class="flex-grow" />
      <Button label="내역 수정" @click="modifiyRow" class="flex-grow" />
      <Button label="삭제" @click="deleteRows" class="flex-grow" />
      <!-- <Button label="저장" @click="save" class="flex-grow" /> -->
    </div>
    <grid
      ref="gridRef"
      :data="gridProps.data"
      :columns="gridProps.columns"
      :options="gridProps.options"
      :theme="gridProps.myTheme"
      @check="onCheck"
      @uncheck="onUnCheck"
      @dblclick="onDbClick"
      :rowHeaders="gridProps.rowHeaders"
      :columnOptions="gridProps.columnOptions"
      :scrollX="true"
      :scrollY="true"
      :summary="gridProps.summary"
    ></grid>
  </div>
  <Dialog v-model:visible="visible" modal header="결제 내역 저장" :style="{ width: '20rem' }">
        <span class="text-surface-500 dark:text-surface-400 block mb-4">결제 정보를 입력하세요.</span>
        <label for="pcAmt" class="font-semibold w-100">결제수단</label>
        <Select v-model="appendRowData.pcmSeq" :options="purchaseMethodDatas" optionLabel="text" optionValue="value" placeholder="결제방법을 선택하세요." class="w-full md:w-56 mb-4" />
        <label v-if="appendRowData.pcmSeq == 1" for="pcAmt" class="font-semibold w-100">결제카드</label>
        <Select v-show="appendRowData.pcmSeq == 1" v-model="appendRowData.mcSeq" :options="memberCardDatas" optionLabel="text" optionValue="value" placeholder="카드를 선택하세요." class="w-full md:w-56 mb-4" />
        <label for="pcAmt" class="font-semibold w-100">금액</label>
        <InputNumber id="pcAmt" v-model="appendRowData.pcAmt" inputId="pcmAnt" :min="0" fluid />
        <label for="pcAmt" class="font-semibold w-100">결제일시</label>
        <div class="flex justify-end gap-2">
          <DatePicker v-model="appendRowData.pcDate" dateFormat="yy-mm-dd" showButtonBar :style="{width: '70%'}"/>
          <DatePicker v-model="appendRowData.pcTime" timeOnly fluid :style="{width: '30%'}"/>
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
import 'tui-grid/dist/tui-grid.css';
import Grid from '@/Grid.vue';
import { computed, onMounted, reactive, ref } from 'vue';
import PurchaseService from '@/service/PurchaseService';
import MemberCardService from '@/service/MemberCardService';
import PurchaseMethodService from '@/service/PurchaseMethodService';
import store from '@/store/state';

export default {
  components: {
    grid: Grid,
  },
  methods: {
    onCheck(ev) {
      console.log('check event: ', ev);
    },
    onUnCheck(ev) {
      console.log('uncheck event: ', ev);
    },
    onDbClick(ev) { 
      console.log('uncheck event: ', ev);
      this.modifiyRow();
    }
  },
  setup() {
    onMounted(async () => {
      await memberCardService.selectListByItems()
        .then(data => {
          memberCardDatas.value = data;
        })
      await purchaseMethodService.selectListByItems()
        .then(data => {
          purchaseMethodDatas.value = data;
        })

      // const grid = gridRef.value.gridInstance();
      // grid.on('check', onCheck);
    });
    const userSeq = computed(() => store.state.module.userSeq);
    const search = () => {
      purchaseService.selectList()
        .then((data) => {
          const grid = gridRef?.value?.gridInstance();

          grid?.resetData(data);
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
      visible.value = true;
    }

    const modifiyRow = () => {
      const grid = gridRef.value.gridInstance();
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
          if(each != 'mbSeq' & each != 'pcDate' & each != 'pcTime') {
            appendRowData.value[each] = String(selectedRow[each]);
          } else if(each == 'pcDate' || each == 'pcTime') {
            const dateTime = new Date(selectedRow['pcDatetime']);
            appendRowData.value[each] = dateTime;
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
       * @type {Date}
       */
      const pcTime = appendRowData.value.pcTime;

      if(pcDate != null && pcTime != null) {
        const year = String(pcDate.getFullYear()).padStart(4, '0');
        const month = String(pcDate.getMonth()+1).padStart(2, '0');
        const date = String(pcDate.getDate()).padStart(2, '0');
        const hours = String(pcTime.getHours()).padStart(2, '0');
        const minutes = String(pcTime.getMinutes()).padStart(2, '0');
        const seconds = String(pcTime.getSeconds()).padStart(2, '0');
        // const milliseconds = String(pcTime.getMilliseconds()).padStart(3, '0');

        appendRowData.value.pcDatetime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
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
      pcTime: null,
      pcRemark: null,
    });
    const purchaseService = new PurchaseService();
    const memberCardService = new MemberCardService();
    const purchaseMethodService = new PurchaseMethodService();
    const memberCardDatas = ref([]);
    const purchaseMethodDatas = ref([]);
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
      data: [],
      myTheme: "default",
      options: {
        rowHeaders: ['rowNum', 'checkbox'],
      },
    });
    return {
      gridProps, gridRef, appendRow, save, search, deleteRows, listItems,
      visible,
      appendRowData,
      memberCardDatas,
      purchaseMethodDatas,
      userSeq,
      modifiyRow,
      newRow,
      // onCheck,
    }
  },
};
</script>
<style>
@import 'https://uicdn.toast.com/tui-grid/latest/tui-grid.css';
</style>