import { getGZM } from '@/util/GZMHelpers';
import FileUpload from '@/components/FileUpload';
import 'the-new-css-reset/css/reset.css';

const App = () => {
  const onUpload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) {
      return;
    }
    if (!file.name.endsWith('.gzm')) {
      throw new Error('use .gzm (todo)');
    }
    const bytes = new DataView(await file.arrayBuffer());
    console.log(getGZM(bytes));
  };

  return (
    <div>
      <FileUpload onUpload={onUpload} />
    </div>
  );
};

export default App;
