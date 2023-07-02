import { downloadGZM, EXTENSION, type GZM } from '@/util/GZMHelpers';
import { toHex } from '@/util/Helpers';
import styled from 'styled-components';

type GZMViewPropsType = {
  gzm: GZM;
};

const Container = styled.div`
  margin: 32px;
`;

const SeedsContainer = styled.div`
  margin-left: 16px;
`;

const GZMView = (props: GZMViewPropsType) => {
  const { gzm } = props;

  const renderSeeds = () =>
    gzm.seeds.map((seed) => (
      <li key={seed.frame}>
        frame: {seed.frame}, old: {toHex(seed.oldSeed)}, new:{' '}
        {toHex(seed.newSeed)}
      </li>
    ));

  return (
    <Container>
      <button onClick={() => downloadGZM(gzm)}>Download</button>
      <li>
        filename:{' '}
        <input
          type="text"
          value={gzm.filename}
          onChange={(e) => (gzm.filename = e.target.value)}
        />
        {EXTENSION}
      </li>
      <li>n_input: {gzm.totalInputs}</li>
      <li>n_seed: {gzm.totalSeeds}</li>
      <li>n_oca_input: {gzm.nOcaInput}</li>
      <li>n_oca_sync: {gzm.nOcaSync}</li>
      <li>n_room_load: {gzm.nRoomLoad}</li>
      <li>
        rerecords:{' '}
        <input
          type="number"
          value={gzm.rerecords}
          onChange={(e) => (gzm.rerecords = Number.parseInt(e.target.value))}
        />
      </li>
      <li>last_recorded_frame: {gzm.lastRecordedFrame}</li>
      <div>
        gzm has {gzm.totalSeeds} seeds:
        <SeedsContainer>{renderSeeds()}</SeedsContainer>
      </div>
    </Container>
  );
};

export default GZMView;
