import React, { useState } from 'react';
import { User, Send, LogOut, Search, MoreVertical } from 'lucide-react';
import {useNavigate} from 'react-router-dom';

export default function ContactsSidebar({ contacts, selectedContact, onSelectContact }) {
  return (
    <div className="bg-white border-end d-flex flex-column " style={{width: '400px', height: '100%'}}>
      <div className="p-3 border-bottom">
        <div className="position-relative">
          <Search className="position-absolute text-muted" size={20} style={{left: '12px', top: '10px'}} />
          <input
            type="text"
            placeholder="Search contacts..."
            className="form-control ps-5"
          />
        </div>
      </div>
      <div className="flex-grow-1 overflow-auto ">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => onSelectContact(contact)}
            className={`p-3 border-bottom cursor-pointer ${
              selectedContact?.id === contact.id ? 'bg-primary bg-opacity-10' : ''
            }`}
            style={{cursor: 'pointer'}}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={(e) => {
              if (selectedContact?.id !== contact.id) {
                e.currentTarget.style.backgroundColor = 'white';
              }
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold" 
                   style={{width: '48px', height: '48px', background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)'}}>
                {contact.name.charAt(0)}
              </div>
              <div className="flex-grow-1" style={{minWidth: 0}}>
                <h6 className="mb-0 fw-semibold text-truncate">{contact.name}</h6>
                {/* <p className="mb-0 text-muted small text-truncate">{contact.lastMessage}</p> */}
              </div>
              {/* {contact.unread > 0 && (
                <span className="badge bg-primary rounded-pill">
                  {contact.unread}
                </span>
              )} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
