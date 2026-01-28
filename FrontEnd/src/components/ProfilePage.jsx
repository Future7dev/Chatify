import React, { useState } from 'react';
import { User, Send, LogOut, Search, MoreVertical } from 'lucide-react';
import {useNavigate} from 'react-router-dom';

export default function ProfilePage() {
   const navigate = useNavigate();

  return (
    <div className="min-vh-100 bg-light">
      <div className="bg-white border-bottom p-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-link text-decoration-none fw-semibold"
        >
          ← Back to Dashboard
        </button>
      </div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="card shadow border-0">
              <div className="card-body p-5">
                <h1 className="text-center mb-5 fw-bold">My Profile</h1>
                <div className="text-center mb-4">
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center text-white mb-3"
                       style={{width: '128px', height: '128px', background: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)', fontSize: '3rem', fontWeight: 'bold'}}>
                    JD
                  </div>
                  <div>
                    <button className="btn btn-link text-decoration-none fw-semibold">
                      Change Photo
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Name</label>
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className="form-control form-control-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    defaultValue="john.doe@example.com"
                    className="form-control form-control-lg"
                  />
                </div>
                <button className="btn btn-primary btn-lg w-100 fw-semibold">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
