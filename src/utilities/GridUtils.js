import Grid from 'tui-grid';

export default class GridUtils {
    /**
     * @typedef {Object} RowHeader
     * @property {'rowNum' | 'checkbox'} type - 행 헤더의 타입입니다. ('rowNum' 또는 'checkbox')
     * @property {string} header - 행 헤더에 표시될 텍스트입니다.
     * @property {number} width - 행 헤더 열의 너비입니다. 단위는 픽셀입니다. 설정되지 않으면 기본 너비가 사용됩니다.
     * @property {'left' | 'center' | 'right'} align - 행 헤더 내용의 수평 정렬입니다. ('left', 'center', 'right' 중 하나)
     * @property {'top' | 'middle' | 'bottom'} valign - 행 헤더 내용의 수직 정렬입니다. ('top', 'middle', 'bottom' 중 하나)
     * @property {function} renderer - 행 헤더 내용을 커스터마이징하기 위한 커스텀 렌더러 함수입니다.
     */

    /**
     * @typedef {Object} Column
     * @property {string} name - 컬럼의 이름입니다.
     * @property {boolean} ellipsis - 컨텐츠가 넘칠 경우 생략표시(...) 여부. (이 옵션은 곧 폐기될 예정입니다.)
     * @property {'left' | 'center' | 'right'} align - 컬럼 내용의 수평 정렬입니다.
     * @property {'top' | 'middle' | 'bottom'} valign - 컬럼 내용의 수직 정렬입니다.
     * @property {string[]} className - 컬럼의 모든 셀에 사용할 클래스 이름입니다.
     * @property {string[]} header - 헤더에 표시될 컬럼의 이름입니다.
     * @property {number} width - 컬럼의 너비 (픽셀 단위). 값이 설정되지 않으면 자동으로 조정됩니다.
     * @property {number} minWidth - 컬럼의 최소 너비 (픽셀 단위).
     * @property {boolean} hidden - true로 설정하면 컬럼이 보이지 않습니다.
     * @property {boolean} resizable - false로 설정하면 컬럼의 너비를 조정할 수 없습니다.
     * @property {Validation} validation - 컬럼 데이터의 유효성 검사 옵션입니다.
     * @property {boolean} escapeHTML - true로 설정하면 셀의 값이 HTML 엔티티로 인코딩됩니다.
     * @property {boolean} ignored - true로 설정하면 컬럼 값은 수정된 행 목록에서 무시됩니다.
     * @property {boolean} sortable - true로 설정하면 컬럼 헤더에 정렬 버튼이 표시됩니다.
     * @property {'asc' | 'desc'} sortingType - 초기 정렬 방향입니다.
     * @property {Function} comparator - 데이터 정렬을 위한 사용자 정의 비교 함수입니다.
     * @property {Function} onBeforeChange - 셀 값 변경 전 호출되는 함수입니다. 이벤트 객체의 stop() 메서드를 호출하면 변경이 취소됩니다.
     * @property {Function} onAfterChange - 셀 값 변경 후 호출되는 함수입니다.
     * @property {Editor} editor - 편집 UI를 구성하는 객체입니다.
     * @property {CopyOptions} copyOptions - 클립보드 복사 옵션 객체입니다.
     * @property {Relation[]} relations - 다른 컬럼과의 관계를 지정합니다.
     * @property {'nowrap' | 'normal' | 'pre' | 'pre-wrap' | 'pre-line'} whiteSpace - 텍스트 줄바꿈 옵션입니다. (이 옵션은 곧 폐기될 예정입니다.)
     * @property {boolean} rowSpan - true로 설정하면 동적 행 병합이 적용됩니다.
     * @property {HTMLElement} customHeader - 설정 시, 이 요소가 헤더 셀에 렌더링됩니다.
     */

    /**
     * @typedef {Object} Validation
     * @property {boolean} required=false - true로 설정하면 컬럼 데이터가 비어있지 않은지 확인합니다.
     * @property {'string' | 'number'} dataType='string' - 셀 값의 데이터 타입을 지정합니다.
     * @property {number} min - 숫자 값일 경우, 최소 값보다 커야 합니다.
     * @property {number} max - 숫자 값일 경우, 최대 값보다 작아야 합니다.
     * @property {RegExp} regExp - 정규 표현식으로 데이터가 유효한지 확인합니다.
     * @property {Function} validatorFn - 사용자 정의 유효성 검사 함수입니다.
     * @property {boolean} unique=false - true로 설정하면 데이터의 고유성을 검사합니다.
     * @property {string} defaultValue - 컬럼에 값이 없을 때 표시할 기본 값입니다.
     */

    /**
     * @typedef {Object} Editor
     * @property {'text' | 'password' | 'select' | 'radio' | 'checkbox' | Function} type - 편집 UI의 타입을 지정합니다. 커스텀 편집기를 사용할 경우, 커스텀 렌더러 생성자를 설정합니다.
     * @property {Object} options - 에디터 옵션 객체입니다.
     */

    /**
     * @typedef {Object} CopyOptions
     * @property {boolean} useFormattedValue - true로 설정하면 서식이 지정된 값을 클립보드에 복사합니다.
     * @property {boolean} useListItemText - true로 설정하면 목록 아이템의 텍스트를 복사합니다.
     * @property {Function} customValue - 클립보드에 복사할 값을 커스터마이징하는 콜백 함수입니다.
     */

    /**
     * @typedef {Object} Relation
     * @property {string[]} targetNames - 대상 컬럼들의 이름 배열입니다.
     * @property {Function} disabled - true를 반환하면 대상 컬럼들이 비활성화됩니다.
     * @property {Function} editable - true를 반환하면 대상 컬럼들이 편집 가능합니다.
     * @property {Function} listItems - 'select', 'radio', 'checkbox' 타입에 대한 옵션 목록을 반환하는 함수입니다.
     */

    /**
     * Creates a new Grid instance with the given options.
     *
     * @param {Object} option - 그리드를 생성하는 데 필요한 인자입니다.
     * @param {HTMLElement} option.el - 그리드가 생성될 element입니다.
     * @param {Array<Object>} option.data - 그리드의 데이터입니다.
     * @param {Array<Column>} option.columns - 그리드의 컬럼입니다.
     * @param {string|number} option.bodyHeight - 그리드의 높이입니다.
     * @param {RowHeader[]} option.rowHeaders - 행 헤더 설정 옵션 배열입니다.
     * @returns {Grid|undefined} 그리드 인스턴스입니다.
     */
    static createGrid = (option) => {
        if(!(option.el instanceof HTMLElement)) {
            const gridEl = document.getElementById('grid');
            if(!gridEl) {
                alert("엘리먼트 엘리먼트 없음");
                return;
            }
            option.el = gridEl;
        }

        if(!(option.data instanceof Array)) {
            option.data = [];
        }

        if((option.columns instanceof Array)) {
            if(option.columns.length < 1) {
                alert("컬럼 배열의 크기가 1 미만");
                return;
            }
            
            if(!(option.columns instanceof Object)) {
                alert("컬럼 컬럼이 객체가 아님");
                return;
            }

            option.columns.forEach(each => {
              if(!(each.align instanceof String)) {
                each.align = 'center';
              }
            })
        } else {
            alert("컬럼 미입력");
            return;
        }

        if(!(option.bodyHeight instanceof String || option.bodyHeight instanceof Number)) option.bodyHeight = 400;

        // if(!(option.draggable instanceof Boolean)) option.draggable = true;

        const grid = new Grid(option);
        return grid;
    }
}