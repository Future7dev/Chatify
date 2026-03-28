import React, { use, useEffect, useRef, useState } from 'react';
import { User, Send, LogOut, Search, MoreVertical,UserRoundPlus, Users } from 'lucide-react';
import {data, useNavigate} from 'react-router-dom';
import ContactsSidebar from './ContactsSidebar';
import Navbar from './Navbar';
import ChatArea from './ChatArea';
import axios from 'axios';
import Loader from './Loader';
import { v4 as uuidv4 } from "uuid";
import { connectWebSocket,disconnectWebSocket } from '../api/webSocket';



export default function Dashboard({setUser}) {
  const [me, setMe] = useState(JSON.parse(localStorage.getItem("user")).gmail);
  


  const [selectedContact, setSelectedContact] = useState(null);
  const [lastMessages, setLastMessages] = useState({});
  const [contacts,setContacts]=useState([]);

  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactGmail, setNewContactGmail] = useState("");


  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null); 

  const [loading,setLoading]=useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [messages, setMessages] = useState([]);
  const [typingUser,setTypingUser]=useState(null);
  const selectedContactRef = useRef(null);



  useEffect(() => {
    connectWebSocket(JSON.parse(localStorage.getItem("user")).gmail,async (newMessage)=>{
      setMessages(prev => {
      const exist = prev.some(
        m =>
          m.timeStamp === newMessage.timeStamp &&
          m.sender === newMessage.sender
      );

      if (exist) return prev;

      return [...prev, newMessage];
    });



      const exist = contacts.some(
            c => c.gmail === newMessage.sender
          );

          if (!exist) {
            axios.get(`${import.meta.env.VITE_API_URL}/api/user`, {
              params: { gmail: newMessage.sender },
              auth: {
                username: JSON.parse(localStorage.getItem("user")).gmail,
                password: localStorage.getItem("password")
              }
            }).then(res => {

              const newCon = {
                id: crypto.randomUUID(),
                name: res.data[0],
                gmail: res.data[1],
                url:res.data[2]
              };

              setContacts(prev => {
                const already = prev.some(
                  c => c.gmail === newCon.gmail
                );
                if (already) return prev;
                return [...prev, newCon];
              });

            });
          }


     

     setLastMessages(prev => ({
        ...prev,
        [newMessage.sender]: newMessage
      }));
      setUnreadCounts(prev => ({
        ...prev,
        [newMessage.sender]: (prev[newMessage.sender] || 0) + 1
      }));
    },(presence)=>{
      const user = Object.keys(presence)[0];
        const isOnline = presence[user];

        setOnlineUsers(prev => {
          if (isOnline) {
            return [...new Set([...prev, user])];
          } else {
            return prev.filter(u => u !== user);
          }
        });
      
    },(typing)=>{
      console.log("sender typeing "+typing.sender+" selected "+selectedContactRef?.gmail)
      console.log(typing.sender === selectedContactRef.current?.gmail)
      if(typing.sender === selectedContactRef.current?.gmail){
          setTypingUser(typing.sender)
          console.log(typing);
          setTimeout(() => {
              setTypingUser(null);
            }, 2000);
        }
    })
  

     axios.get(`${import.meta.env.VITE_API_URL}/api/group`, {
    auth: {
      username: JSON.parse(localStorage.getItem("user")).gmail,
      password: localStorage.getItem("password")
    }
  }).then(res => setGroups(res.data));

    axios.get(`${import.meta.env.VITE_API_URL}/api/message/unread-count`, {
      auth: {
        username: JSON.parse(localStorage.getItem("user")).gmail,
        password: localStorage.getItem("password")
      }
    }).then(res => {
      console.log("unreads:::",res.data)
      setUnreadCounts(res.data)});
  

  axios.get(`${import.meta.env.VITE_API_URL}/api/contacts`, {
    auth: {
      username: JSON.parse(localStorage.getItem("user")).gmail,
      password: localStorage.getItem("password")
    }
  })
  .then((res) => {
    const formattedContacts = res.data.map(con => ({
      id: uuidv4(),   // or uuidv4()
      name: con[0],
      gmail: con[1],
      url:con[2]
    }));

    setContacts(formattedContacts);
    axios.get(`${import.meta.env.VITE_API_URL}/api/message/last-messages`, {
    auth: {
      username: JSON.parse(localStorage.getItem("user")).gmail,
      password: localStorage.getItem("password")
    }
  })
  .then(res => {
    console.log(res.data)
    setLastMessages(res.data)});
  })
  .catch((err) => {
    console.log(err);
  });



  return () => {
    disconnectWebSocket();   // ✅ cleanup
  };
}, []);

useEffect(() => {
  selectedContactRef.current = selectedContact;
}, [selectedContact]);

