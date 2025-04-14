import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import TaskList from './routes/tasklist';
import CreateTask from './routes/createtask';
import Task from './routes/task';
// If you have an About page, import it here
// import About from './routes/about';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/tasks/new" element={<CreateTask />} />
        <Route path="/tasks/:id" element={<Task />} />
        <Route path='react-router' element={<Navigate to="/" />} />
        <Route path='*' element={<TaskList />} />
        {/* Add a catch-all route for 404s */}
      </Routes>
    </>
  )
}

export default App;
