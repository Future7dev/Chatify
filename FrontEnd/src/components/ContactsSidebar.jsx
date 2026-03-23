import React, { useState } from 'react';
import { User, Send, LogOut, Search, MoreVertical } from 'lucide-react';
import {useNavigate} from 'react-router-dom';


export default function ContactsSidebar({ contacts,groups, selectedContact,selectedGroup, onSelectContact,onSelectGroup,unreadCounts,lastMessages }) {

  
  return (
    <div className=" border-end d-flex flex-column " style={{width: '400px',
      backgroundColor:'#2f033a',
      color:'white',
     height: '100%'}}>
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
        <div className="p-2 text-muted fw-bold">Groups</div>

        {groups?.map(group => {
          const lastMsg=lastMessages[""+group.id];
          return (
          <div
              key={group.id}
              onClick={() => {
                onSelectGroup(group);
                onSelectContact(null);
              }}
              className={`p-3 border-bottom cursor-pointer ${
                selectedGroup?.id === group.id
                  ? "bg-primary bg-opacity-25"
                  : "contact-item"
              }`}
              style={{ cursor: "pointer" }}
            >
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold"
                style={{
                  width: "48px",
                  height: "48px",
                  background: "linear-gradient(135deg,#f59e0b,#ef4444)"
                }}
              >
                👥
              </div>

              <div>
                <h6 className="mb-0">{group.name}</h6>
                 <p className="mb-0 small text-truncate"
                style={{
                color:'white'
                }}
                >

                    {lastMsg
                      ? lastMsg.audioUrl
                        ? "🎤 Voice message"
                        : lastMsg.content?lastMsg.content
                        :lastMsg.fileType==="pdf"?"pdf":"Image"
                      : "No messages yet"
                      }
                </p>
                {/* <small className="text-muted">
                  {group.members?.length} members
                </small> */}
              </div>
            </div>
          </div>
        )})}
        {contacts.map((contact) => {
          const lastMsg=lastMessages[contact?.gmail];
          return (
          <div
              key={contact.id}
              onClick={() => {
                onSelectContact(contact);
                onSelectGroup(null);
              }}
              className={`p-3 border-bottom cursor-pointer ${
                selectedContact?.id === contact.id
                  ? "bg-primary bg-opacity-25"
                  : "contact-item"
              }`}
              style={{ cursor: "pointer" }}
            >
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold" 
                   style={{width: '48px', height: '48px', background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)'}}>
                {contact.name.charAt(0)}
              </div>
              <div className="flex-grow-1" style={{
                color:'white',
                minWidth: 0}}>
                <h6 className="mb-0 fw-semibold text-truncate">{contact.name}</h6>
                <p className="mb-0 small text-truncate"
                style={{
                color:'white'
                }}
                >

                    {lastMsg
                      ? lastMsg.audioUrl
                        ? "🎤 Voice message"
                        : lastMsg.content?lastMsg.content
                        :lastMsg.fileType==="pdf"?"pdf":"Image"
                      : "No messages yet"
                      }
                </p>
              </div>
              {unreadCounts?.[contact.gmail]>0 && (
                <span className="badge bg-primary rounded-pill">
                  {unreadCounts[contact.gmail]}
                </span>
              )}
            </div>
          </div>
        )})}
      </div>
    </div>
  );
};
