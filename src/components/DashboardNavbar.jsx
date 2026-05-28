function DashboardNavbar({ title }) {
    return (
      <header className="dashboardNavbar">
        <div>
          <h1>{title}</h1>
          <p>Smart Hospital Management System</p>
        </div>
  
        <div className="profileBadge">MG</div>
      </header>
    );
  }
  
  export default DashboardNavbar;