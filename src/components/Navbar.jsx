import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        SmartCare AI
      </Link>

      <div className="navLinks">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register" className="navButton">
          Register
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;