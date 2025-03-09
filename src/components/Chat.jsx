import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../components/authContext";
import { io } from "socket.io-client";
import axios from "axios";
import Navbar_one from "./Navbar_one";

const socket = io("http://localhost:5000");

const Chat = () => {
  const { loggedInUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/chat`);
        setUsers(response.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, [loggedInUser]);

  useEffect(() => {
    if (loggedInUser) {
      socket.emit("user_login", loggedInUser._id);
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (loggedInUser && selectedUser) {
      const roomId = [loggedInUser._id, selectedUser._id].sort().join("_");
      socket.emit("join_room", roomId);
    }
  }, [selectedUser, loggedInUser]);

  useEffect(() => {
    const handleUserStatusUpdate = ({ userId, status }) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status } : user
        )
      );
    };

    socket.on("user_status_update", handleUserStatusUpdate);

    return () => {
      socket.off("user_status_update", handleUserStatusUpdate);
    };
  }, []);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      if (
        (data.senderId === loggedInUser._id && data.receiverId === selectedUser?._id) ||
        (data.senderId === selectedUser?._id && data.receiverId === loggedInUser._id)
      ) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    };

    socket.off("receive_message");
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [loggedInUser, selectedUser]);

  useEffect(() => {
    if (!loggedInUser || !selectedUser) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/chat/${loggedInUser._id}/${selectedUser._id}`
        );
        setMessages(response.data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchMessages();
  }, [selectedUser, loggedInUser]);

  const sendMessage = async () => {
    if (!message.trim() || !loggedInUser || !selectedUser) return;

    const messageData = {
      senderId: loggedInUser._id,
      receiverId: selectedUser._id,
      message: message,
    };

    try {
      const response = await axios.post("http://localhost:5000/chat", messageData, {
        headers: { "Content-Type": "application/json" },
      });

      const savedMessage = response.data;
      const roomId = [loggedInUser._id, selectedUser._id].sort().join("_");
      socket.emit("send_message", { ...savedMessage, roomId });

      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#F5ECE3]">
      <Navbar_one />

      <div className="flex flex-grow">
        <div className="w-1/4 bg-[#FAF5EF] p-4 border-r border-[#E2D5C3] shadow-md">
          <h2 className="text-xl font-bold text-[#704B3E] mb-4">Users</h2>
          <ul>
            {users.map((user) => (
              <li
                key={user._id}
                className={`p-3 cursor-pointer flex items-center justify-between rounded-lg ${
                  selectedUser?._id === user._id ? "bg-[#704B3E] text-white" : "hover:bg-[#EEDCC3]"
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <span>{user.firstName} {user.lastName}</span>
                <span className={`w-3 h-3 rounded-full ${user.status === "online" ? "bg-green-500" : "bg-gray-400"}`}></span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 flex flex-col bg-[#FAF5EF] border-l border-[#E2D5C3]">
          {selectedUser ? (
            <>
              <div className="p-4 border-b border-[#E2D5C3] bg-[#FAF5EF] flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#704B3E]">{selectedUser.firstName} {selectedUser.lastName}</h2>
                <span className={`${selectedUser.status === "online" ? "text-green-500" : "text-gray-500"}`}>
                  {selectedUser.status}
                </span>
              </div>

              <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((msg, index) => (
                  <div key={index} className={`mb-3 flex ${msg.senderId === loggedInUser._id ? "justify-end" : "justify-start"}`}>
                    <div className={`p-3 rounded-lg shadow-md max-w-xs ${
                      msg.senderId === loggedInUser._id ? "bg-[#704B3E] text-white" : "bg-[#EEDCC3] text-[#704B3E]"
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-[#E2D5C3] bg-[#FAF5EF] flex items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none border-[#E2D5C3] bg-[#F5ECE3] text-[#704B3E]"
                />
                <button onClick={sendMessage} className="bg-[#704B3E] text-white px-4 py-2 ml-2 rounded-lg">Send</button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Chat;
