import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Navbar = () => {
  return (
    <nav className="w-full bg-[#F4EDE8] py-4 px-6 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold text-[#7D5A50]">Women Empowerment Chat</h1>
      <div>
        {/* Link to Login Page */}
        <Link to="/login">
          <button className="text-[#7D5A50] font-semibold mr-4">Login</button>
        </Link>
        {/* Link to Sign Up Page */}
        <Link to="/signup">
          <button className="bg-[#7D5A50] text-white px-4 py-2 rounded-lg">
            Sign Up
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;