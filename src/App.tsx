import viteLogo from '/vite.svg';
import './App.css';
import MyEditor, { EditorRef } from './Editor/MyEditor';
import { useRef, useState } from 'react';

function App() {
  const editorRef = useRef<EditorRef>(null);
  const [serialized, setSerialized] = useState('');
  const [plainText, setPlainText] = useState('');

  function onSerialize() {
    if (!editorRef.current) {
      console.error('Could not serialize (ref is null).');
      return;
    }
    const serializedResult = editorRef.current?.serialize();
    if (serializedResult === null) {
      alert('No changes detected.');
    } else {
      setSerialized(serializedResult);
    }
  }

  function onPlainText() {
    if (!editorRef.current) {
      console.error('Could not serialize (ref is null).');
      return;
    }
    const serializedText = editorRef.current.getPlainText();
    if (serializedText === null) {
      alert('No changes detected.');
    } else {
      setPlainText(serializedText);
    }
  }

  return (
    <main style={{ width: '100vw', maxWidth: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <a href="https://vitejs.dev" target="_blank">
        <img src={viteLogo} className="logo" alt="Vite logo" />
      </a>

      <MyEditor innerRef={editorRef} />

      <button onClick={onSerialize} style={{ marginTop: 20 }}>
        {'Serialize now!'}
      </button>
      {serialized && <p>{serialized}</p>}
      <button onClick={onPlainText} style={{ marginTop: 20 }}>{'Get plain text!'}</button>
      {plainText && <p>{plainText}</p>}
    </main>
  )
}

export default App;
