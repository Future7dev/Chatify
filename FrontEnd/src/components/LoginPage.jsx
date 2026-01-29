import React, { useState } from 'react';
import { User, Send, LogOut, Search, MoreVertical } from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

export default function LoginPage({setUser}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()

  const handleLogin = () => {
  if (!email || !password) return;

  axios
    .get("http://localhost:8080/api/login", {
      auth: {
        username: email,
        password: password,
      },
    })
    .then((res) => {
      // Axios already gives parsed data
      setUser(res.data);
      console.log(res.data);

      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/dashboard");
    })
    .catch((err) => {
      console.error("Login failed:", err.response?.status);
      localStorage.removeItem("user");
      alert("Invalid email or password");
    });
};


  return (
    <div className="min-vh-100  d-flex align-items-center justify-content-center logsign" >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 ">
            <div className="card shadow-lg border-0 logcard">
              <div className="card-body p-5  ">
                <h1 className="text-center mb-4 fw-bold">Welcome Back</h1>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    
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
                    placeholder="Enter your password"
                  />
                </div>
                <button
                  onClick={handleLogin}
                  className="btn btn-primary btn-lg w-100 fw-semibold"
                >
                  Login
                </button>
                <p className="text-center mt-4 mb-0">
                  Don't have an account?{' '}
                  <button
                    onClick={() => navigate('/signup')}
                    className="btn btn-link p-0 fw-semibold text-decoration-none"
                  >
                    Sign Up
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

