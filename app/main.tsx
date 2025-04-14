import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './root'
import Tasks from './routes/tasklist'
import NewTask from './routes/createtask'
import Task from './routes/task'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Tasks />,
      },
      {
        path: 'newtask',
        element: <NewTask />,
      },
      {
        path: 'task/:id',
        element: <Task />,
      },
    ],
  },
], {
  basename: '/react-router',
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)