import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

const MessagesPage = ({ loggedInUser }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/users")
      .then(response => {
        console.log("Fetched users:", response.data);  // Debugging step
        setUsers(response.data);
      })
      .catch(error => console.error("Error fetching users:", error));
  }, []);
  
  
  

  return (
    <div className="flex h-screen">
      {/* Sidebar for Users */}
      <div className="w-1/4 bg-gray-100 p-4 border-r">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <ul>
          {users.map(user => (
            <li 
              key={user._id} 
              className={`p-3 cursor-pointer rounded-lg ${
                selectedUser?._id === user._id ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`} 
              onClick={() => setSelectedUser(user)}
            >
              {user.firstName}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Section */}
      <div className="w-3/4 p-6">
        {selectedUser ? (
          <>
            <h2 className="text-xl font-bold mb-2">Chat with {selectedUser.name}</h2>
            <div className="border p-4 h-[500px] overflow-y-auto bg-white shadow-md rounded-md">
              {/* Chat messages will go here */}
              <p className="text-gray-500 italic">Start a conversation...</p>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center mt-20">Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
