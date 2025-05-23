import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5001");

const ChatBox = ({ userId, receiverId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const room = [userId, receiverId].sort().join("_");

  useEffect(() => {
    socket.emit("join", { room });

    socket.on("chat_history", (history) => {
      setMessages(history);
    });

    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("message");
      socket.off("chat_history");
    };
  }, [room]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("message", {
        sender_id: userId,
        receiver_id: receiverId,
        message,
        room,
      });
      setMessages((prev) => [...prev, { sender: userId, message }]);
      setMessage("");
    }
  };

  return (
    <div>
      <h3>Chat with {receiverId}</h3>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            {msg.sender === userId ? "Me" : "Them"}: {msg.message}
          </p>
        ))}
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatBox;
