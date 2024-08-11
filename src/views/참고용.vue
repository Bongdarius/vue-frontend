<template>
    <div class="card">
        <div class="button-row flex justify-content-between flex-wrap">
            <div class="flex align-items-center justify-content-center">
                <Button label="엑셀다운로드" icon="pi pi-download" class="mr-2" @click="downloadExcel($event)"  />
                <Button label="CSV" icon="pi pi-download" class="mr-2" @click="exportCSV($event)"  />
            </div>
            <div class="flex align-items-center justify-content-center">
                <Button label="조회" icon="pi pi-search" class="p-button-success mr-2" @click="btnAct('SEARCH')" />
                <Button label="신규" icon="pi pi-pencil" class="p-button-success mr-2" @click="btnAct('NEW')" />
                <Button label="저장" icon="pi pi-save" class="p-button-success mr-2" @click="btnAct('SAVE')" />
                <Button label="삭제" icon="pi pi-trash" class="p-button-danger mr-2" @click="btnAct('DELETE')" />
            </div>
        </div>
        <Toolbar>
            <template #start>
                <div class="grid">
                    <div class="p-field p-float-label m-2">
                        <Dropdown id="contracts" v-model="searchMeasureParams.contractId" :options ="contracts" optionLabel="contractNm" optionValue="id" :showClear="true" style="width: 20rem" @change="getMeasureSno()"/>
                        <label for="contracts">사업명</label>
                    </div>
                    <div class="p-field p-float-label m-2">
                        <Dropdown ref="drop" id="measureSnos" v-model="searchParams.measureId" :options ="measureSnos" optionLabel="measureNm" optionValue="id" :showClear="true" style="width: 20rem" @change="btnAct('SEARCH')"/>
                        <label for="measureSnos">측정차수</label>
                    </div>
                </div>
            </template>

            <template #end>
                
            </template>
        </Toolbar>
        <tui-grid 
            ref="gridRef"
            :data="gridProps.data"
            :columns="gridProps.columns"
            :options="gridProps.options"
            :theme="gridProps.myTheme"
            :bodyHeight="690"
            :rowHeight="30"
            :minRowHeight="30"
            @check="onCheck"
            @uncheck="onUnCheck"
            :columnOptions="gridProps.columnOptions"
            ></tui-grid>
    </div>
</template>

