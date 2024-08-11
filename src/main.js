/* main.js */
/* eslint-disable vue/multi-word-component-names */
import './assets/common.css'

import 'primeflex/primeflex.min.css';
import 'primeicons/primeicons.css';
import 'prismjs/themes/prism-coy.css';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row'; 
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import AutoComplete from 'primevue/autocomplete';
import SelectButton from 'primevue/selectbutton';
import Select from 'primevue/select';
import InputNumber from 'primevue/inputnumber';

import "tui-date-picker/dist/tui-date-picker.css"; // use datepicker
import 'tui-grid/dist/tui-grid.css';
import TuiGrid from 'vue3-tui-grid';
import DatePicker from 'primevue/datepicker';

const app = createApp(App)
app.config.globalProperties.$axios = axios;  //전역변수로 설정 컴포넌트에서 this.$axios 호출할 수 있음
app.config.globalProperties.$serverUrl = '//localhost:8000' //api server
app.use(PrimeVue, { 
    ripple: true,
    locale: {
        startsWith: '다음으로 시작',
        contains: '포함',
        notContains: '포함하지 않음',
        endsWith: '다음으로 끝남',
        equals: '같음',
        notEquals: '같지 않음',
        noFilter: '필터 없음',
        lt: '미만',
        lte: '작거나 같음',
        gt: '보다 큼',
        gte: '크거나 같음',
        dateIs: '날짜입니다',
        dateIsNot: '날짜가 아닙니다',
        dateBefore: '이전 날짜',
        dateAfter: '이후 날짜',
        clear: '지우기',
        apply: '적용',
        matchAll: '모두 일치',
        matchAny: '하나 일치',
        addRule: '규칙 추가',
        removeRule: '규칙 제거',
        accept: '예',
        reject: '아니오',
        choose: '선택',
        upload: '업로드',
        cancel: '취소',
        dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
        dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
        dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
        monthNames: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
        monthNamesShort: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
        today: '오늘',
        weekHeader: '주',
        firstDayOfWeek: 0,
        dateFormat: 'yy-mm-dd',
        weak: '약함',
        medium: '중간',
        strong: '강함',
        passwordPrompt: '암호를 입력하세요',
        emptyFilterMessage: '결과가 없습니다',
        emptyMessage: '사용 가능한 옵션이 없습니다'
    }, 
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: 'system',
            cssLayer: false
        }
    }
});
app.use(router);
app.use(TuiGrid);

app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('ColumnGroup', ColumnGroup);
app.component('Row', Row);
app.component('Dialog', Dialog);
app.component('Button', Button);
app.component('InputText', InputText);
app.component('AutoComplete', AutoComplete);
app.component('SelectButton', SelectButton);
app.component('Select', Select);
app.component('InputNumber', InputNumber);
app.component('DatePicker', DatePicker);

router.isReady().then(() => {
    app.mount('#app')
});