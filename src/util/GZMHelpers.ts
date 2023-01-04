// TODO
type Input = {
  digital: number;
  analogX: number;
  analogY: number;
  padDelta?: number;
};

// TODO
type Seed = {
  frame: number;
  oldSeed: number;
  newSeed: number;
};

type GZM = {
  filename?: string; // TODO
  totalInputs: number;
  totalSeeds: number;
  startingInput?: Input;
  inputs?: Input[];
  seeds?: Seed[];
  nOcaInput: number;
  nOcaSync: number;
  nRoomLoad: number;
  rerecords: number;
  lastRecordedFrame: number;
};

const N_INPUT_ADDR = 0;
const N_SEED_ADDR = 0x4;
// const STARTING_INPUT_ADDR = 0x8; // TODO
const INPUTS_ADDR = 0xc;
const INPUT_LENGTH = 0x6;
const SEED_LENGTH = 0xc;
const N_OCA_INPUT_OFFSET = 0;
const N_OCA_SYNC_OFFSET = 0x4;
const N_ROOM_LOAD_OFFSET = 0x8;
const RERECORDS_OFFSET = 0xc;
const LAST_RECORDED_FRAME_OFFSET = 0x10;

export const getGZM = (bytes: DataView): GZM => {
  const totalInputs = bytes.getUint32(N_INPUT_ADDR);
  const totalSeeds = bytes.getUint32(N_SEED_ADDR);
  const seedsAddr = INPUTS_ADDR + totalInputs * INPUT_LENGTH;
  const metaAddr = seedsAddr + totalSeeds * SEED_LENGTH;
  return {
    totalInputs,
    totalSeeds,
    nOcaInput: bytes.getUint32(metaAddr + N_OCA_INPUT_OFFSET),
    nOcaSync: bytes.getUint32(metaAddr + N_OCA_SYNC_OFFSET),
    nRoomLoad: bytes.getUint32(metaAddr + N_ROOM_LOAD_OFFSET),
    rerecords: bytes.getUint32(metaAddr + RERECORDS_OFFSET),
    lastRecordedFrame: bytes.getUint32(metaAddr + LAST_RECORDED_FRAME_OFFSET)
  };
};
