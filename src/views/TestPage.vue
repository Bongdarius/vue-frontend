<template>
    <h1>TEST</h1>
    <div>
        {{ $t('message.welcome', { name: $t('message.name') }) }}
    </div>
    <Select v-model="data.countryCd" :options="countries" optionLabel="text" optionValue="value" :style="{width: '48%', marginRight: '2%'}" @change="changeCountry"/>
    <div :style="{ textAlign: 'right' }">
        <button :style="{ width: '120px', margin: '5px' }" @click="resetData">데이터 추가</button>
        <button :style="{ width: '100px', margin: '5px' }" @click="appendColumns">컬럼 추가</button>
    </div>
    <div id="grid"></div>
</template>
<script>
import { onMounted } from 'vue'
// eslint-disable-next-line no-unused-vars
import Grid from 'tui-grid'
import GridUtils from '@/utilities/GridUtils'
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
    setup() {
        onMounted(async () => {
            grid = await GridUtils.createGrid({
                columns: [
                    {
                        header: 'ID',
                        name: 'id',
                        width: 60,
                    },
                    {
                        header: '이름',
                        name: 'name',
                        editor: {
                            type: 'text',
                        },
                    },
                ],
            });
        })

        const { locale } = useI18n();
        
        const changeCountry = (e) => {
            locale.value = e.value; // 언어 변경
        };
        const data = ref({
            countryCd: "ko"
        });

        /**
         * @type {Grid}
         */
        let grid = null;
        const countries = [{text: "한국어", value: "ko"}, {text: "영어", value: "en"}];

        const resetData = () => {
            const dataList = [];
            for (let i = 0; i < 100000; i++) {
                dataList.push({ id: i, name: 'name' + i, sex: 'male' });
            }
            grid.resetData(dataList);

            console.log(grid);
        }

        const appendColumns = () => {
            const a = [{
                header: '성별',
                name: 'sex',
                editor: 'text',
            }];

            GridUtils.appendColumns(grid, a);

            console.log(grid.getColumns());
        }

        return {
            grid,
            data,
            resetData,
            appendColumns,
            countries,
            changeCountry,
        }
    }
}
</script>