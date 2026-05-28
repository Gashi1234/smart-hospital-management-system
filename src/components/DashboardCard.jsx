function DashboardCard({ title, value, description }) {
    return (
      <div className="dashboardCard">
        <h3>{title}</h3>
        <strong>{value}</strong>
        <p>{description}</p>
      </div>
    );
  }
  
  export default DashboardCard;