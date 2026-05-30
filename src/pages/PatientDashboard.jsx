import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import DashboardCard from "../components/DashboardCard";
import { doctors } from "../data/doctors";
import "../styles/dashboard.css";
import AISymptomChecker from "../components/AISymptomChecker";
import {
  addAppointment,
  getAppointmentsByPatient,
  getDiagnosesByPatient,
} from "../services/firestoreService";
import { auth } from "../firebase";

function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);

  const loadPatientData = async (email) => {
    const appointmentData = await getAppointmentsByPatient(email);
    const diagnosisData = await getDiagnosesByPatient(email);

    setAppointments(appointmentData);
    setDiagnoses(diagnosisData);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        loadPatientData(user.email);
      }
    });

    return () => unsubscribe();
  }, []);

  const bookAppointment = async (doctor) => {
    const currentUser = auth.currentUser;

    const newAppointment = {
      patientEmail: currentUser?.email || "Unknown patient",
      doctor: doctor.name,
      department: doctor.department,
      time: doctor.availableTime,
      status: "Booked",
    };

    await addAppointment(newAppointment);

    if (currentUser) {
      loadPatientData(currentUser.email);
    }
  };

  return (
    <div className="dashboardLayout">
      <Sidebar
        role="Patient"
        links={[
          { label: "Dashboard", href: "#dashboard" },
          { label: "Appointments", href: "#appointments" },
          { label: "Medical Records", href: "#medical-records" },
          { label: "AI Assistant", href: "#ai-assistant" },
        ]}
      />

      <main className="dashboardMain">
        <DashboardNavbar title="Patient Dashboard" />

        <section id="dashboard" className="dashboardGrid">
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
            value={diagnoses.length}
            description="Saved diagnosis records"
          />
        </section>

        <section id="appointments" className="dashboardPanel">
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
                  <p>Patient: {appointment.patientEmail}</p>
                  <p>{appointment.department}</p>
                  <p>Status: {appointment.status}</p>
                  <span>{appointment.time}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section id="medical-records" className="dashboardPanel">
        <h2>Medical Records</h2>

          {diagnoses.length === 0 ? (
            <p className="emptyText">No diagnosis records yet.</p>
          ) : (
            <div className="appointmentList">
              {diagnoses.map((record) => (
                <div className="appointmentItem" key={record.id}>
                  <strong>{record.doctor}</strong>
                  <p>Department: {record.department}</p>
                  <p>Diagnosis: {record.diagnosis}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <div id="ai-assistant">
          <AISymptomChecker />
        </div>
      </main>
    </div>
  );
}

export default PatientDashboard;