import { Link } from "react-router-dom";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const Navbar_one = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const loggedInUser = { name: "Riya Suthar" }; // Example user, replace with actual user data

  return (
    <nav className="bg-[#F5ECE3] shadow-md"> {/* Light beige background */}
      <div className="container mx-auto p-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-[#704B3E]">Women Empowerment Chat</h1>

        {/* Navigation Links and Profile Icon */}
        <div className="flex items-center space-x-6"> {/* Reduced spacing */}
          <Link to="/dashboard" className="text-[#704B3E] hover:text-[#8B5E48]">Home</Link>
          <Link to="/chat" className="text-[#704B3E] hover:text-[#8B5E48]">Messages</Link> 
          <Link to="/profile" className="text-[#704B3E] hover:text-[#8B5E48]">Profile</Link>
          <Link to="/notifications" className="text-[#704B3E] hover:text-[#8B5E48]">Notifications</Link>

          {/* Profile Icon and Dropdown */}
          <div className="relative">
            <button
              className="flex flex-col items-center focus:outline-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <FaUserCircle className="text-[#704B3E] text-2xl cursor-pointer" />
              <span className="text-[#704B3E] text-sm font-medium">{loggedInUser.name}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-[#704B3E] hover:bg-[#FAF5EF]"
                  onClick={() => setDropdownOpen(false)}
                >
                  Manage Profile
                </Link>
                <button
                  className="w-full text-left px-4 py-2 text-[#704B3E] hover:bg-[#FAF5EF]"
                  onClick={() => {
                    setDropdownOpen(false);
                    console.log("User logged out"); // Replace with logout function
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar_one;
