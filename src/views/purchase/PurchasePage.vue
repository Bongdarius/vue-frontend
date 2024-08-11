<template>
  <div class="container">
    <h1 @click="search">결제 내역 관리</h1>
    <div class="flex justify-end gap-2 mb-2 w-full">
      <Button label="행추가" @click="visible = true" class="flex-grow" />
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
  <Dialog v-model:visible="visible" modal header="결제 내역 추가" :style="{ width: '20rem' }">
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
import store from '@/store/state'; // store 파일 import
// import { CustomTextEditor } from '@/views/CustomTextEditor';
// import { CustomSelectEditor } from '@/views/CustomSelectEditor';

export default {
  components: {
    grid: Grid,
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

      search();
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
        const month = String(pcDate.getMonth()).padStart(2, '0');
        const date = String(pcDate.getDate()).padStart(2, '0');
        const hours = String(pcTime.getHours()).padStart(2, '0');
        const minutes = String(pcTime.getMinutes()).padStart(2, '0');
        const seconds = String(pcTime.getSeconds()).padStart(2, '0');
        const milliseconds = String(pcTime.getMilliseconds()).padStart(3, '0');

        appendRowData.value.pcDatetime = `${year}-${month}-${date}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
      }

      purchaseService.saveList([appendRowData.value])
        .then(() => {
          Object.keys(appendRowData.value).forEach(key => {
            console.log(key);
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
      pcSeq: 1,
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
        },      
        // {
        //   header: '회원 일련번호',
        //   name: 'mbSeq',
        // },
        // {
        //   header: '결제 방법 일련번호',
        //   name: 'pcmSeq',
        // },               
        {
          header: '결제 방법',
          name: 'pcmNm',
        },               
        // {
        //   header: '카드결제 일련번호',
        //   name: 'pccSeq',
        // },               
        // {
        //   header: '회원카드 일련번호',
        //   name: 'mcSeq',
        // },              
        {
          header: '카드명',
          name: 'mcNick',
        }, 
        {
          header: '결제 금액',
          name: 'pcAmt',
          editor: 'text',
          validation: {
            required: true,
            dataType: 'number',
            min: 0,
          }
        },          
        {
          header: '결제일시',
          name: 'pcDatetime',
          editor: {
            type: "datePicker",
            options: {
              format: 'yyyy-MM-dd HH:mm A',
              timepicker: true
            }
          }
        },         
        {
          header: '비고',
          name: 'pcRemark',
          editor: 'text'
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
      visible,
      appendRowData,
      memberCardDatas,
      purchaseMethodDatas,
      userSeq,
    }
  },
};
</script>
<style>
@import 'https://uicdn.toast.com/tui-grid/latest/tui-grid.css';
</style>