import { downloadFile } from '@/util/Helpers';

type Input = {
  digital: number;
  analog: number;
};

type FullInput = Input & {
  padDelta: number;
};

type Seed = {
  frame: number;
  oldSeed: number;
  newSeed: number;
};

export type GZM = {
  filename: string;
  totalInputs: number;
  totalSeeds: number;
  startingInput: Input;
  inputs: FullInput[];
  seeds: Seed[];
  nOcaInput: number;
  nOcaSync: number;
  nRoomLoad: number;
  rerecords: number;
  lastRecordedFrame: number;
};

export class GZMError extends Error {
  constructor(m: string) {
    super(m);
    Object.setPrototypeOf(this, GZMError.prototype);
  }
}

export const EXTENSION = '.gzm';
const N_INPUT_ADDR = 0;
const N_SEED_ADDR = 0x4;
const STARTING_INPUT_ADDR = 0x8;
const INPUTS_ADDR = 0xc;
const INPUT_LENGTH = 0x6;
const SEED_LENGTH = 0xc;
const N_OCA_INPUT_OFFSET = 0;
const N_OCA_SYNC_OFFSET = 0x4;
const N_ROOM_LOAD_OFFSET = 0x8;
const RERECORDS_OFFSET = 0xc;
const LAST_RECORDED_FRAME_OFFSET = 0x10;

const getSeedsAddr = (totalInputs: number): number =>
  INPUTS_ADDR + totalInputs * INPUT_LENGTH;

const getMetaAddr = (seedsAddr: number, totalSeeds: number): number =>
  seedsAddr + totalSeeds * SEED_LENGTH;

// convert GZM file to GZM object
export const getFileAsGZM = async (file: File): Promise<GZM> => {
  if (!file.name.endsWith(EXTENSION)) {
    throw new GZMError(`Filename must end with ${EXTENSION}`);
  }
  const filename = file.name.slice(0, -EXTENSION.length);
  const bytes = new DataView(await file.arrayBuffer());

  return getBytesAsGZM(bytes, filename);
};

// convert bytes to GZM object
export const getBytesAsGZM = (bytes: DataView, filename: string): GZM => {
  const totalInputs = bytes.getUint32(N_INPUT_ADDR);
  const totalSeeds = bytes.getUint32(N_SEED_ADDR);
  const seedsAddr = getSeedsAddr(totalInputs);
  const metaAddr = getMetaAddr(seedsAddr, totalSeeds);

  const startingInput = {
    digital: bytes.getUint16(STARTING_INPUT_ADDR),
    analog: bytes.getUint16(STARTING_INPUT_ADDR + 2)
  };

  const inputs = [];
  for (let i = INPUTS_ADDR; i < seedsAddr; i += INPUT_LENGTH) {
    inputs.push({
      digital: bytes.getUint16(i),
      analog: bytes.getUint16(i + 2),
      padDelta: bytes.getUint16(i + 4)
    });
  }

  const seeds = [];
  for (let i = seedsAddr; i < metaAddr; i += SEED_LENGTH) {
    seeds.push({
      frame: bytes.getUint32(i),
      oldSeed: bytes.getUint32(i + 4),
      newSeed: bytes.getUint32(i + 8)
    });
  }

  return {
    filename,
    totalInputs,
    totalSeeds,
    startingInput,
    inputs,
    seeds,
    nOcaInput: bytes.getUint32(metaAddr + N_OCA_INPUT_OFFSET),
    nOcaSync: bytes.getUint32(metaAddr + N_OCA_SYNC_OFFSET),
    nRoomLoad: bytes.getUint32(metaAddr + N_ROOM_LOAD_OFFSET),
    rerecords: bytes.getUint32(metaAddr + RERECORDS_OFFSET),
    lastRecordedFrame: bytes.getUint32(metaAddr + LAST_RECORDED_FRAME_OFFSET)
  };
};

// convert GZM object back to bytes
export const getGZMAsBytes = (gzm: GZM): DataView => {
  const byteLength =
    INPUTS_ADDR +
    gzm.totalInputs * INPUT_LENGTH +
    gzm.totalSeeds * SEED_LENGTH +
    (LAST_RECORDED_FRAME_OFFSET + 4);
  const bytes = new DataView(new ArrayBuffer(byteLength));
  const seedsAddr = getSeedsAddr(gzm.totalInputs);
  const metaAddr = getMetaAddr(seedsAddr, gzm.totalSeeds);
  bytes.setUint32(N_INPUT_ADDR, gzm.totalInputs);
  bytes.setUint32(N_SEED_ADDR, gzm.totalSeeds);
  bytes.setUint16(STARTING_INPUT_ADDR, gzm.startingInput.digital);
  bytes.setUint16(STARTING_INPUT_ADDR + 2, gzm.startingInput.analog);
  gzm.inputs.forEach((input, index) => {
    // TODO reuse getSeedsAddr
    const offset = INPUTS_ADDR + index * INPUT_LENGTH;
    bytes.setUint16(offset, input.digital);
    bytes.setUint16(offset + 2, input.analog);
    bytes.setUint16(offset + 4, input.padDelta);
  });
  gzm.seeds.forEach((seed, index) => {
    const offset = seedsAddr + index * SEED_LENGTH;
    bytes.setUint32(offset, seed.frame);
    bytes.setUint32(offset + 4, seed.oldSeed);
    bytes.setUint32(offset + 8, seed.newSeed);
  });
  bytes.setUint32(metaAddr + N_OCA_INPUT_OFFSET, gzm.nOcaInput);
  bytes.setUint32(metaAddr + N_OCA_SYNC_OFFSET, gzm.nOcaSync);
  bytes.setUint32(metaAddr + N_ROOM_LOAD_OFFSET, gzm.nRoomLoad);
  bytes.setUint32(metaAddr + RERECORDS_OFFSET, gzm.rerecords);
  bytes.setUint32(metaAddr + LAST_RECORDED_FRAME_OFFSET, gzm.lastRecordedFrame);
  return bytes;
};

export const downloadGZM = (gzm: GZM): void => {
  const bytes = getGZMAsBytes(gzm);
  const blob = new Blob([bytes.buffer], { type: 'application/octet-stream' });
  downloadFile(blob, gzm.filename + EXTENSION);
};
