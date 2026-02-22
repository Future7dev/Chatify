import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectWebSocket = (userEmail, onMessage,onPresence,onTyping) => {
  // Disconnect existing connection if any
  if (stompClient && stompClient.connected) {
    stompClient.deactivate();
  }

  stompClient = new Client({
    brokerURL: `ws://localhost:8080/ws?user=${userEmail}`,
    connectHeaders: {
    gmail: userEmail   // ✅ THIS is what Spring reads
    },
    onConnect: () => {
      console.log("✅ WebSocket Connected for user:", userEmail);
      
      stompClient.subscribe("/user/queue/messages", (msg) => {
        console.log("📨 Message received:", msg.body);
        onMessage(JSON.parse(msg.body));
      });

      stompClient.subscribe("/topic/presence", (msg) => {
        console.log("the presence",msg);
        onPresence(JSON.parse(msg.body));
      });
      
      stompClient.subscribe(`/topic/typing/${userEmail}`,(msg)=>{
        console.log(" typing :"+msg.body)
        onTyping(JSON.parse(msg.body));
      })

    },

    onStompError: (frame) => {
      console.error("❌ STOMP error:", frame);
    },

    debug: (str) => console.log("🔍", str),
  });

  stompClient.activate();
};

export const subscribeToGroup = (groupId, onMessage) => {
  if (!stompClient || !stompClient.connected) return;

  stompClient.subscribe(`/topic/group/${groupId}`, (msg) => {
    onMessage(JSON.parse(msg.body));
  });
};

export const sendGroupMessage=(sender,groupId,content)=>{
  if (!stompClient || !stompClient.connected) {
    console.error("❌ WebSocket not connected!");
    return;
  }

  const message={sender,groupId,content};

  stompClient.publish({
    destination: "/app/chat.group",
    body: JSON.stringify(message),
  })
}

export const sendMessage = (sender, receiver, content) => {
  if (!stompClient || !stompClient.connected) {
    console.error("❌ WebSocket not connected!");
    return;
  }

  const message = { sender, receiver, content };
  console.log("📤 Sending message:", message);

  stompClient.publish({
    destination: "/app/chat.send",
    body: JSON.stringify(message),
  });
};

export const sendTyping = (sender, receiver) => {
  stompClient.publish({
    destination: "/app/chat.typing",
    body: JSON.stringify({ sender, receiver }),
  });
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
  }
};