import viteLogo from '/vite.svg';
import './App.css';
import MyEditor from './components/MyEditor';

function App() {

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <MyEditor />
    </>
  )
}

export default App;
