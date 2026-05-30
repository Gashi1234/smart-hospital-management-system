import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Sidebar({ role, links = [] }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

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

        <button
          className="logoutButton"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;