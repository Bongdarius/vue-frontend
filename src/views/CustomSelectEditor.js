class CustomSelectEditor {
  constructor(props) {
    const el = document.createElement('select');
    el.style.flex = '1';

    const items = props.columnInfo.editor.options.listItems;


    items.forEach(item => {
      const option = document.createElement('option');
      option.value = item.value;
      option.textContent = item.text;

      el.appendChild(option);
    });

    el.value = String(props.value);

    this.el = el;
  }

  getElement() {
    return this.el;
  }

  getValue() {
   return String(this.el.value);
  }

  mounted() {
    this.el.focus();
  }
}

export { CustomSelectEditor };
