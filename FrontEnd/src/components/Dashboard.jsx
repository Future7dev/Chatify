import React, { use, useEffect, useState } from 'react';
import { User, Send, LogOut, Search, MoreVertical } from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import ContactsSidebar from './ContactsSidebar';
import Navbar from './Navbar';
import ChatArea from './ChatArea';
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";



export default function Dashboard({setUser}) {
  const [selectedContact, setSelectedContact] = useState(null);

  const [contacts,setContacts]=useState([]);

  useEffect(() => {
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
}, []);

  if(!contacts){
    return(<>
      <div>waitt</div>
    </>)
  }
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
