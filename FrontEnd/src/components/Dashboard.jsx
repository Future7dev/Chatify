import React, { useState } from 'react';
import { User, Send, LogOut, Search, MoreVertical } from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import ContactsSidebar from './ContactsSidebar';
import Navbar from './Navbar';
import ChatArea from './ChatArea';
export default function Dashboard() {
  const [selectedContact, setSelectedContact] = useState(null);

  const contacts = [
    { id: 1, name: 'Alice Johnson', lastMessage: 'See you tomorrow!', unread: 2 },
    { id: 2, name: 'Bob Smith', lastMessage: 'Thanks for the help', unread: 0 },
    { id: 3, name: 'Charlie Brown', lastMessage: 'Let me check and get back', unread: 1 },
    { id: 4, name: 'Diana Prince', lastMessage: 'That sounds great!', unread: 0 },
    { id: 5, name: 'Edward Norton', lastMessage: 'Will do', unread: 5 },
  ];

  return (
    <div className="vh-100 d-flex flex-column">
      <Navbar />
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
