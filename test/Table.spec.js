window.Sparkline = function() {
  return {
    draw: function() {
    }
  }
}
require('../es6/Table');

describe('Table', () => {
  describe('Create base table', () => {

    it('should create a base table', () => {
      const table = new Table();
      expect(document.querySelectorAll('table').length).not.to.equal(0);
      table.destroy();
    });

    it('should be able to destroy table', () => {
      const table = new Table();
      table.destroy();
      expect(document.querySelectorAll('table').length).to.equal(0);
    });

    it('should handle to create more than one table', () => {
      const table1 = new Table();
      const table2 = new Table();
      expect(document.querySelectorAll('table').length).to.equal(2);
      table1.destroy();
      table2.destroy();
    });
  });

  describe('Create headers', () => {
    it('should create headers for the table', () => {
      const table = new Table();
      table.addHeaders(['Header 1', 'Header 2', 'Header 3']);
      expect(document.querySelectorAll('table th').length).to.equal(3);
      expect(document.querySelectorAll('table th')[0].innerText).to.equal('Header 1');
      table.destroy();
    });
  });

  describe('Create rows', () => {
    it('should be able to add rows', () => {
      const table = new Table();
      const row = table.addRow();
      expect(document.querySelectorAll('table tr').length).to.equal(1);
      expect(row).not.to.be.undefined;
      expect(table.activeRow).not.to.be.undefined;
      table.destroy();
    });
  });

  describe('Create columns', () => {
    it('should be able to add columns', () => {
      const table = new Table();
      const row = table.addRow();
      expect(table.activeColumn).to.be.undefined;
      const column = row.addColumn();
      expect(table.activeColumn).not.to.be.undefined;
      expect(column).not.to.be.undefined;
      table.destroy();
    });

    it('should be able to add text columns', () => {
      const table = new Table();
      const row = table.addRow();

      row.addColumn()
         .value('Text column');

      expect(document.querySelectorAll('table td').length).to.equal(1);
      expect(document.querySelector('table td').innerText).to.equal('Text column');
      expect(table.activeColumn).to.be.undefined;
      table.destroy();
    });

    it('should be able to add sparklines columns', () => {
      const table = new Table();
      const row = table.addRow();

      row.addColumn()
         .value([0, 1, 2]);

      expect(document.querySelectorAll('table td').length).to.equal(1);
      expect(table.activeColumn).to.be.undefined;
      table.destroy();
    });
  });

  describe('Data', () => {
    let table;
    beforeEach(() => { table = new Table() });
    afterEach(() => { table.destroy() });

    describe('Add multiple columns', () => {
      it('should be able to add text columns by identifying its type', () => {
        const row = table.addRow();
        row.addColumns('Text Column 1', 'Text Column 2')
        expect(document.querySelectorAll('table td').length).to.equal(2);
        expect(document.querySelector('table td:first-child').innerText).to.equal('Text Column 1');
        expect(document.querySelector('table td:nth-child(2)').innerText).to.equal('Text Column 2');
      });

      it('should be able to add sparklines column by identifying its type', () => {
        const row = table.addRow();
        row.addColumns('Text Column 1', 'Text Column 2', [0, 1, 2])
        expect(document.querySelectorAll('table td').length).to.equal(3);
        expect(document.querySelector('table td:first-child').innerText).to.equal('Text Column 1');
        expect(document.querySelector('table td:nth-child(2)').innerText).to.equal('Text Column 2');
        expect(document.querySelector('table td:nth-child(3)')).not.to.be.null;
      });
    });

    describe('Multiple rows', () => {
      it('should be able to add multiple rows', () => {
        table.addRows([], []);
        expect(document.querySelectorAll('table tr').length).to.equal(2);
      });

      it('should be able to add columns to the rows', () => {
        table.addRows(['Text column 1', 'Text column 2'], ['Row 2', [0, 1]]);
        expect(document.querySelectorAll('table td').length).to.equal(4);
        expect(document.querySelector('table td:first-child').innerText).to.equal('Text column 1');
        expect(document.querySelector('table tr:last-child td:first-child').innerText).to.equal('Row 2');
      });
    });

    describe('Update / sort rows', () => {
      it('should be able to select a certain row', () => {
        table.addRows(['text', 'text'], []);
        table.selectRow(0);
        expect(table.activeRow).not.to.be.undefined;
      });

      it('should get the type of the data', () => {
        const fn = table.getColumnValueFn('string');
        expect(fn.name).to.equal('text');
      });

      it('should get the type of the data when it is an array', () => {
        const fn = table.getColumnValueFn([0, 1]);
        expect(fn.name).to.equal('sparkline');
      });

      it('should get the type of the data when it is an array', () => {
        const row = table.addRow();

        row.addColumn()
           .value('Text column');

        expect(document.querySelectorAll('table td').length).to.equal(1);
        expect(document.querySelector('table td').innerText).to.equal('Text column');
      });

      it('should be able to update a certain row', () => {
        table.addRows(['text', 'text'], []);
        expect(document.querySelector('table td:first-child').innerText).to.equal('text');
        table.selectRow(0).updateColumns(['new text', 'new text']);
        expect(document.querySelector('table td:first-child').innerText).to.equal('new text');
      });

      it('should be able to sort', () => {
        table.addRows(['0', '1st'], ['155', '2nd'], ['255', '3rd'], ['15', '4th']);
        expect(document.querySelector('table td:first-child').innerText).to.equal('0');
        table.sortRows();
        expect(document.querySelector('table tr:nth-child(1) td:first-child').innerText).to.equal('0');
        expect(document.querySelector('table tr:nth-child(2) td:first-child').innerText).to.equal('15');
        expect(document.querySelector('table tr:nth-child(3) td:first-child').innerText).to.equal('155');
        expect(document.querySelector('table tr:nth-child(4) td:first-child').innerText).to.equal('255');
      });

      it('should be able to sort after a new row is added', () => {
        table.addRows(['0', '1st'], ['155', '2nd'], ['255', '3rd'], ['15', '4th']);
        table.sortRows();
        table.addRows(['66', '5th']);
        expect(document.querySelector('table tr:nth-child(5) td:first-child').innerText).to.equal('66');
        table.sortRows();
        expect(document.querySelector('table tr:nth-child(1) td:first-child').innerText).to.equal('0');
        expect(document.querySelector('table tr:nth-child(2) td:first-child').innerText).to.equal('15');
        expect(document.querySelector('table tr:nth-child(3) td:first-child').innerText).to.equal('66');
        expect(document.querySelector('table tr:nth-child(4) td:first-child').innerText).to.equal('155');
        expect(document.querySelector('table tr:nth-child(5) td:first-child').innerText).to.equal('255');
      });

      it('should be able to sort different column', () => {
        table.addRows(['1st', '1000'], ['2nd', '50'], ['3rd', '20']);
        table.sortRows(1);
        expect(document.querySelector('table tr:nth-child(1) td:first-child').innerText).to.equal('3rd');
        expect(document.querySelector('table tr:nth-child(2) td:first-child').innerText).to.equal('2nd');
        expect(document.querySelector('table tr:nth-child(3) td:first-child').innerText).to.equal('1st');
      });
    });
  });
});
