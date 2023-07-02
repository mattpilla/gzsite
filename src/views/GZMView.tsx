import { downloadGZM, EXTENSION, type GZM } from '@/util/GZMHelpers';
import { toHex } from '@/util/Helpers';
import { useState } from 'react';
import Button from '@/components/Button';
import styled from 'styled-components';
import TextInput from '@/components/TextInput';

const Container = styled.div`
  margin: 32px;
`;

const SeedsContainer = styled.div`
  margin-left: 16px;
`;

type GZMViewPropsType = {
  gzm: GZM;
};

const GZMView = (props: GZMViewPropsType) => {
  const { gzm } = props;

  const [newGZM, setNewGZM] = useState<GZM>(gzm);

  const updateRerecords = (value: string) => {
    const rerecords = Number.parseInt(value);
    // only update if positive integer
    if (Number.isNaN(rerecords) || rerecords < 0) {
      return;
    }
    setNewGZM({
      ...newGZM,
      rerecords
    });
  };

  const renderSeeds = () =>
    newGZM.seeds.map((seed) => (
      <li key={seed.frame}>
        frame: {seed.frame}, old: {toHex(seed.oldSeed)}, new:{' '}
        {toHex(seed.newSeed)}
      </li>
    ));

  return (
    <Container>
      <Button
        label="Download"
        onClick={() => downloadGZM(newGZM)}
        style={{ marginBottom: 8 }}
      />
      <li>
        filename:{' '}
        <TextInput
          type="text"
          value={newGZM.filename}
          onChange={(e) => setNewGZM({ ...newGZM, filename: e.target.value })}
        />
        {EXTENSION}
      </li>
      <li>n_input: {newGZM.totalInputs}</li>
      <li>n_seed: {newGZM.totalSeeds}</li>
      <li>n_oca_input: {newGZM.nOcaInput}</li>
      <li>n_oca_sync: {newGZM.nOcaSync}</li>
      <li>n_room_load: {newGZM.nRoomLoad}</li>
      <li>
        rerecords:{' '}
        <TextInput
          type="number"
          value={newGZM.rerecords}
          onChange={(e) => updateRerecords(e.target.value)}
        />
      </li>
      <li>last_recorded_frame: {newGZM.lastRecordedFrame}</li>
      <div>
        gzm has {newGZM.totalSeeds} seeds:
        <SeedsContainer>{renderSeeds()}</SeedsContainer>
      </div>
    </Container>
  );
};

export default GZMView;
