import React, { useState } from 'react';
import { User, Send, LogOut, Search, MoreVertical } from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import { disconnectWebSocket } from '../api/webSocket';

export default function Navbar({setUser}) {
  const navigate = useNavigate();
  let handleLogout=()=>{

    localStorage.removeItem("user");
    localStorage.removeItem("password");
    setUser(null);
    navigate("/");
  
  }

  return (
    <nav className="navbar navbar-light bg-white border-bottom shadow-sm">
      <div className="container-fluid px-4">
        <span className="navbar-brand mb-0 h3 fw-bold">Welcome</span>
        <div className="d-flex gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
            style={{width: '40px', height: '40px'}}
          >
            <User size={20} />
          </button>
          <button
            onClick={handleLogout}
            className="btn btn-danger d-flex align-items-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
