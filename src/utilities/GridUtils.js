import Grid from 'tui-grid';

export default class GridUtils {

    /**
     * Creates a new Grid instance with the given options.
     *
     * @param {import('tui-grid/types/options').OptGrid} option
     * @returns {Grid|undefined} 그리드 인스턴스입니다.
     */
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
            
            if(!(option.columns instanceof Object)) {
                alert("[컬럼] 컬럼이 객체가 아님");
                return;
            }

            option.columns.forEach(each => {
                if(!(each.align instanceof String)) {
                    each.align = 'center';
                    each.resizable = true;
                }
            })
        } else {
            alert("[컬럼] 미입력");
            return;
        }

        if(!(option.bodyHeight instanceof String || option.bodyHeight instanceof Number)) option.bodyHeight = 400;

        const grid = new Grid(option);
        return grid;
    }

    /**
     * 
     * @param {import('tui-grid/types/options').OptGrid} param 
     */
    static hello(param) {
        console.log(param);
    }
}