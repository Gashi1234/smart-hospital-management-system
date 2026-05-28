import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/auth.css";

function LoginPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState("Patient");

  const handleLogin = () => {
    if (role === "Patient") {
      navigate("/patient");
    } else if (role === "Doctor") {
      navigate("/doctor");
    } else if (role === "Admin") {
      navigate("/admin");
    }
  };

  return (
    <div>
      <Navbar />

      <main className="authPage">
        <section className="authCard">
          <div className="authHeader">
            <span className="badge">Welcome Back</span>
            <h1>Login to SmartCare AI</h1>
            <p>Access your hospital dashboard based on your role.</p>
          </div>

          <form className="authForm">
            <label>Email Address</label>
            <input type="email" placeholder="Enter your email" />

            <label>Password</label>
            <input type="password" placeholder="Enter your password" />

            <label>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option>Patient</option>
              <option>Doctor</option>
              <option>Admin</option>
            </select>

            <button
              type="button"
              className="authButton"
              onClick={handleLogin}
            >
              Login
            </button>
          </form>

          <p className="authFooter">
            Don’t have an account? <Link to="/register">Register here</Link>
          </p>
        </section>
      </main>
    </div>
  );
}

export default LoginPage;