<script>
import "tui-grid/dist/tui-grid.css";
// import Grid from '@/components/Grid.vue';
import { ref, onMounted, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from "primevue/useconfirm";
import WeightService from '@/service/pm/ind/WeightService';
import ContractService from '@/service/bz/ContractService';
import CodeService from '@/service/cm/CodeService';
import MeasureSnoService from '@/service/pm/MeasureSnoService';
// import JsUtils from '@/utilities/JsUtils';
import InputNumber from 'primevue/inputnumber';
// import { RowNumberRenderer } from '@/components/RowNumberRenderer'
// import Dropdown from 'primevue/dropdown';
import { PrimeInputEditor } from '@/components/PrimeInputEditor';
// import { PrimeDropdownEditor } from '@/components/PrimeDropdownEditor';

export default {
    // components: {
    //     grid: Grid,
    // },
    setup() {
        onMounted(async () => {
            console.log(drop);

            await constractService.selectList()
                .then(data => contracts.value = data);
            codeService.selectList({upCode:'IND_GB'})
                .then(data=> {
                    // gridProps.columns[4].editor.options.listItems = data;
                    gridProps.columns.find(obj => obj.name == "indCd").editor.options.listItems = data;
                    gridRef.value.invoke("setColumns", gridProps.columns);
                });

            if(contracts.value.length < 1) return;
            searchMeasureParams.contractId = contracts.value[0].id;
            getMeasureSno();
        })
        const drop = ref(null);
        const codeService = new CodeService();
        const constractService = new ContractService();
		const weightService = new WeightService();
        const measureSnoService = new MeasureSnoService();
        const toast = useToast();
        const gridRef = ref(null);
        const contracts = ref([]);
        const measureSnos = ref([]);
        // const indGbs = ref([]);
        const confirm = useConfirm();
        const searchMeasureParams = reactive({contractId:null});
        const searchParams = reactive({measureId:null});
        const btnAct = (_act) =>
        {
            switch(_act)
            {
                case "SEARCH":
                    if(searchParams.measureId === null) {
                        toast.add({severity:'warn', summary:'필수입력 확인', detail:'측정차수를 선택해주세요.', life:2000});
                        gridRef.value.invoke("resetData", []);
                        return;
                    }  
                    searchList();
                    break;
                case "NEW":
                    appendRow();
                    break;
                case "SAVE":
                    save();
                    break;

                case "DELETE":
                    confirmDeleteList();
                    // deleteRows();
                    break;    

                default:
                    break;
            }
        }

        //측정 차수 가져오기
        const getMeasureSno = () => {
            if(searchMeasureParams.contractId == null) {
                searchParams.measureId = null;
                btnAct("SEARCH");
            }

            measureSnoService.selectList(searchMeasureParams)
            .then(data => {
                measureSnos.value = data;

                if(measureSnos.value.length < 1) return ;
                searchParams.measureId = measureSnos.value[0].id;
                btnAct("SEARCH");
            });
        }

        /**
         * 목록을 조회한다
         */
        const searchList = () => {
            weightService.selectList(searchParams).then((data) => {
                gridRef.value.invoke("resetData", data);
            });
			return;
        };

        /**
         * 토스트그리드
         * 신규 행을 추가해주는 함수.
         */
        const appendRow = () => {
            let temp;
            measureSnos.value.forEach(each => {
                if(searchParams.measureId == each.id) {
                    temp = each;
                }
            });

            gridRef.value.invoke("appendRows", [{id: null, measureId:temp.id, measureSno:temp.measureSno, measureNm:temp.measureNm, indCd:null, weight:null, remark:null}]);
        }

        /**
         * 토스트그리드 
         * 신규 + 수정된 행 저장해주는 함수
         */
        const save = () => {
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
                toast.add({severity:'error', summary: '실패', detail: "입력 값을 다시 확인해주세요.\n성과지표(중복 저장 불가)\n가중치(0이상, 100 이하)", life: 3000});
                return;
            }

            weightService.saveList(saveRows)
                .then(data => {
                    if(data) toast.add({severity:'success', summary: '성공', detail: '저장 되었습니다', life: 3000});
                    searchList();
                })
                .catch(e => {
                    toast.add({severity:'error', summary: '저장 오류', detail: e.message, life: 3000});	
                })
        }

        /**
         * 토스트그리드
         * 행 삭제해주는 함수
         */
        const deleteRows = () => {
            const checkedIdxList = gridRef.value.invoke("getCheckedRowKeys");
            //행을 화면상에서 삭제 후 삭제 상태로 만듦
            gridRef.value.invoke("removeRows", checkedIdxList);

            //삭제상태인 행을 삭제
            const modifiedRows = gridRef.value.invoke("getModifiedRows");
            const deletedRows = modifiedRows.deletedRows;
            if(deletedRows.length > 0) {
                weightService.deleteList(deletedRows)
                    .then(data => {
                        if(data === 1) toast.add({severity:'success', summary: '성공', detail: '삭제 되었습니다', life: 3000});
                        searchList();
                    })
                    .catch(e => {
                        toast.add({severity:'error', summary: '삭제 오류', detail: e.message, life: 3000});	
                    })
            }
        }

        const confirmDeleteList = () =>{
            const checkedIdxList = gridRef.value.invoke("getCheckedRowKeys");
            confirm.require({
                message:`성과지표별가중치 ${checkedIdxList.length}건을 삭제하시겠습니까?`,
                header: '성과지표별가중치 삭제',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    deleteRows();
                },
                reject: () => {
                    toast.add({severity:'error', summary:'취소', life: 3000});
                }
            })
        }

        const gridProps = reactive({
            columnOptions: {
                resizable: true,
                frozenCount: 1,
            },
            columns: [
                {
                    header: "ID", //0
                    name: "id",
                    width: 80,
                },
                {
                    header: "측정차수일련번호", //1
                    name: "measureId",
                    hidden: true,
                },
                {
                    header: "측정차수", //2
                    name: "measureSno",
                    hidden: true,
                },
                {
                    header: "측정차수명", //3
                    name: "measureNm",
                    width: 100,
                },
                {
                    header: '성과지표', //4
                    name: 'indCd',
                    formatter: 'listItemText',
                    editor: {
                        type: 'select',
                        options: {
                        listItems: []
                        }
                    },
                    validation: {
                        required: true
                    }
                },
                {
                    header: "가중치", //5
                    name: "weight",
                    editor: "text",
                    validation: {
                        required: true
                        , dataType: "number"
                        , min: 0
                        , max: 100
                    },
                    width: 200,
                },
                {
                    header: "비고", //6
                    name: "remark",
                    editor: "text",
                },        
                {
                    header: '커스텀에디터',
                    name: 'cuEditor',
                    editor: {
                        type: PrimeInputEditor,
                        options: {
                        }
                    }
                },
            ],
            data: [],
            myTheme: "default",
            options: {
                rowHeaders: ["rowNum", "checkbox"],
            },
        });        

        return { 
            searchParams, gridProps, gridRef,
            contracts, measureSnos,
            btnAct,  
            constractService, 
            // indGbs, 
            searchMeasureParams, 
            getMeasureSno, 
            InputNumber, 
            appendRow,
            save,
            deleteRows,
            confirmDeleteList,
        }
    }
}
</script>

<style lang="scss" scoped>
.table-header {
    display: flex;
    align-items : center;
    justify-content: space-between;

    @media screen and (max-width: 960px) {
        align-items: start;
	}
}
b{
    font-size: 30px;
}

.code-image {
    width: 50px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .code-image {
    width: 50px;
    margin: 0 auto 2rem auto;
    display: block;
}

.confirmation-content {
    display: flex;
    justify-content: center;
}
@media screen and (max-width: 960px) {
	::v-deep(.p-toolbar) {
		flex-wrap: wrap;
        
		.p-button {
            margin-bottom: 0.25rem;
        }
	}
}
</style>
