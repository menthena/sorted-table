/** Table Class:
  * Responsible for DOM Table creation
  * Unit tests: /test/Table.spec.js
  */


class Table {
  constructor() {
    this.createBaseTable();
  }

  createBaseTable() {
    this.table = this.createElement('table');
    document.body.appendChild(this.table);
    this.tableBody = this.createElement('tbody');
    this.table.appendChild(this.tableBody);
  }

  addHeaders(headers) {
    const thead = this.createElement('thead');
    const tr = this.createElement('tr');
    headers.forEach((header) => {
      let th = this.createElement('th');
      th.innerText = header;
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    this.table.insertBefore(thead, this.getDataContainer());
  }

  getDataContainer() {
    return this.tableBody;
  }

  addChild(child) {
    return this.getDataContainer().appendChild(child);
  }

  createElement(type) {
    return document.createElement(type)
  }

  addRows(...rows) {
    rows.forEach((rowData) => {
      const row = this.addRow(rowData);
      row.addColumns(...rowData);
    })
  }

  addRow(data) {
    const row = this.createElement('tr');
    if (data) {
      row.setAttribute('id', data[0])
    }
    this.addChild(row);
    this.activeRow = row;
    return this;
  }

  removeColumns() {
    if (this.activeRow) {
      this.activeRow.querySelectorAll('td').forEach((column) => {
        column.remove();
      });
    }
  }

  selectRowById(identifier) {
    this.activeRow = this.getDataContainer().querySelector('#' + identifier);
    return this;
  }

  selectRow(index) {
    this.activeRow = this.getDataContainer().querySelector('tr:nth-child(' + (index + 1) + ')');
    return this;
  }

  updateColumns(columnDataArr) {
    this.removeColumns();
    this.addColumns.apply(this, columnDataArr);
  }

  sortRows(columnIndex = 0) {
    var tableData = this.getDataContainer();
    var rowData = tableData.getElementsByTagName('tr');
    for (var i = 0; i < rowData.length - 1; i++) {
      for (var j = 0; j < rowData.length - (i + 1); j++) {
        let currentElement = rowData.item(j).getElementsByTagName('td').item(columnIndex).innerHTML;
        let nextElement = rowData.item(j + 1).getElementsByTagName('td').item(columnIndex).innerHTML;
        if (parseFloat(currentElement) > parseFloat(nextElement)) {
          tableData.insertBefore(rowData.item(j+1),rowData.item(j));
        }
      }
    }
  }

  getColumnValueFn(data) {
    switch (typeof data) {
      case 'number':
      case 'string':
        return this.text;
      case 'object':
        return this.sparkline;
    }
  }

  value(data) {
    const fn = this.getColumnValueFn(data);
    fn.call(this, data);
  }

  addColumns(...columnDataArr) {
    columnDataArr.forEach((columnData) => {
      this.addColumn().value(columnData);
    });
  }

  addColumn() {
    const column = this.createElement('td');
    this.activeColumn = column;
    return this;
  }

  text(text) {
    this.activeColumn.innerText = text;
    this.activeRow.appendChild(this.activeColumn);
    this.activeColumn = undefined;
  }

  sparkline(data) {
    const sparkline = new Sparkline(this.activeColumn)
    sparkline.draw(data);
    this.activeRow.appendChild(this.activeColumn);
    this.activeColumn = undefined;
  }

  destroy() {
    this.table.remove();
  }
}

(function() {
  window.Table = Table;
}).call(this);
