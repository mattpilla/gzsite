import { readFile } from 'fs/promises';
import { getBytesAsGZM, getGZMAsBytes } from '@/util/GZMHelpers';

const fileToBytes = async (filename: string): DataView => {
  const file = await readFile(filename);
  return new DataView(file.buffer);
};

// from https://stackoverflow.com/a/53066400
const dataViewsAreEqual = (a: DataView, b: DataView): boolean => {
  if (a.byteLength !== b.byteLength) {
    return false;
  }
  for (let i = 0; i < a.byteLength; i++) {
    if (a.getUint8(i) !== b.getUint8(i)) {
      return false;
    }
  }
  return true;
};

describe('getBytesAsGZM', () => {
  let gzm;
  beforeAll(async () => {
    const bytes = await fileToBytes('fixtures/small-macro.gzm');
    gzm = getBytesAsGZM(bytes, 'small-macro');
  });

  describe('stat', () => {
    test('filename', () => {
      expect(gzm.filename).toBe('small-macro');
    });
    test('totalInputs', () => {
      expect(gzm.totalInputs).toBe(2716);
    });
    test('totalSeeds', () => {
      expect(gzm.totalSeeds).toBe(3);
    });
    test('nOcaInput', () => {
      expect(gzm.nOcaInput).toBe(0);
    });
    test('nOcaSync', () => {
      expect(gzm.nOcaSync).toBe(0);
    });
    test('nRoomLoad', () => {
      expect(gzm.nRoomLoad).toBe(0);
    });
    test('rerecords', () => {
      expect(gzm.rerecords).toBe(999);
    });
    test('lastRecordedFrame', () => {
      expect(gzm.lastRecordedFrame).toBe(2715);
    });
  });

  describe('seeds', () => {
    it('should store seeds properly', () => {
      expect(gzm.seeds[0]).toEqual({
        frame: 59,
        oldSeed: 0x2426a1e4,
        newSeed: 0x12e76d54
      });
    });
  });

  // TODO use gzm with non-zero analog
  describe('inputs', () => {
    it('should store the starting input properly', () => {
      expect(gzm.startingInput).toEqual({
        digital: 0b0000_0100_0010_0000,
        analog: 0
      });
    });

    it('should store inputs properly', () => {
      expect(gzm.inputs[0]).toEqual({
        digital: 0b0000_0100_0000_0000,
        analog: 0,
        padDelta: 0b0000_1111_0001_0000
      });
    });
  });
});

describe('getGZMAsBytes', () => {
  let bytes;
  beforeAll(async () => {
    bytes = await fileToBytes('fixtures/small-macro.gzm');
  });
  let gzm;
  // run each time instead of once, as gzm can change
  beforeEach(() => {
    gzm = getBytesAsGZM(bytes, 'small-macro');
  });

  it('should convert directly back to its original form', () => {
    const savedBytes = getGZMAsBytes(gzm);
    expect(dataViewsAreEqual(savedBytes, bytes)).toBe(true);
  });

  it('should save any changes made to it', () => {
    gzm.rerecords = 1234;
    const savedBytes = getGZMAsBytes(gzm);
    expect(dataViewsAreEqual(savedBytes, bytes)).toBe(false);

    const newGZM = getBytesAsGZM(savedBytes);
    expect(newGZM.rerecords).toBe(1234);
  });
});
