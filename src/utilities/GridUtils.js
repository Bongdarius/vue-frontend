import Grid from 'tui-grid';

export default class GridUtils {

    /**
     * @param {import('tui-grid/types/options').OptGrid} option
     * @returns {Promise<Grid>}
     */
    static createGrid = (option) => {
        if(!(option.el instanceof HTMLElement)) {
            const gridEl = document.getElementById('grid');
            if(!gridEl) {
                alert("[엘리먼트] 엘리먼트 없음");
                return;
            }
            option.el = gridEl;
            option.el.style.margin = '10px';
            option.el.style.border = '1px solid gray';
        } else {
            option.el.style.margin = option.el.style.margin || '10px';
            option.el.style.border = option.el.style.border || '1px solid gray';
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
                    // each.resizable = true;
                }
            })
        } else {
            alert("[컬럼] 미입력");
            return;
        }
        
        if(!(option.columnOptions instanceof Object)) {
            option.columnOptions = {
                frozenCount: 1,
                resizable: true,
            }
        }

        if(!(option.bodyHeight instanceof String || option.bodyHeight instanceof Number)) option.bodyHeight = 400;

        if(!(option.rowHeaders instanceof Array)) {
            option.rowHeaders = ['rowNum', 'checkbox'];
        }

        const grid = new Grid(option);

        return new Promise(resolve => {
            resolve(grid);
        })
    }

    /**
     * @param {Grid} grid 
     * @param {import('tui-grid/types/options').OptColumn[]} columns 
     */
    static appendColumns = (grid, columns) => {
        if(!(grid instanceof Grid)) {
            alert("[그리드] 그리드 인스턴스가 없습니다.");
            return;
        }

        if(!(columns instanceof Array)) {
            alert("[컬럼] 컬럼 배열이 없습니다.");
            return;
        } else {
            if(columns.length < 1) {
                alert("[컬럼] 컬럼 배열이 없습니다.");
                return;
            } else {
                columns.forEach(each => {
                    if(!(each instanceof Object)) {
                        alert("[컬럼] 객체가 아닙니다.");
                        return;
                    }
                })
            }
        }

        const allColumns = grid.getColumns();

        for(let i = 0; i < allColumns.length; i++) {
            if('baseWidth' in allColumns[i])  {
                allColumns[i]['width'] = allColumns[i]['baseWidth'];
            }

            const isExist = columns.some(column => column.name === allColumns[i].name);
            if(isExist) {
                alert("[컬럼] 이미 존재하는 컬럼입니다.");
                return;
            }
        }

        const concatedColumns = allColumns.concat(columns);

        try {
            grid.setColumns(concatedColumns);
        } catch(e) {
            alert(e.message);
        }
    }

    /**
     *  @param {Grid} grid
     *  @param {String} name
     *  @param {Object[]} listItems
     */
    static addListItems = (grid, name, listItems) => {
        if(!((grid instanceof Grid) && (['string'].includes(typeof name)) && (listItems instanceof Array))) {
            alert("[콤보박스] 인자를 다시 확인해주세요.");
            return;
        }

        /**
         * @type {import('tui-grid').ColumnInfo[]}
         */
        const allColumns = grid.store.column.allColumns;
        allColumns.find(column => column.name === name).editor.options.listItems = listItems;
    }
}