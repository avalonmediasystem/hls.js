import TSDemuxer from '../../../src/demux/tsdemuxer.js';

const sinon = require('sinon');

describe('probe', function () {
  it('should return true if it contains required TS packets at beginning of fragment', function () {
    const data = new Uint8Array(new ArrayBuffer(1000));
    data[0] = 0x47; // sync byte
    data[188] = 0x47; // sync byte
    data[376] = 0x47; // sync byte
    data[564] = 0x47; // sync byte
    data[752] = 0x47; // sync byte
    data[940] = 0x47; // sync byte
    expect(TSDemuxer.probe(data)).to.be.true;
  });

  it('should return true if it contains required TS packets in first 1000 bytes', function () {
    const data = new Uint8Array(new ArrayBuffer(1000));
    data[300] = 0x47; // sync byte
    data[488] = 0x47; // sync byte
    data[676] = 0x47; // sync byte
    data[864] = 0x47; // sync byte
    expect(TSDemuxer.probe(data)).to.be.true;
  });

  it('should return false if it contains some but not all required TS packets', function () {
    const data = new Uint8Array(new ArrayBuffer(1000));
    data[300] = 0x47; // sync byte
    data[488] = 0x47; // sync byte
    expect(TSDemuxer.probe(data)).to.be.false;
  });

  it('should return false if it contains the sync bytes without required TS packets', function () {
    const data = new Uint8Array(new ArrayBuffer(1000));
    data[112] = 0x47; // sync byte
    data[300] = 0x47; // sync byte
    data[488] = 0x47; // sync byte
    data[676] = 0x10; // sync byte
    data[864] = 0xFF; // NOT sync byte
    expect(TSDemuxer.probe(data)).to.be.false;
  });
});
