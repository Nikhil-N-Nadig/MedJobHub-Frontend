import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {Home,About,Jobs,ContactUs, SignIn, SignUp, Verifyotp,AddJobForm,ApplyJobForm,JobApplications,JobListings, JobInfo,JobDetails,ChatBox} from './pages'
import App from './App'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { store } from '../src/store/store'
import { Provider } from 'react-redux'
import { FlashProvider } from './context/FlashContext'
import { FlashMessage } from './components'
const route = createBrowserRouter([
  {
    path: "/",
    element: <App />, 
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path:'/about',
        element:<About />
      },
      {
        path:'/jobs',
        element:<Jobs />,
      },
      {
        path:'/contact-us',
        element:<ContactUs />
      },
      {
        path:'/signin',
        element:<SignIn />
      },
      {
        path:'/signup',
        element:<SignUp />
      },
      {
        path:'/verify-otp',
        element:<Verifyotp />
      },
      { 
        path: "/job-listings", 
        element: <JobListings /> 
      }, 
      { 
        path: "/job-applications", 
        element: <JobApplications /> 
      }, 
      { 
        path: "/add-job",
        element: <AddJobForm /> 
      }, 
      { 
        path: "/apply-job/:job_id", 
        element: <ApplyJobForm />
      },
      {
        path: "/job-listings/job-info/:job_id", 
        element: <JobInfo />
      },
      { 
        path: "/jobs/:jobType", 
        element: <JobDetails /> 
      },
      {
        path:"/chat/:userId/:receiverId",
        element:<ChatBox />
      }
    ],
  },
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <FlashProvider >
      <FlashMessage />
      <RouterProvider router={route}/>
      </FlashProvider>
      </Provider>
  </StrictMode>,
)

