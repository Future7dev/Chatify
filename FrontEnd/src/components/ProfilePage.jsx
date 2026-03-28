import React, { use, useState } from 'react';
import { User, Send, LogOut, Search, MoreVertical } from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

export default function ProfilePage({user}) {
    const[name,setName]=useState(user.name);
    const[gmail,setGmail]=useState(user.gmail);
    const[url,setUrl]=useState(user.url)
   const navigate = useNavigate();
   const authuser = JSON.parse(localStorage.getItem("user"));
const password = localStorage.getItem("password");

const token = btoa(`${authuser.gmail}:${password}`);
   console.log(user);
   const handleUpdate = async () => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/update`, {
        name,
        
      }, {
        headers: {
    Authorization: `Basic ${token}`
  },
      });
      console.log(res.data);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  const handleFileSend = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  
    // setLoading(true);
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/profile/image`,
      formData,
      {
        
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Basic ${token}`
        },
      }
    );
    console.log(res.data);
    setUrl(res.data);
    

  } catch (err) {
    console.error(err);
  }
  // setLoading(false);
};



  return (
    <div className="min-vh-100 "
    style={{backgroundColor:'#3b0449'}}
    
    >
      <div className=" border-bottom p-3"
      style={{backgroundColor:'#f5cbff'}}
      >
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
                  <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center text-white mb-3"
                  style={{
                    width: "128px",
                    height: "128px",
                    background: "linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)",
                    fontSize: "3rem",
                    fontWeight: "bold"
                  }}
                >
                  {url ? (
                    <img
                      src={url}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius:"50%"
                      }}
                    />
                  ) : (
                    name?.charAt(0)
                  )}
                </div>
                  <div>
                    <label className="btn btn-link text-decoration-none fw-semibold">
                      Change Photo
                        <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleFileSend}
                    />
                    </label>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Name</label>
                  <input
                    type="text"
                    
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    className="form-control form-control-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    value={gmail}
                    readOnly
                    className="form-control form-control-lg"
                  />
                </div>
                <button className="btn btn-primary btn-lg w-100 fw-semibold"
                onClick={handleUpdate}>
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
