import Grid from 'tui-grid';

export default class GridUtils {
    static hello = () => {
        console.log("hello")
    }

    static createGrid = (option) => {
        console.log(option);
        const grid = new Grid({
            el: document.getElementById('grid'),
            data: [],
            columns: [
                {
                    header: 'ID',
                    name: 'id'
                },
                {
                    header: '이름',
                    name: 'name'
                },
            ],
            bodyHeight: 500,
        });
        return grid;
    }
}

