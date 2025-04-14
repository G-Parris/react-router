import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './root'
import Tasks from './routes/tasklist'
import NewTask from './routes/createtask'
import Task from './routes/task'
import './app.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Tasks />,
        loader: Tasks.loader,
      },
      {
        path: 'newtask',
        element: <NewTask />,
        action: NewTask.action,
      },
      {
        path: 'task/:id',
        element: <Task />,
        loader: Task.loader,
        action: Task.action,
      },
    ],
  },
], {
  basename: '/react-router'
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)