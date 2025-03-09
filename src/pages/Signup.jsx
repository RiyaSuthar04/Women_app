import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [role, setRole] = useState("selectRole"); // Default to "selectRole"
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Add password state
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState("");
  const [job, setJob] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Prepare user data based on role
    const userData = {
      firstName,
      lastName,
      email,
      password, // Include password in the request
      role,
      ...(role === "iliterate" ? { skills } : { education, job }),
    };

    console.log("Sending signup request:", userData); // Log the request data

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log("Signup response:", data); // Log the response

      if (response.ok) {
        navigate("/login"); // Redirect to login page after successful signup
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err); // Log the error
      setError("Something went wrong");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/women_bg.jpg')",
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        backgroundBlendMode: "lighten",
      }}
    >
      <div className="bg-white p-10 rounded-lg shadow-md max-w-lg w-full">
        <h2 className="text-3xl font-bold text-center mb-8">Sign Up</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSignup}>
          {/* Common Fields */}
          <input
            type="text"
            placeholder="First Name"
            className="w-full p-3 border rounded mb-4"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            className="w-full p-3 border rounded mb-4"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/* Password Field */}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Literacy Dropdown */}
          <select
            className="w-full p-3 border rounded mb-4"
            onChange={(e) => setRole(e.target.value)}
            value={role}
            required
          >
            <option value="selectRole">--Select Roles--</option>
            <option value="iliterate">Iliterate</option>
            <option value="literate">Literate</option>
          </select>

          {/* Dependent Fields Based on Literacy */}
          {role !== "selectRole" && (
            <>
              {role === "iliterate" ? (
                <input
                  type="text"
                  placeholder="Skills"
                  className="w-full p-3 border rounded mb-4"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  required
                />
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Education"
                    className="w-full p-3 border rounded mb-4"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Job"
                    className="w-full p-3 border rounded mb-4"
                    value={job}
                    onChange={(e) => setJob(e.target.value)}
                    required
                  />
                </>
              )}
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#7D5A50] text-white px-4 py-2 rounded-lg p-3 rounded hover:bg-purple-700 transition-colors"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;