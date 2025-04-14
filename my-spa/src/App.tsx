import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom';
import TaskList from './routes/tasklist';
import CreateTask from './routes/createtask';
import Task from './routes/task';
// If you have an About page, import it here
// import About from './routes/about';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/tasks/new" element={<CreateTask />} />
        <Route path="/tasks/:id" element={<Task />} />
        {/* <Route path="/about" element={<About />} /> */}
      </Routes>
    </>
  )
}

export default App
