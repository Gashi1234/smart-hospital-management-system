import { useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import DashboardCard from "../components/DashboardCard";
import DiagnosisModal from "../components/DiagnosisModal";
import "../styles/dashboard.css";

const patientAppointments = [
  {
    id: 1,
    patientName: "Ardit Gashi",
    time: "10:00 AM",
    symptoms: "Chest pain and shortness of breath",
    department: "Cardiology",
  },
  {
    id: 2,
    patientName: "Elira Krasniqi",
    time: "12:30 PM",
    symptoms: "Headache and dizziness",
    department: "Neurology",
  },
];

function DoctorDashboard() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);

  const saveDiagnosis = () => {
    setSavedNotes([
      ...savedNotes,
      {
        id: Date.now(),
        patientName: selectedPatient.patientName,
        diagnosis,
      },
    ]);

    setSelectedPatient(null);
    setDiagnosis("");
  };

  return (
    <div className="dashboardLayout">
      <Sidebar role="Doctor" />

      <main className="dashboardMain">
        <DashboardNavbar title="Doctor Dashboard" />

        <section className="dashboardGrid">
          <DashboardCard title="Appointments" value="2" description="Today’s consultations" />
          <DashboardCard title="Symptoms" value="2" description="Patients submitted symptoms" />
          <DashboardCard title="Notes" value={savedNotes.length} description="Saved diagnosis notes" />
        </section>

        <section className="dashboardPanel">
          <h2>Patient Appointments</h2>

          <div className="appointmentList">
            {patientAppointments.map((patient) => (
              <div className="appointmentItem" key={patient.id}>
                <strong>{patient.patientName}</strong>
                <p>{patient.department}</p>
                <p>{patient.symptoms}</p>
                <span>{patient.time}</span>

                <button
                  className="smallActionButton"
                  onClick={() => setSelectedPatient(patient)}
                >
                  Add Diagnosis
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboardPanel">
          <h2>Saved Medical Notes</h2>

          {savedNotes.length === 0 ? (
            <p className="emptyText">No diagnosis notes saved yet.</p>
          ) : (
            <div className="appointmentList">
              {savedNotes.map((note) => (
                <div className="appointmentItem" key={note.id}>
                  <strong>{note.patientName}</strong>
                  <p>{note.diagnosis}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <DiagnosisModal
        selectedPatient={selectedPatient}
        diagnosis={diagnosis}
        setDiagnosis={setDiagnosis}
        onSave={saveDiagnosis}
        onClose={() => setSelectedPatient(null)}
      />
    </div>
  );
}

export default DoctorDashboard;