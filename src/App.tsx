import { getGZM, GZMError } from '@/util/GZMHelpers';
import { Slide, toast, ToastContainer } from 'react-toastify';
import FileUpload from '@/components/FileUpload';
import "react-toastify/dist/ReactToastify.css";
import 'the-new-css-reset/css/reset.css';

const App = () => {
  const onUpload = async (files: FileList | null) => {
    try {
      const file = files?.[0];
      if (!file) {
        return;
      }
      if (!file.name.endsWith('.gzm')) {
        throw new GZMError('Filename must end with .gzm');
      }
      const bytes = new DataView(await file.arrayBuffer());
      console.log(getGZM(bytes));
    } catch (e) {
      const message = e instanceof GZMError ? e.message : 'GZM may be corrupted';
      toast.error(`Error: ${message}`);
    }
  };

  return (
    <>
      <FileUpload
        accept=".gzm"
        label="Upload gz macro (.gzm)"
        onUpload={onUpload}
      />
      <ToastContainer transition={Slide} />
    </>
  );
};

export default App;
