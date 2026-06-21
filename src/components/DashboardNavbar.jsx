import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { getUserProfile } from "../services/firestoreService";

function DashboardNavbar({ title }) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) return;

      setUserEmail(currentUser.email || "");

      const profile = await getUserProfile(currentUser.uid);

      if (profile?.fullName) {
        setUserName(profile.fullName);
      } else if (profile?.doctorName) {
        setUserName(profile.doctorName);
      } else {
        setUserName(currentUser.email || "User");
      }
    };

    loadUser();
  }, []);

  const getInitials = () => {
    const nameToUse = userName || userEmail || "User";

    if (nameToUse.includes("@")) {
      return nameToUse.charAt(0).toUpperCase();
    }

    return nameToUse
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <header className="dashboardNavbar">
      <div>
        <h1>{title}</h1>
        <p>Smart Hospital Management System</p>
      </div>

      <div className="navbarUserBox">
        <div className="navbarUserText">
          <strong>{userName || "User"}</strong>
          <span>{userEmail}</span>
        </div>

        <div className="profileBadge">{getInitials()}</div>
      </div>
    </header>
  );
}

export default DashboardNavbar;