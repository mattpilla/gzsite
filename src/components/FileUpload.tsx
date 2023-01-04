import { FileDrop } from 'react-file-drop';

type FileUploadPropsType = {
  onUpload: (files: FileList | null) => void;
};

const FileUpload = (props: FileUploadPropsType) => {
  const { onUpload, ...rest } = props;

  return (
    <div {...rest}>
      <FileDrop onDrop={onUpload}>upload</FileDrop>
    </div>
  );
};

export default FileUpload;
