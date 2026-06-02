import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { registerUser } from "../services/authService.js";
import {
  saveUserProfile,
  getStaffProfileByEmail,
} from "../services/firestoreService";
import "../styles/auth.css";

function RegisterPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    try {
      const userCredential = await registerUser(email, password);

      const staffProfile = await getStaffProfileByEmail(email);

      const userRole = staffProfile?.role || "Patient";

      await saveUserProfile(userCredential.user.uid, {
        fullName: staffProfile?.doctorName || fullName,
        email,
        phoneNumber,
        role: userRole,
        doctorName: staffProfile?.doctorName || "",
        department: staffProfile?.department || "",
        availableTime: staffProfile?.availableTime || "",
      });

      localStorage.setItem("userRole", userRole);

      if (userRole === "Doctor") {
        navigate("/doctor");
      } else if (userRole === "Admin") {
        navigate("/admin");
      } else {
        navigate("/patient");
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
            <span className="badge">Create Account</span>
            <h1>Register Account</h1>
            <p>
              Create your account. Approved staff emails will automatically get
              the correct hospital role.
            </p>
          </div>

          <form className="authForm">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label>Phone Number</label>
            <input
              type="text"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            {error && <p className="errorText">{error}</p>}

            <button
              type="button"
              className="authButton"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="authFooter">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </section>
      </main>
    </div>
  );
}

export default RegisterPage;