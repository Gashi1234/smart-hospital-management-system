import { Link } from "react-router-dom";

function Sidebar({ role, links = [] }) {
  return (
    <aside className="sidebar">
      <h2>SmartCare AI</h2>
      <p>{role} Panel</p>

      <nav className="sidebarLinks">
        {links.map((link) => (
          <a key={link.label} href={link.href}>
            {link.label}
          </a>
        ))}

        <Link to="/login">Logout</Link>
      </nav>
    </aside>
  );
}

export default Sidebar;