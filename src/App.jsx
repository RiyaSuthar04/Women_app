import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, AuthContext } from "./components/authContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MessagesPage from "./pages/MessagesPage";
import Chat from "./components/Chat";
import Profile from "./pages/Profile";
import ManageProfile from "./pages/ManageProfile";

const AppContent = () => {
  const { loggedInUser } = useContext(AuthContext);

  return (
    <Router>
      {/* Show Navbar only when the user is not logged in */}
      {!loggedInUser && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/manageProfile" element={<ManageProfile />} />
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
