import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function HomePage() {
  return (
    <div>
      <Navbar />

      <section className="hero">
        <div className="heroContent">
          <span className="badge">AI Powered Hospital System</span>

          <h1>Smart Hospital Management System</h1>

          <p>
            A modern web platform for patients, doctors, and administrators,
            including appointment booking, medical records, and AI-based health
            suggestions.
          </p>

          <div className="heroButtons">
            <Link to="/register" className="primaryButton">
              Get Started
            </Link>

            <Link to="/login" className="secondaryButton">
              Login
            </Link>
          </div>
        </div>

        <div className="heroCard">
          <h3>System Modules</h3>
          <p>Patient Module</p>
          <p>Doctor Module</p>
          <p>Admin Module</p>
          <p>AI Health Assistant</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;