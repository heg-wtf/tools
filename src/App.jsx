import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <h1>React 앱에 오신 것을 환영합니다!</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            카운트: {count}
          </button>
          <p>
            <code>src/App.jsx</code> 파일을 수정하고 저장하면 자동으로 리로드됩니다.
          </p>
        </div>
      </header>
    </div>
  )
}

export default App
