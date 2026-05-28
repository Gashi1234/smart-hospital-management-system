import { useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import DashboardCard from "../components/DashboardCard";
import { doctors } from "../data/doctors";
import { patients } from "../data/patients";
import "../styles/dashboard.css";

function AdminDashboard() {
  const [doctorList, setDoctorList] = useState(doctors);

  const addDoctor = () => {
    const newDoctor = {
      id: Date.now(),
      name: "Dr. New Doctor",
      department: "General Medicine",
      availableTime: "03:00 PM",
    };

    setDoctorList([...doctorList, newDoctor]);
  };

  return (
    <div className="dashboardLayout">
      <Sidebar role="Admin" />

      <main className="dashboardMain">
        <DashboardNavbar title="Admin Dashboard" />

        <section className="dashboardGrid">
          <DashboardCard title="Doctors" value={doctorList.length} description="Registered doctors" />
          <DashboardCard title="Patients" value={patients.length} description="Patient records" />
          <DashboardCard title="Reports" value="3" description="Hospital activity reports" />
        </section>

        <section className="dashboardPanel">
          <h2>Manage Doctors and Departments</h2>

          <button className="smallActionButton" onClick={addDoctor}>
            Add Doctor
          </button>

          <div className="appointmentList">
            {doctorList.map((doctor) => (
              <div className="appointmentItem" key={doctor.id}>
                <strong>{doctor.name}</strong>
                <p>{doctor.department}</p>
                <span>{doctor.availableTime}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboardPanel">
          <h2>Patient Records</h2>

          <div className="appointmentList">
            {patients.map((patient) => (
              <div className="appointmentItem" key={patient.id}>
                <strong>{patient.name}</strong>
                <p>Age: {patient.age}</p>
                <p>{patient.department}</p>
                <p>{patient.symptoms}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboardPanel">
          <h2>Reports and Analytics</h2>

          <div className="reportGrid">
            <div className="reportBox">
              <strong>Cardiology</strong>
              <p>Most requested department</p>
            </div>

            <div className="reportBox">
              <strong>Fever / Cough</strong>
              <p>Common symptoms</p>
            </div>

            <div className="reportBox">
              <strong>5 Appointments</strong>
              <p>Total daily hospital activity</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;