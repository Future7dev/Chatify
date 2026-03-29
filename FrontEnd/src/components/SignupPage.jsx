import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Orb from './Orb';
import Loader from './Loader';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [gmail, setgmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const passwordsMatch = confirmPassword === '' ? null : password === confirmPassword;

  const handleSignup = async () => {
    if (!name || !gmail || !password || !confirmPassword) return;
    if (!passwordsMatch) return;
    setLoading(true);
    try {
      let response = await api.post("/signup", { name, gmail, password });
      alert(response.data);
      navigate("/login");
    } catch (e) {
      console.log(e);
      setLoading(false);
      alert(e.response?.data || "Signup failed");
    }
    setLoading(false);
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#fff',
    borderRadius: '10px',
    paddingRight: '48px',
  };

  const ToggleBtn = ({ show, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
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
    >
      {show ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  );

  return (
    <>
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center logsign"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Orb Background */}
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
        <Orb hue={0} hoverIntensity={2} rotateOnHover forceHoverState={false} />
      </div>

      {/* Glassmorphism Card */}
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
          <h1 className="text-center mb-4 fw-bold text-white">Create Account</h1>

          {/* Full Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold text-white">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control form-control-lg"
              placeholder="Enter your name"
              style={{ ...inputStyle, paddingRight: '12px' }}
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold text-white">Email</label>
            <input
              type="email"
              value={gmail}
              onChange={(e) => setgmail(e.target.value)}
              className="form-control form-control-lg"
              placeholder="Enter your email"
              style={{ ...inputStyle, paddingRight: '12px' }}
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label fw-semibold text-white">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Create a password"
                style={inputStyle}
              />
              <ToggleBtn show={showPassword} onToggle={() => setShowPassword(p => !p)} />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-1">
            <label className="form-label fw-semibold text-white">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Re-enter your password"
                style={{
                  ...inputStyle,
                  border: passwordsMatch === null
                    ? '1px solid rgba(255,255,255,0.3)'
                    : passwordsMatch
                    ? '1px solid #4ade80'
                    : '1px solid #f87171',
                }}
              />
              <ToggleBtn show={showConfirm} onToggle={() => setShowConfirm(p => !p)} />
            </div>
          </div>

          {/* Match feedback */}
          <div className="mb-4" style={{ minHeight: '20px' }}>
            {passwordsMatch === false && (
              <small style={{ color: '#f87171' }}>⚠ Passwords do not match</small>
            )}
            {passwordsMatch === true && (
              <small style={{ color: '#4ade80' }}>✓ Passwords match</small>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSignup}
            disabled={!name || !gmail || !password || !passwordsMatch}
            className="btn btn-lg w-100 fw-semibold"
            style={{
              backgroundColor: '#a855f7',
              borderColor: '#a855f7',
              borderRadius: '10px',
              color: '#fff',
              opacity: (!name || !gmail || !password || !passwordsMatch) ? 0.5 : 1,
              cursor: (!name || !gmail || !password || !passwordsMatch) ? 'not-allowed' : 'pointer',
            }}
          >
            Sign Up
          </button>

          <p className="text-center mt-4 mb-0 text-white">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="btn btn-link p-0 fw-semibold text-decoration-none"
              style={{ color: '#a855f7' }}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
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