useEffect(() => {
    if (!selectedContact) return;
    setLoading(true);
    // Fetch chat history
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/message/${selectedContact.gmail}`, {
        auth: {
          username: JSON.parse(localStorage.getItem("user")).gmail,
          password: localStorage.getItem("password") // Fixed: get password directly
        }
      })
      .then(res => {
        console.log("📜 Chat history loaded:", res.data);
        setMessages(res.data);
        
      })
      .catch(err => console.error("❌ Error loading chat:", err));
      setLoading(false);
},[selectedContact])





const handleNewContact=async()=>{
    if (!newContactName || !newContactGmail) return;
          const res=await axios.get(`${import.meta.env.VITE_API_URL}/api/exists`,{
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


  const handleAddMember = async () => {
    if (!memberEmail) return;

    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/exists`, {
      params: { gmail: memberEmail },
      auth: { username: me, password: localStorage.getItem("password") },
    });

    if (!res.data) {
      alert("User does not exist");
      return;
    }

    if (groupMembers.includes(memberEmail)) {
      alert("Already added");
      return;
    }

    setGroupMembers((prev) => [...prev, memberEmail]);
    setMemberEmail("");
  };

  const handleCreateGroup = async () => {
    if (!groupName || groupMembers.length === 0) {
      alert("Enter group name & members");
      return;
    }

    const payload = {
      name: groupName,
      members: [...groupMembers, me],
    };

    let res=await axios.post(`${import.meta.env.VITE_API_URL}/api/group/create`, payload, {
      auth: { username: me, password: localStorage.getItem("password") },
    });

    setGroups((prev)=>[...prev,res.data]);

    alert("Group Created ✅");

    setShowCreateGroup(false);
    setShowAddContact(false);
    setGroupMembers([]);
    setGroupName("");
  };



  
  return (
    <>
    <div className="vh-100 d-flex flex-column">
      <Navbar setUser={setUser} />
      <div className="flex-grow-1 d-flex overflow-hidden">
        <ContactsSidebar
          contacts={contacts}
          groups={groups}                 
          selectedContact={selectedContact}
          selectedGroup={selectedGroup}
          onSelectContact={setSelectedContact}
          onSelectGroup={setSelectedGroup}
          unreadCounts={unreadCounts}
          lastMessages={lastMessages}
          
          
          
          
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
        <ChatArea
        contact={selectedContact}
        group={selectedGroup}
        onlineUsers={onlineUsers}
        lastMessages={lastMessages}
        setLastMessages={setLastMessages}
        setOnlineUsers={setOnlineUsers}
        setContacts={setContacts}
        contacts={contacts}
        setLoading={setLoading}
        setUnreadCounts={setUnreadCounts}
        messages={messages}
        setMessages={setMessages}
        typingUser={typingUser}
        setTypingUser={setTypingUser}
      />

      </div>
    </div>
    {/* Floating Add Contact Button */}
    
      

{showAddContact && (
          <>
          <div
          onClick={() => {
          setShowAddContact(false);
          setShowCreateGroup(false);
          }}
          style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(5px)",
          zIndex: 1200,
          }}
          />


          {/* PANEL */}
          <div
          style={{
          position: "fixed",
          bottom: "200px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "420px",
          background: "white",
          borderRadius: "16px",
          padding: "20px",
          zIndex: 1300,
          }}
          >
          {!showCreateGroup ? (
          <>
          <h5>Add New Contact</h5>


          <input
          className="form-control mb-2"
          placeholder="Name"
          value={newContactName}
          onChange={(e) => setNewContactName(e.target.value)}
          />


          <input
          className="form-control mb-3"
          placeholder="Gmail"
          value={newContactGmail}
          onChange={(e) => setNewContactGmail(e.target.value)}
          />


          <div className="d-flex justify-content-between">
          <button
          className="btn btn-secondary"
          onClick={() => setShowAddContact(false)}
          >
          Cancel
          </button>


          <button
          className="btn btn-success"
          onClick={() => setShowCreateGroup(true)}
          >
          <Users size={18} /> Create Group
          </button>


          <button
          className="btn btn-primary"
          onClick={handleNewContact}
          >
          Add
          </button>
          </div>
          </>
          ): (
          <>
          {/* -------- GROUP FORM -------- */}
          <h5>Create Group</h5>


          <input
          className="form-control mb-2"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          />


          <div className="d-flex gap-2 mb-2">
          <input
          className="form-control"
          placeholder="Member Gmail"
          value={memberEmail}
          onChange={(e) => setMemberEmail(e.target.value)}
          />
          <button
          className="btn btn-primary"
          onClick={handleAddMember}
          >
          Add
          </button>
          </div>


          {/* MEMBERS LIST */}
          <div style={{ maxHeight: "120px", overflowY: "auto" }}>
          {groupMembers.map((m, i) => (
          <div
          key={i}
          className="d-flex justify-content-between align-items-center border p-2 mb-1 rounded"
          >
          {m}
          <button
          className="btn btn-sm btn-danger"
          onClick={() =>
          setGroupMembers((prev) =>
          prev.filter((x) => x !== m)
          )
          }
          >
          ✕
          </button>
          </div>
          ))}
          </div>


          <div className="d-flex justify-content-end gap-2 mt-3">
          <button
          className="btn btn-secondary"
          onClick={() => setShowCreateGroup(false)}
          >
          Back
          </button>


          <button
          className="btn btn-success"
          onClick={handleCreateGroup}
          >
          Create Group
          </button>
          </div>
          </>
          )}
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
