import { useState } from "react";
import Navbar_one from "../components/Navbar_one";

const ManageProfile = ({ user }) => {
  const [profileData, setProfileData] = useState({
    address: "",
    college: "",
    school: "",
    profession: "",
    skills: "",
    documents: null,
    certificates: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", profileData);
    // API call to save data to the database
  };

  return (
    <div className="container mx-auto p-6">
        <Navbar_one/>
      <h1 className="text-2xl font-bold mb-4">Manage Profile</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Basic Information</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <input type="text" name="address" placeholder="Address" value={profileData.address} onChange={handleChange} className="border p-2 w-full mt-2" />
        </div>

        {/* Education Details */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Education Details</h2>
          <input type="text" name="college" placeholder="College" value={profileData.college} onChange={handleChange} className="border p-2 w-full mt-2" />
          <input type="text" name="school" placeholder="School" value={profileData.school} onChange={handleChange} className="border p-2 w-full mt-2" />
        </div>

        {/* Work Information (for Literate users) */}
        {user.isLiterate && (
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Work Information</h2>
            <input type="text" name="profession" placeholder="Working Profession" value={profileData.profession} onChange={handleChange} className="border p-2 w-full mt-2" />
          </div>
        )}

        {/* Skills & Documents */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Skills & Documents</h2>
          <input type="text" name="skills" placeholder="Skills" value={profileData.skills} onChange={handleChange} className="border p-2 w-full mt-2" />
          {user.isLiterate ? (
            <input type="file" name="documents" onChange={handleFileChange} className="border p-2 w-full mt-2" />
          ) : (
            <input type="file" name="certificates" onChange={handleFileChange} className="border p-2 w-full mt-2" />
          )}
        </div>
      </div>
      
      {/* Submit Button */}
      <button onClick={handleSubmit} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Save Profile</button>
    </div>
  );
};

export default ManageProfile;
