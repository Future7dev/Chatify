import React, { use, useEffect, useState } from 'react';
import { User, Send, LogOut, Search, MoreVertical,UserRoundPlus, Helicopter } from 'lucide-react';
import {data, useNavigate} from 'react-router-dom';
import ContactsSidebar from './ContactsSidebar';
import Navbar from './Navbar';
import ChatArea from './ChatArea';
import axios from 'axios';
import Loader from './Loader';
import { v4 as uuidv4 } from "uuid";
import { connectWebSocket,disconnectWebSocket } from '../api/webSocket';



export default function Dashboard({setUser}) {
  const [selectedContact, setSelectedContact] = useState(null);

  const [contacts,setContacts]=useState([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactGmail, setNewContactGmail] = useState("");
  const [loading,setLoading]=useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    connectWebSocket(JSON.parse(localStorage.getItem("user")).gmail,(msg)=>{},(presence)=>{
      const user = Object.keys(presence)[0];
        const isOnline = presence[user];

        setOnlineUsers(prev => {
          if (isOnline) {
            return [...new Set([...prev, user])];
          } else {
            return prev.filter(u => u !== user);
          }
        });
      
    })
  
  axios.get("http://localhost:8080/api/contacts", {
    auth: {
      username: JSON.parse(localStorage.getItem("user")).gmail,
      password: localStorage.getItem("password")
    }
  })
  .then((res) => {
    const formattedContacts = res.data.map(con => ({
      id: uuidv4(),   // or uuidv4()
      name: con[0],
      gmail: con[1]
    }));

    setContacts(formattedContacts);
  })
  .catch((err) => {
    console.log(err);
  });

  return ()=>{
    disconnectWebSocket()
  }
}, []);



const handleNewContact=async()=>{
    if (!newContactName || !newContactGmail) return;
          const res=await axios.get("http://localhost:8080/api/exists",{
            params:{gmail:newContactGmail},
            auth:{
              username:JSON.parse(localStorage.getItem("user")).gmail,
              password:localStorage.getItem("password")
            }
          })
          if(res.data){
            setContacts(prev => [
              ...prev,
              {
                id: crypto.randomUUID(),
                name: newContactName,
                gmail: newContactGmail
              }
            ]);

            setNewContactName("");
            setNewContactGmail("");
            setShowAddContact(false);
          }
          else{
            alert(`${newContactName} don't have account!!` )
          }
  }   
  let handleCancelAdd=()=>{
            setNewContactName("");
            setNewContactGmail("");
            setShowAddContact(false);

  }
  
  return (
    <>
    <div className="vh-100 d-flex flex-column">
      <Navbar setUser={setUser} />
      <div className="flex-grow-1 d-flex overflow-hidden">
        <ContactsSidebar
          contacts={contacts}
          selectedContact={selectedContact}
          onSelectContact={setSelectedContact}
        />
        <UserRoundPlus 
      onClick={() => setShowAddContact(true)}
      className="btn btn-primary "
      style={{
        position: "relative",
        top: "35rem",
        right: "5rem",
        width: "55px",
        height: "55px",
        fontSize: "28px",
        zIndex: 1100
      }}
    />
        <ChatArea contact={selectedContact} onlineUsers={onlineUsers} setOnlineUsers={setOnlineUsers} setContacts={setContacts} contacts={contacts} setLoading={setLoading}  />
      </div>
    </div>
    {/* Floating Add Contact Button */}
    
      

    {showAddContact && (
  <>
    {/* Blur Overlay */}
    <div
      onClick={() => setShowAddContact(false)}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.3)",
        backdropFilter: "blur(5px)",
        zIndex: 1200
      }}
    />

    {/* Add Contact Modal */}
    <div
      style={{
        position: "fixed",
        bottom: "300px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "400px",
        background: "white",
        borderRadius: "16px",
        padding: "20px",
        zIndex: 1300
      }}
    >
      <h5 className="mb-3">Add New Contact</h5>

      <input
        type="text"
        className="form-control mb-2"
        placeholder="Name"
        value={newContactName}
        onChange={(e) => setNewContactName(e.target.value)}
      />

      <input
        type="email"
        className="form-control mb-3"
        placeholder="Gmail"
        value={newContactGmail}
        onChange={(e) => setNewContactGmail(e.target.value)}
      />

      <div className="d-flex justify-content-end gap-2">
        <button
          className="btn btn-secondary"
          onClick={handleCancelAdd}
        >
          Cancel
        </button>

        <button
          className="btn btn-primary"
          onClick={handleNewContact}
        >
          Add
        </button>
      </div>
    </div>
  </>
)}

  {loading && (
    <>
    <div
      
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.3)",
        backdropFilter: "blur(1px)",
        zIndex: 1200
      }}
    />
    <div
    style={{
        position: "fixed",
        bottom: "300px",
        left: "50%",
        transform: "translateX(-50%)",
        
        
      
        borderRadius: "16px",
        padding: "20px",
        zIndex: 1300
      }}
    >
    <Loader  />
    </div>
    </>
  )}
    </>
  );
};
