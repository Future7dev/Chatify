import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader';
import Orb from './Orb';

export default function LoginPage({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password) return;
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/login`, {
        auth: { username: email, password: password },
      })
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        localStorage.setItem("password", password);
        setLoading(false);
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error("Login failed:", err.response?.status);
        localStorage.removeItem("user");
        alert("Invalid email or password");
        setLoading(false);
      });
  };

  return (
    <>
      {/* Full-screen container */}
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center logsign"
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        {/* Orb fills the background */}
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '800px',
            height: '800px',
            zIndex: 0,
          }}
        >
          <Orb
            hue={0}
            hoverIntensity={2}
            rotateOnHover
            forceHoverState={false}
          />
        </div>

        {/* Login card — centered on top of Orb */}
        <div
          className="card shadow-lg border-0 logcard"
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: '420px',
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '20px',
          }}
        >
          <div className="card-body p-5">
            <h1 className="text-center mb-4 fw-bold text-white">Welcome Back</h1>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold text-white">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter your email"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#fff',
                  borderRadius: '10px',
                }}
              />
            </div>

            {/* Password with show/hide toggle */}
            <div className="mb-4">
              <label className="form-label fw-semibold text-white">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control form-control-lg"
                  placeholder="Enter your password"
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: '#fff',
                    borderRadius: '10px',
                    paddingRight: '48px',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.7)',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              className="btn btn-primary btn-lg w-100 fw-semibold"
              style={{ borderRadius: '10px' }}
            >
              Login
            </button>

            <p className="text-center mt-4 mb-0 text-white">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="btn btn-link p-0 fw-semibold text-decoration-none text-white"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(5px)',
              zIndex: 1200,
            }}
          />
          <div
            style={{
              position: 'fixed',
              bottom: '300px',
              left: '50%',
              transform: 'translateX(-50%)',
              borderRadius: '16px',
              padding: '20px',
              zIndex: 1300,
            }}
          >
            <Loader />
          </div>
        </>
      )}
    </>
  );
}