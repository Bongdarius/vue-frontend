import Grid from 'tui-grid';

export default class GridUtils {

    static createGrid = (option) => {
        if(!(option.el instanceof HTMLElement)) {
            const gridEl = document.getElementById('grid');
            if(!gridEl) {
                alert("그리드 엘리먼트 없음.");
                return;
            }
            option.el = gridEl;
        }

        if(!(option.data instanceof Array)) {
            option.data = [];
        }

        const grid = new Grid(option);
        return grid;
    }
}

