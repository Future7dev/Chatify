import React, { useState, useEffect, useRef } from 'react';
import { User, Send, LogOut, Search, MoreVertical,Smile,Mic,SquarePause } from 'lucide-react';
import EmojiPicker from "emoji-picker-react";
import { useNavigate } from 'react-router-dom';


import { connectWebSocket, sendMessage, disconnectWebSocket } from "../api/webSocket";
import axios from 'axios';
import AudioMessage from './AudioMessage';

export default function ChatArea({ contact,onlineUsers,setOnlineUsers,setContacts,contacts,setLoading }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const bottomRef=useRef(null);
  const [me, setMe] = useState(JSON.parse(localStorage.getItem("user")).gmail);
  
  
  const [showEmoji, setShowEmoji] = useState(false);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);

  


  useEffect(() => {
    if (!contact) return;
    setLoading(true);
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
      setLoading(false);

    // Connect WebSocket with proper parameters
    connectWebSocket(me,async (newMessage) => {
      console.log("📨 New message received in ChatArea:", newMessage);
      setMessages(prev => [...prev, newMessage]);
      let contactExist=contacts.some(
        c=>c.gmail===newMessage.sender
      );

      if(!contactExist){
      let res=await axios.get("http://localhost:8080/api/user",{
        params:{gmail:newMessage.sender},
        auth: {
          username: JSON.parse(localStorage.getItem("user")).gmail,
          password: localStorage.getItem("password") // Fixed: get password directly
        }
      })
      console.log("new contacts added: ",res.data);
      let newCon={
        id:crypto.randomUUID(),
        name:res.data[0],
        gmail:res.data[1]

      }
      setContacts((prev)=>[...prev,newCon]);
    }
    },(presence) => {
        const user = Object.keys(presence)[0];
        const isOnline = presence[user];

        setOnlineUsers(prev => {
          if (isOnline) {
            return [...new Set([...prev, user])];
          } else {
            return prev.filter(u => u !== user);
          }
        });
      });



    


    // Cleanup on unmount or contact change
    return () => {
      disconnectWebSocket();
    };
  }, [contact, me]);




  useEffect(()=>{

    axios.get("http://localhost:8080/api/user/online",{
      auth:{
        username:JSON.parse(localStorage.getItem("user")).gmail,
        password:localStorage.getItem("password")
      }
    })
    .then(res=>{
      console.log("online users:",res.data)
      res.data.map(c=>setOnlineUsers(prev=>[...prev,c]));

    })
    
    

  },[])





  useEffect(()=>{
    bottomRef.current?.scrollIntoView({
      behaviour:"smooth"
    })
  },[messages])

  useEffect(() => {
      if (recording && canvasRef.current && analyserRef.current) {
        drawWaveform();
      }
    }, [recording]);

  
  const onEmojiClick = (emojiData) => {
  setMessage(prev => prev + emojiData.emoji);
  };


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
  const drawWaveform = () => {
  const canvas = canvasRef.current;
  const analyser = analyserRef.current;
  if (!canvas || !analyser) return;

  const ctx = canvas.getContext("2d");
  const bufferLength = analyser.frequencyBinCount; // ✅ FIX
  const dataArray = new Uint8Array(bufferLength);

  const draw = () => {
    animationRef.current = requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#0d6efd";
    ctx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;

      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      x += sliceWidth;
    }

    ctx.stroke();
  };

  draw();
};


  const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  const audioContext = new AudioContext();
  await audioContext.resume(); // 🔥 important
  audioContextRef.current = audioContext;

  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;

  source.connect(analyser);
  analyserRef.current = analyser;

  mediaRecorderRef.current = new MediaRecorder(stream);
  audioChunksRef.current = [];

  mediaRecorderRef.current.ondataavailable = e => {
    audioChunksRef.current.push(e.data);
  };

  mediaRecorderRef.current.start();
  setRecording(true); // ⬅️ canvas renders AFTER this
};


 const stopRecording=()=>{
    setLoading(true);
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop=async ()=>{
      const audioBlob=new Blob(audioChunksRef.current,{
        type:"audio/webm",
      });
      const formData=new FormData();
      formData.append("file",audioBlob);
      formData.append("receiver",contact.gmail);

      let res= await axios.post("http://localhost:8080/api/message/voice",formData,{
        auth:{
          username:me,
          password: localStorage.getItem("password")
        },
      });
      console.log(res);
      setMessages(prev=>[...prev,res.data]);
      cancelAnimationFrame(animationRef.current);
      audioContextRef.current?.close();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());

      setRecording(false);
      setLoading(false);

    }
 }





  if (!contact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-lg">Select a contact to start chatting</p>
      </div>
    );
  }

  return (
    <>
    <div className="flex-grow-1 d-flex flex-column bg-light" style={{marginLeft:"-55px"}}>
      <div className="bg-white border-bottom p-3 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold"
               style={{width: '40px', height: '40px', background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)'}}>
            {contact.name.charAt(0)}
          </div>
          <div>
            <h6 className="mb-0 fw-semibold">{contact.name}</h6>
            {onlineUsers.includes(contact.gmail)?
            (<p className="mb-0 small text-success">Online</p>)
          :(<p className="mb-0 small text-muted">Offline</p>)}
          </div>
        </div>
        <button className="btn btn-light rounded-circle">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="flex-grow-1 overflow-auto p-4">
        {messages
          .filter(
            msg =>
              msg.sender === contact.gmail || msg.receiver === contact.gmail
          )
          .map((msg, index) => {
            const isMe = msg.sender === me;
            const isAudio = !!msg.audioUrl;

            return (
              <div
                key={index}
                className={`d-flex mb-3 ${
                  isMe ? "justify-content-end" : "justify-content-start"
                }`}
              >
                {isAudio ? (
                   
                  <div>
                   <AudioMessage audioUrl={msg.audioUrl} isMe={msg.sender === me} />
                    <p
                      className="mb-0 text-muted text-end"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {new Date(msg.timeStamp).toLocaleTimeString()}
                    </p>
                  </div>
                ) : (
                  
                  <div
                    className={`px-3 py-2 rounded ${
                      isMe ? "bg-primary text-white" : "bg-white border"
                    }`}
                    style={{ maxWidth: "70%" }}
                  >
                    <p className="mb-1">{msg.content}</p>
                    <p
                      className={`mb-0 ${
                        isMe ? "text-white-50" : "text-muted"
                      }`}
                      style={{ fontSize: "0.75rem" }}
                    >
                      {new Date(msg.timeStamp).toLocaleTimeString()}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

        <div ref={bottomRef} />
      </div>


      <div className="bg-white border-top p-3 position-relative">
        <div className="d-flex gap-2 align-items-center">
          
          {/* Emoji button */}
          <button
            type="button"
            className="btn btn-light"
            onClick={() => setShowEmoji(prev => !prev)}
          >
            <Smile size={22} />
          </button>

          {recording ? (
            <canvas
              ref={canvasRef}
              
              height={40}
              style={{
                width:"80%",
                height:"40px",
                background: "#f1f5f9",
                borderRadius: "8px"
              }}
            />
          ) : (
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="form-control form-control-lg"
            />
          )}


          <button
            onClick={handleSend}
            className="btn btn-primary d-flex align-items-center gap-2"
          >
            <Send size={20} />
          </button>
          <button
            onClick={recording ? stopRecording : startRecording}
            className="btn d-flex align-items-center justify-content-center"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: recording ? "#dc3545" : "#0d6efd",
              color: "white",
              border: "none"
            }}
          >
            {recording ? <SquarePause size={22} /> : <Mic size={22} />}
          </button>

          
          
        </div>

        {/* Emoji Picker */}
        {showEmoji && (
          <div style={{ position: "absolute", bottom: "70px", left: "10px", zIndex: 1000 }}>
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>

    </div>
    

</>
  );
}