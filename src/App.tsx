import FileUpload from '@/components/FileUpload';
import 'the-new-css-reset/css/reset.css';

const App = () => {
  const onUpload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) {
      return;
    }
    const bytes = new DataView(await file.arrayBuffer());
    console.log(bytes.getUint32(0));
  };

  return (
    <div>
      <FileUpload onUpload={onUpload} />
    </div>
  );
};

export default App;
