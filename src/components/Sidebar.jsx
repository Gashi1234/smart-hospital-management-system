import { Link } from "react-router-dom";

function Sidebar({ role }) {
  return (
    <aside className="sidebar">
      <h2>SmartCare AI</h2>
      <p>{role} Panel</p>

      <nav className="sidebarLinks">
        <Link to="/patient">Dashboard</Link>
        <Link to="/patient">Appointments</Link>
        <Link to="/patient">AI Assistant</Link>
        <Link to="/login">Logout</Link>
      </nav>
    </aside>
  );
}

export default Sidebar;