import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/auth.css";

function RegisterPage() {
  return (
    <div>
      <Navbar />

      <main className="authPage">
        <section className="authCard">
          <div className="authHeader">
            <span className="badge">Create Account</span>
            <h1>Register as Patient</h1>
            <p>Create your account to book appointments and use AI suggestions.</p>
          </div>

          <form className="authForm">
            <label>Full Name</label>
            <input type="text" placeholder="Enter your full name" />

            <label>Email Address</label>
            <input type="email" placeholder="Enter your email" />

            <label>Password</label>
            <input type="password" placeholder="Create a password" />

            <label>Phone Number</label>
            <input type="text" placeholder="Enter your phone number" />

            <button type="button" className="authButton">
              Register
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