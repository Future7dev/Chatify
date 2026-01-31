import React, { useState, useEffect, useRef } from 'react';
import { User, Send, LogOut, Search, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { connectWebSocket, sendMessage, disconnectWebSocket } from "../api/webSocket";
import axios from 'axios';

export default function ChatArea({ contact }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const bottomRef=useRef(null);
  const [me, setMe] = useState(JSON.parse(localStorage.getItem("user")).gmail);

  useEffect(() => {
    if (!contact) return;

    // Fetch chat history
    axios
      .get(`http://localhost:8080/api/message/${contact.gmail}`, {
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

    // Connect WebSocket with proper parameters
    connectWebSocket(me, (newMessage) => {
      console.log("📨 New message received in ChatArea:", newMessage);
      setMessages(prev => [...prev, newMessage]);
    });

    // Cleanup on unmount or contact change
    return () => {
      disconnectWebSocket();
    };
  }, [contact, me]);

  useEffect(()=>{
    bottomRef.current?.scrollIntoView({
      behaviour:"smooth"
    })
  },[messages])

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage = {
      sender: me,
      receiver: contact.gmail,
      content: message,
      timeStamp: new Date().toISOString()
    };

    // Send via WebSocket
    sendMessage(me, contact.gmail, message);

    // Optimistically add to UI
    setMessages(prev => [...prev, newMessage]);
    setMessage("");
  };

  if (!contact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-lg">Select a contact to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-grow-1 d-flex flex-column bg-light">
      <div className="bg-white border-bottom p-3 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold"
               style={{width: '40px', height: '40px', background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)'}}>
            {contact.name.charAt(0)}
          </div>
          <div>
            <h6 className="mb-0 fw-semibold">{contact.name}</h6>
            <p className="mb-0 small text-success">Online</p>
          </div>
        </div>
        <button className="btn btn-light rounded-circle">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="flex-grow-1 overflow-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`d-flex mb-3 ${msg.sender === me ? 'justify-content-end' : 'justify-content-start'}`}
          >
            <div
              className={`px-3 py-2 rounded ${
                msg.sender === me
                  ? 'bg-primary text-white'
                  : 'bg-white border'
              }`}
              style={{maxWidth: '70%'}}
            >
              <p className="mb-1">{msg.content}</p>
              <p className={`mb-0 ${msg.sender === me ? 'text-white-50' : 'text-muted'}`} style={{fontSize: '0.75rem'}}>
                {msg.timeStamp ? new Date(msg.timeStamp).toLocaleTimeString() : ''}
              </p>
              
            </div>
          </div>
        ))}
        <div ref={bottomRef}/>
      </div>

      <div className="bg-white border-top p-3">
        <div className="d-flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="form-control form-control-lg"
          />
          <button
            onClick={handleSend}
            className="btn btn-primary d-flex align-items-center gap-2"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}