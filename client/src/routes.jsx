// routes.jsx
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LandingPage from './components/body';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SubjectDashboard from './pages/SubjectPage';
import TopicDashboard from './pages/TopicDashboard';
import Home from './pages/NotificationDash'
import Component from './pages/Chapter';
import NotesPage from './pages/Notes';


export const router = createBrowserRouter([
  { path: "/", 
    element: <Layout/>,
    children:[
        {
            path:"",
            element: <LandingPage/>
        },
        {
            path:"/login",
            element:<LoginPage/>
        },
        {
            path:"/signup",
            element:<SignupPage/>
        },{
    path:"/subject",
    element: <ProtectedRoute>
              <SubjectDashboard/>
            </ProtectedRoute> 
  },{
    path:"/subjects/:id",
    element: 
     <ProtectedRoute>
             <Component/>
            </ProtectedRoute> 
  },{
    path:"/topics/:subjectid/:chapterid",
    element:<ProtectedRoute>
            <TopicDashboard/>
            </ProtectedRoute> 
  },{
    path:"/notifications",
    element:<ProtectedRoute>
      <Home/>
    </ProtectedRoute>
  },{
    path:"/notes",
    element:<ProtectedRoute>
      <NotesPage/>
    </ProtectedRoute>
  }
    ]

  }

]);


