import React, { useState } from 'react';
import { User, Send, LogOut, Search, MoreVertical } from 'lucide-react';
import {useNavigate} from 'react-router-dom';

import api from '../api/axios';

export default function SignupPage() {
   const [name, setName] = useState('');
  const [gmail, setgmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async() => {
    if (name && gmail && password) {
      try{
      let response=await api.post("/signup",{
        name,
        gmail,
        password
      })

      alert(response.data);
      navigate("/")
      }catch(e){
        console.log(e);
      } 

      
    }
  };

   return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center logsign" >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card shadow-lg border-0 logcard">
              <div className="card-body p-5">
                <h1 className="text-center mb-4 fw-bold">Create Account</h1>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    
                    className="form-control form-control-lg"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    value={gmail}
                    onChange={(e) => setgmail(e.target.value)}
                    
                    className="form-control form-control-lg"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    
                    className="form-control form-control-lg"
                    placeholder="Create a password"
                  />
                </div>
                <button
                  onClick={handleSignup}
                  className="btn btn-primary btn-lg w-100 fw-semibold"
                  style={{backgroundColor: '#a855f7', borderColor: '#a855f7'}}
                >
                  Sign Up
                </button>
                <p className="text-center mt-4 mb-0">
                  Already have an account?{' '}
                  <button
                    onClick={() => navigate('/')}
                    className="btn btn-link p-0 fw-semibold text-decoration-none"
                    style={{color: '#a855f7'}}
                  >
                    Login
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
