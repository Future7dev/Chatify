import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './index.css'
import {BrowserRouter,Route,Routes,Navigate, useNavigate} from 'react-router-dom'
import LoginPage from './components/LoginPage'
import SignupPage from './components/SignupPage'
import Dashboard from './components/Dashboard'
import ProfilePage from './components/ProfilePage'

function App() {
 let [user,setUser]=useState(JSON.parse(localStorage.getItem("user"))); 


  return (
    <>
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet" 
        integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" 
        crossOrigin="anonymous"
      />
      <BrowserRouter>
      <Routes>
        <Route path="/" element={(user)?<Navigate to={"/dashboard"}/>:<LoginPage 
        setUser={setUser
        }
        />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={(user)?<Dashboard setUser={setUser}/>:<Navigate to={"/"}/>} />
        <Route path="/profile" element={(user)?<ProfilePage user={user} />:<Navigate to={"/"}/>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
