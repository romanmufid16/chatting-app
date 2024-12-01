import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Cookies from "js-cookie";

const ChatPage = () => {
  const [username, setUsername] = useState("user1"); // Set username jika diperlukan
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Inisialisasi socket hanya sekali saat komponen di-mount
    const socketInstance = io("http://localhost:5000", {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      auth: {
        token: Cookies.get("token") // Mengambil token dari cookies
      }
    });

    setSocket(socketInstance); // Simpan socket instance ke state

    // Ketika socket terhubung
    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);

      // Kirimkan username setelah socket terhubung
      socketInstance.emit("setUsername", username);
    });

    // Mendengarkan pesan yang diterima
    socketInstance.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Menangani error jika terjadi
    socketInstance.on("error", (error) => {
      console.error(error);
    });

    // Clean up saat komponen unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [username]); // Efek hanya akan dijalankan ketika username berubah

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      const messageData = {
        content: message,
        senderId: username,
        receiverId: "user2", // Ganti dengan receiver yang sesuai
      };

      // Kirimkan pesan ke server melalui socket
      socket.emit("sendMessage", messageData);
      setMessage(""); // Reset input message
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg.content}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        className="bg-slate-200 border border-black"
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatPage;
