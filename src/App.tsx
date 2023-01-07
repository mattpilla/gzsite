import { getGZM, GZMError, type GZM } from '@/util/GZMHelpers';
import { Slide, toast, ToastContainer } from 'react-toastify';
import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import GZMView from '@/components/GZMView';
import 'react-toastify/dist/ReactToastify.css';
import 'the-new-css-reset/css/reset.css';

const App = () => {
  const [gzm, setGZM] = useState<GZM>();

  const onUpload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) {
      return;
    }
    toast.dismiss();
    try {
      if (!file.name.endsWith('.gzm')) {
        throw new GZMError('Filename must end with .gzm');
      }
      const bytes = new DataView(await file.arrayBuffer());
      setGZM(getGZM(bytes));
    } catch (e) {
      console.error(e);
      const message =
        e instanceof GZMError ? e.message : 'GZM may be corrupted';
      toast.error(`Error: ${message}`);
    }
  };

  const renderView = () => {
    if (gzm) {
      return <GZMView gzm={gzm} />;
    }
    return (
      <FileUpload
        accept=".gzm"
        label="Upload gz macro (.gzm)"
        onUpload={onUpload}
      />
    );
  };

  return (
    <>
      {renderView()}
      <ToastContainer transition={Slide} />
    </>
  );
};

export default App;
