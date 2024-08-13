<template>
  <div ref="tuiGrid"></div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Grid from 'tui-grid';

export default {
  name: 'TuiGrid',
  props: {
    bodyHeight: {
      type: [String, Number],
      default: 400
    },
    width: {
      type: [String, Number],
      default: 'auto'
    },
    data: {
      type: [Array, Object],
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    draggable: {
      type: Boolean,
      defalt: false,
    },
    scrollX: {
      type: Boolean,
      defalt: true,
    },
    scrollY: {
      type: Boolean,
      defalt: true,
    },
  },
  setup(props, { emit, attrs }) {
    const tuiGrid = ref(null);
    let gridInstance_ = ref;

    onMounted(() => {
      const options = {
        ...props.options,
        ...attrs,
        el: tuiGrid.value,
        data: props.data,
        columns: props.columns,
        bodyHeight: props.bodyHeight,
        width: props.width,
        draggable: props.draggable,
        scrollX: props.scrollX,
        scrollY: props.scrollY,
      };

      gridInstance_ = new Grid(options);
      addEventListeners();
    });

    onBeforeUnmount(() => {
      if (gridInstance_) {
        removeEventListeners();
        gridInstance_.destroy();
        gridInstance_ = null;
      }
    });

    const addEventListeners = () => {
      // 특정 이벤트를 명시적으로 처리하도록 수정
      const events = [
        'click', 
        'dblclick', 
        'mouseover', 
        'mouseout', 
        'check',
        'uncheck',
        // 필요한 이벤트를 여기에 추가하세요
      ];
      events.forEach((eventName) => {
        gridInstance_.on(eventName, (...args) => emit(eventName, ...args));
      });
    };

    const removeEventListeners = () => {
      const events = [
        'click', 
        'dblclick', 
        'mouseover', 
        'mouseout', 
        // 필요한 이벤트를 여기에 추가하세요
      ];
      events.forEach((eventName) => {
        gridInstance_.off(eventName);
      });
    };

    const getRootElement = () => {
      return tuiGrid.value;
    };

    const invoke = (methodName, ...args) => {
      return typeof gridInstance_[methodName] === 'function' ? gridInstance_[methodName](...args) : null;
    };

    const gridInstance = () => gridInstance_;

    return {
      tuiGrid,
      getRootElement,
      invoke,
      gridInstance_,
      gridInstance,
    };
  },
};
</script>

<style scoped>
/* 스타일은 필요에 따라 추가합니다 */
</style>
