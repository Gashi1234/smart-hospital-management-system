import { useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import DashboardCard from "../components/DashboardCard";
import { doctors } from "../data/doctors";
import "../styles/dashboard.css";
import AISymptomChecker from "../components/AISymptomChecker";

function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);

  const bookAppointment = (doctor) => {
    const newAppointment = {
      id: Date.now(),
      doctor: doctor.name,
      department: doctor.department,
      time: doctor.availableTime,
    };

    setAppointments([...appointments, newAppointment]);
  };

  return (
    <div className="dashboardLayout">
      <Sidebar role="Patient" />

      <main className="dashboardMain">
        <DashboardNavbar title="Patient Dashboard" />

        <section className="dashboardGrid">
          <DashboardCard
            title="Appointments"
            value={appointments.length}
            description="Upcoming appointments"
          />

          <DashboardCard
            title="AI Suggestions"
            value="Active"
            description="Enter symptoms and receive recommendations"
          />

          <DashboardCard
            title="Medical Records"
            value="5"
            description="Saved health records"
          />
        </section>

        <section className="dashboardPanel">
          <h2>Book Appointment</h2>

          <div className="doctorGrid">
            {doctors.map((doctor) => (
              <div className="doctorCard" key={doctor.id}>
                <h3>{doctor.name}</h3>
                <p>{doctor.department}</p>
                <span>{doctor.availableTime}</span>

                <button onClick={() => bookAppointment(doctor)}>
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboardPanel">
          <h2>My Appointments</h2>

          {appointments.length === 0 ? (
            <p className="emptyText">No appointments booked yet.</p>
          ) : (
            <div className="appointmentList">
              {appointments.map((appointment) => (
                <div className="appointmentItem" key={appointment.id}>
                  <strong>{appointment.doctor}</strong>
                  <p>{appointment.department}</p>
                  <span>{appointment.time}</span>
                </div>
              ))}
            </div>
          )}
        </section>
        <AISymptomChecker />
      </main>
    </div>
  );
}

export default PatientDashboard;