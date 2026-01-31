import React, { useState } from 'react';
import { User, Send, LogOut, Search, MoreVertical } from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import ContactsSidebar from './ContactsSidebar';
import Navbar from './Navbar';
import ChatArea from './ChatArea';
export default function Dashboard({setUser}) {
  const [selectedContact, setSelectedContact] = useState(null);

  const contacts = [
    { id: 1, name: 'Nilesh',gmail:'nilesh@gmail.com', lastMessage: 'See you tomorrow!', unread: 2 },
    { id: 2, name: 'Priyam',gmail:'koleypriyam8@gmail.com', lastMessage: 'See you tomorrow!', unread: 2 },
    { id: 2, name: 'Ram',gmail:'ram@gmail.com', lastMessage: 'See you tomorrow!', unread: 2 }
    
  ];

  return (
    <div className="vh-100 d-flex flex-column">
      <Navbar setUser={setUser} />
      <div className="flex-grow-1 d-flex overflow-hidden">
        <ContactsSidebar
          contacts={contacts}
          selectedContact={selectedContact}
          onSelectContact={setSelectedContact}
        />
        <ChatArea contact={selectedContact} />
      </div>
    </div>
  );
};
