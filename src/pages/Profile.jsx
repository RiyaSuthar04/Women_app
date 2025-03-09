import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../components/authContext";
import axios from "axios";
import Navbar_one from "../components/Navbar_one";

const Profile = () => {
  const { loggedInUser } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    college: "",
    school: "",
    profession: "",
    skills: "",
    documents: "",
    certificates: "",
  });

  // Fetch user profile data
  useEffect(() => {
    if (loggedInUser) {
      axios
        .get(`http://localhost:5000/profile/${loggedInUser._id}`)
        .then((res) => {
          setProfileData(res.data);
          setFormData(res.data);
        })
        .catch((err) => console.error("Failed to fetch profile data:", err));
    }
  }, [loggedInUser]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (profileData) {
        await axios.put(`http://localhost:5000/profile/${loggedInUser._id}`, formData);
      } else {
        await axios.post("http://localhost:5000/profile", { ...formData, userId: loggedInUser._id });
      }
      setEditMode(false);
      setProfileData(formData);
    } catch (err) {
      console.error("Error saving profile data:", err);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#F5ECE3]">
      <Navbar_one />
      <div className="flex flex-grow justify-center items-center">
        <div className="w-2/3 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-[#704B3E] mb-4">Profile</h2>
          <p><strong>Name:</strong> {loggedInUser.firstName} {loggedInUser.lastName}</p>
          <p><strong>Email:</strong> {loggedInUser.email}</p>
          {editMode ? (
            <form onSubmit={handleSubmit} className="mt-4">
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full p-2 border rounded-md mb-2" />
              <input type="text" name="college" value={formData.college} onChange={handleChange} placeholder="College" className="w-full p-2 border rounded-md mb-2" />
              <input type="text" name="school" value={formData.school} onChange={handleChange} placeholder="School" className="w-full p-2 border rounded-md mb-2" />
              {loggedInUser.role === "literate" ? (
                <>
                  <input type="text" name="profession" value={formData.profession} onChange={handleChange} placeholder="Working Profession Details" className="w-full p-2 border rounded-md mb-2" />
                  <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="Additional Skills" className="w-full p-2 border rounded-md mb-2" />
                  <input type="text" name="documents" value={formData.documents} onChange={handleChange} placeholder="Documents" className="w-full p-2 border rounded-md mb-2" />
                </>
              ) : (
                <>
                  <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="Skills" className="w-full p-2 border rounded-md mb-2" />
                  <input type="text" name="certificates" value={formData.certificates} onChange={handleChange} placeholder="Certificates" className="w-full p-2 border rounded-md mb-2" />
                </>
              )}
              <button type="submit" className="bg-[#704B3E] text-white px-4 py-2 rounded-md">Save</button>
            </form>
          ) : (
            <>
              {profileData ? (
                <div className="mt-4">
                  <p><strong>Address:</strong> {profileData.address}</p>
                  <p><strong>College:</strong> {profileData.college}</p>
                  <p><strong>School:</strong> {profileData.school}</p>
                  {loggedInUser.role === "literate" ? (
                    <>
                      <p><strong>Working Profession:</strong> {profileData.profession}</p>
                      <p><strong>Additional Skills:</strong> {profileData.skills}</p>
                      <p><strong>Documents:</strong> {profileData.documents}</p>
                    </>
                  ) : (
                    <>
                      <p><strong>Skills:</strong> {profileData.skills}</p>
                      <p><strong>Certificates:</strong> {profileData.certificates}</p>
                    </>
                  )}
                  <button onClick={() => setEditMode(true)} className="bg-[#704B3E] text-white px-4 py-2 mt-2 rounded-md">Edit Info</button>
                </div>
              ) : (
                <button onClick={() => setEditMode(true)} className="bg-[#704B3E] text-white px-4 py-2 mt-4 rounded-md">Add Info</button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
