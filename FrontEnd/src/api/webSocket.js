import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectWebSocket = (userEmail, onMessage) => {
  // Disconnect existing connection if any
  if (stompClient && stompClient.connected) {
    stompClient.deactivate();
  }

  stompClient = new Client({
    brokerURL: `ws://localhost:8080/ws?user=${userEmail}`,

    onConnect: () => {
      console.log("✅ WebSocket Connected for user:", userEmail);
      
      stompClient.subscribe("/user/queue/messages", (msg) => {
        console.log("📨 Message received:", msg.body);
        onMessage(JSON.parse(msg.body));
      });
    },

    onStompError: (frame) => {
      console.error("❌ STOMP error:", frame);
    },

    debug: (str) => console.log("🔍", str),
  });

  stompClient.activate();
};

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

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
  }
};