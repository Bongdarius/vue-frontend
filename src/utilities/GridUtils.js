import Grid from 'tui-grid';

export default class GridUtils {

    static createGrid = (option) => {
        if(!(option.el instanceof HTMLElement)) {
            const gridEl = document.getElementById('grid');
            if(!gridEl) {
                alert("[엘리먼트] 엘리먼트 없음");
                return;
            }
            option.el = gridEl;
        }

        if(!(option.data instanceof Array)) {
            option.data = [];
        }

        if((option.columns instanceof Array)) {
            if(option.columns.length < 1) {
                alert("[컬럼] 배열의 크기가 1 미만");
                return;
            }
            
            if(!(option.columns[0] instanceof Object)) {
                alert("[컬럼] 컬럼이 객체가 아님");
                return;
            }
        } else {
            alert("[컬럼] 미입력");
            return;
        }

        const grid = new Grid(option);
        return grid;
    }
}