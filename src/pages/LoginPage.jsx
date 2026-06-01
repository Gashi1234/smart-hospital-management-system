import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { loginUser } from "../services/authService";
import { getUserProfile } from "../services/firestoreService";
import "../styles/auth.css";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const userCredential = await loginUser(email, password);
      const userProfile = await getUserProfile(userCredential.user.uid);

      if (!userProfile) {
        setError("User profile not found. Please contact admin.");
        setLoading(false);
        return;
      }

      localStorage.setItem("userRole", userProfile.role);

      if (userProfile.role === "Patient") {
        navigate("/patient");
      } else if (userProfile.role === "Doctor") {
        navigate("/doctor");
      } else if (userProfile.role === "Admin") {
        navigate("/admin");
      } else {
        setError("Invalid user role.");
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div>
      <Navbar />

      <main className="authPage">
        <section className="authCard">
          <div className="authHeader">
            <span className="badge">Welcome Back</span>
            <h1>Login to SmartCare AI</h1>
            <p>Access your hospital dashboard based on your assigned role.</p>
          </div>

          <form className="authForm">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="errorText">{error}</p>}

            <button
              type="button"
              className="authButton"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
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