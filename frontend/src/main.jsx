import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {RouterProvider } from 'react-router-dom'
import router from './route.jsx'
import { ContextProvider } from './context/contextprovider.jsx'
import { AuthProvider } from './context/authprovider.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProvider>
      <AuthProvider>
        <RouterProvider router={router}/>
      </AuthProvider>
    </ContextProvider>
  </StrictMode>,
)
