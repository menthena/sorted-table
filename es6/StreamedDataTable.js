require('./Table')

/** To able to test easily, I separated `data` from `UI`
  * and tested them in isolation. Streamed Data Table basically
  * transforms the data and passes to Table Class to generate UI elements
  * Because of the abstraction, the Table Class can be used anywhere to generate UI
  * elements not just with StreamedDataTable.
  *
  * Unit tests: /test/StreamedDataTable.spec.js
  */


class StreamedDataTable {
  constructor() {
    this.dataTable = new Table();
    this.metadata = [];
    this.mapData = [];
  }

  addMetaData(metadata) {
    this.metadata.push(metadata);
    return this;
  }

  addHeaders() {
    this.dataTable.addHeaders(this.metadata.map((data) => data.title));
  }

  select(dataIdentifier) {
    this.activeDataIdentifier = dataIdentifier;
    return this;
  }

  setSortIndex(index) {
    this.sortIndex = index;
    return this;
  }

  updateSparkline(value) {
    const identifier = this.activeDataIdentifier;
    let sparkline = this.mapData[identifier].sparkline;
    if (sparkline.length >= 5) {
      sparkline.shift();
    }
    sparkline.push((value.bestBid + value.bestAsk) / 2);
  }

  update(data) {
    const identifier = this.activeDataIdentifier;
    if (!identifier) {
      throw(`Can't call update method without active data identifier`);
    } else {
      this.mapData[identifier] = this.mapData[identifier] || {sparkline: []};
      this.metadata.forEach((_metadata) => {
        if (_metadata.mapData !== 'sparkline') {
          const value = data[_metadata.mapData];
          this.mapData[identifier][_metadata.mapData] = value;
        }
      });

      this.updateSparkline(data);
    }
    return this;
  }

  transformData(data) {
    let transformedData = [];
    this.metadata.forEach((_metadata) => {
      transformedData.push(data[_metadata.mapData]);
    });
    return transformedData;
  }

  sort() {
    if (this.sortIndex) {
      this.dataTable.sortRows(this.sortIndex);
    }
  }

  render() {
    const identifier = this.activeDataIdentifier;
    const data = this.mapData[identifier];
    if (!identifier) {
      throw(`Can't call update method without active data identifier`);
    } else {
      const row = this.dataTable.selectRowById(data.name);
      const transformedData = this.transformData(data);
      if (!row.activeRow) {
        this.dataTable.addRows(transformedData);
      } else {
        row.updateColumns(transformedData);
      }
    }
    this.sort();
  }
}

(function() {
  window.StreamedDataTable = StreamedDataTable;
}).call(this);
