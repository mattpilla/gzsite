import { FileDrop } from 'react-file-drop';
import { useRef } from 'react';
import styled from 'styled-components';

type FileUploadPropsType = {
  accept?: string;
  label: string;
  onUpload: (files: FileList | null) => void;
};

const Container = styled.div`
  display: grid;
  position: absolute;
  height: 100%;
  width: 100%;

  .file-drop {
    display: flex;
  }

  .file-drop-target {
    margin: 24px;
    border: 1px dashed;
    border-radius: 4px;
    cursor: pointer;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  }

  .file-drop-target.file-drop-dragging-over-target {
    background-color: #c9ebff;
    text-decoration: underline;
  }
`;

const FileUpload = (props: FileUploadPropsType) => {
  const { accept, label, onUpload } = props;

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Container>
      <FileDrop
        onDrop={onUpload}
        onTargetClick={() => fileInputRef?.current?.click()}>
        {label}
      </FileDrop>
      <input
        onChange={(event) => onUpload(event.target.files)}
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="d-none"
      />
    </Container>
  );
};

export default FileUpload;
