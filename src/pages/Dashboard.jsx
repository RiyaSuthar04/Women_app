import { useState } from "react";
import Navbar_one from "../components/Navbar_one";

const Dashboard = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "Riya Suthar",
      content:
        'A heartfelt thank you to everyone who made the “Blood Donation and Thalassemia Test Camp” a grand success! 🟡️ ...more',
    },
  ]);

  return (
    <div className="min-h-screen bg-[#F5ECE3]"> 
      {/* Navbar */}
      <Navbar_one />

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <aside className="lg:col-span-1 bg-[#FAF5EF] p-6 rounded-lg shadow-md border border-[#E2D5C3]">
            <h2 className="text-xl font-bold text-[#704B3E] mb-4">Riya Suthar</h2>
            <p className="text-gray-700">Student At Gujarat Technological University</p>
            <p className="text-gray-700">Ahmedabad, Gujarat</p>

            <div className="mt-6">
              <h3 className="font-bold text-[#704B3E] mb-2">Profile viewers</h3>
              <button className="text-purple-600 hover:underline">View all analytics</button>
            </div>

            <div className="mt-6">
              <h3 className="font-bold text-[#704B3E] mb-2">Grow your career with Premium</h3>
              <p className="text-gray-700">Don’t miss: Premium for ₹0</p>
              <p className="text-gray-700">Saved items</p>
              <p className="text-gray-700">Groups</p>
            </div>
          </aside>

          {/* Feed */}
          <main className="lg:col-span-2 bg-[#FAF5EF] p-6 rounded-lg shadow-md border border-[#E2D5C3]">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#704B3E] mb-4">Start a post</h2>
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 text-gray-700">
                  <span>Media</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-700">
                  <span>Event</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-700">
                  <span>Write article</span>
                </button>
              </div>
            </div>

            {/* Display Posts */}
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white p-6 rounded-lg shadow-sm border border-[#E2D5C3]"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                    <div>
                      <h3 className="font-bold text-[#704B3E]">{post.user}</h3>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <p className="text-gray-800">{post.content}</p>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
