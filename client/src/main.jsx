import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext";
import {RouterProvider} from 'react-router-dom';
import { router } from './routes.jsx';
import {Toaster} from './components/ui/toaster.jsx'
import GlobalNotificationHandler from './components/notiHandler.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <AuthProvider>
    <GlobalNotificationHandler/>
   <RouterProvider router={router}/>
   </AuthProvider>
   <Toaster/>
  </StrictMode>,
)
