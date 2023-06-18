import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import PageHome from './pages/home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  { 
    path: '/',
    element: <PageHome />,
    children: [
      {
        path: 'home',
        element: <PageHome />,
      },
    ]
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);