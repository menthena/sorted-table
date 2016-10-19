require('../es6/StreamedDataTable');

describe('StreamedDataTable', () => {
  const streamedDataTable = new StreamedDataTable();

  describe('Constructor', () => {
    it('should create the base table', () => {
      expect(streamedDataTable.dataTable).not.to.be.undefined;
    });

    it('should add metadata for the data table', () => {
      streamedDataTable
        .addMetaData({ mapData: 'name', title: 'Name' })
        .addMetaData({ mapData: 'bestBid', title: 'Best bid' })
        .addMetaData({ mapData: 'bestAsk', title: 'Best ask' });

      expect(streamedDataTable.metadata.length).to.equal(3);
    });

    it('should add headers based on metadata', () => {
      streamedDataTable.addHeaders();
      expect(streamedDataTable.dataTable.table.querySelectorAll('th').length).to.equal(3);
    });
  });

  describe('Update', () => {
    it('should select a data by its name', () => {
      const selectedData = streamedDataTable.select('usdjpy');
      expect(selectedData.activeDataIdentifier).to.equal('usdjpy');
    });

    it('should update the data by the stream', () => {
      const selectedData = streamedDataTable.select('usdjpy');
      expect(selectedData.activeDataIdentifier).to.equal('usdjpy');
      selectedData.update({
        name: 'usdjpy',
        bestBid: 100,
        bestAsk: 150
      });
      expect(streamedDataTable.mapData.hasOwnProperty('usdjpy')).to.be.true;
    });

    it('should save the best bid value within map data', () => {
      expect(streamedDataTable.mapData.usdjpy.bestBid).to.equal(100);
    });

    it('should replace the current value with new', () => {
      streamedDataTable.select('usdjpy')
                       .update({
                         name: 'usdjpy',
                         bestBid: 101,
                         bestAsk: 120
                       });
      expect(streamedDataTable.mapData.usdjpy.bestBid).to.equal(101);
    });

    describe('Sparklines', () => {
      const newStreamDataTable = new StreamedDataTable();

      newStreamDataTable.addMetaData({ mapData: 'name', title: 'Name' })
        .addMetaData({ mapData: 'bestBid', title: 'Best bid' })
        .addMetaData({ mapData: 'bestAsk', title: 'Best ask' });


      it('should save the old data for sparklines', () => {
        newStreamDataTable.select('usdjpy').update({
          name: 'usdjpy',
          bestBid: 100,
          bestAsk: 150
        })
        newStreamDataTable.updateSparkline({
          name: 'usdjpy',
          bestBid: 100,
          bestAsk: 150
        });
        expect(newStreamDataTable.mapData.usdjpy.sparkline).not.to.be.undefined;
        expect(newStreamDataTable.mapData.usdjpy.sparkline.length).to.equal(2);
        newStreamDataTable.dataTable.destroy();
      });

      it('should calculate the sparkline value based on bestBid and bestAsk', () => {
        newStreamDataTable.select('usdjpy').update({
          name: 'usdjpy',
          bestBid: 300,
          bestAsk: 300
        });
        expect(newStreamDataTable.mapData.usdjpy.sparkline[2]).to.equal(300);
      });

      it('should not save it more than 5 within sparkline data', () => {
        newStreamDataTable.updateSparkline({
          name: 'usdjpy',
          bestBid: 100,
          bestAsk: 150
        });
        newStreamDataTable.updateSparkline({
          name: 'usdjpy',
          bestBid: 100,
          bestAsk: 150
        });
        newStreamDataTable.updateSparkline({
          name: 'usdjpy',
          bestBid: 120,
          bestAsk: 150
        });
        newStreamDataTable.updateSparkline({
          name: 'usdjpy',
          bestBid: 100,
          bestAsk: 150
        });
        newStreamDataTable.updateSparkline({
          name: 'usdjpy',
          bestBid: 100,
          bestAsk: 150
        });
        newStreamDataTable.updateSparkline({
          name: 'usdjpy',
          bestBid: 100,
          bestAsk: 150
        });
        newStreamDataTable.updateSparkline({
          name: 'usdjpy',
          bestBid: 100,
          bestAsk: 150
        });
        expect(newStreamDataTable.mapData.usdjpy.sparkline.length).to.equal(5);
        expect(newStreamDataTable.mapData.usdjpy.sparkline[0]).to.equal(135);
      });

    });
  });
  streamedDataTable.dataTable.destroy();
});
