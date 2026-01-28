import React, { useState } from 'react';
import { User, Send, LogOut, Search, MoreVertical } from 'lucide-react';
import {useNavigate} from 'react-router-dom';

export default function ChatArea({contact}) {
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hey! How are you?', sender: 'them', time: '10:30 AM' },
    { id: 2, text: 'I am good, thanks! How about you?', sender: 'me', time: '10:32 AM' },
    { id: 3, text: 'Doing great! Working on a new project.', sender: 'them', time: '10:35 AM' },
  ]);

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        text: message,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setMessage('');
    }
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
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`d-flex mb-3 ${msg.sender === 'me' ? 'justify-content-end' : 'justify-content-start'}`}
          >
            <div
              className={`px-3 py-2 rounded ${
                msg.sender === 'me'
                  ? 'bg-primary text-white'
                  : 'bg-white border'
              }`}
              style={{maxWidth: '70%'}}
            >
              <p className="mb-1">{msg.text}</p>
              <p className={`mb-0 ${msg.sender === 'me' ? 'text-white-50' : 'text-muted'}`} style={{fontSize: '0.75rem'}}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border-top p-3">
        <div className="d-flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
           
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
};