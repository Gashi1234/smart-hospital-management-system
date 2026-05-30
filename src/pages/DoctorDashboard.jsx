import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import DashboardCard from "../components/DashboardCard";
import DiagnosisModal from "../components/DiagnosisModal";
import {
  getAppointments,
  addDiagnosis,
  getDiagnoses,
} from "../services/firestoreService";
import "../styles/dashboard.css";

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);

  const loadAppointments = async () => {
    const data = await getAppointments();
    setAppointments(data);
  };

  const loadDiagnoses = async () => {
    const data = await getDiagnoses();
    setSavedNotes(data);
  };

  useEffect(() => {
    loadAppointments();
    loadDiagnoses();
  }, []);

  const saveDiagnosis = async () => {
    if (!selectedPatient) {
      alert("No patient selected.");
      return;
    }
  
    if (!diagnosis.trim()) {
      alert("Please write a diagnosis before saving.");
      return;
    }
  
    try {
      const diagnosisData = {
        appointmentId: selectedPatient.id,
        patientEmail: selectedPatient.patientEmail || "Unknown patient",
        doctor: selectedPatient.doctor || "Unknown doctor",
        department: selectedPatient.department || "Unknown department",
        diagnosis,
      };
  
      await addDiagnosis(diagnosisData);
  
      setSelectedPatient(null);
      setDiagnosis("");
      await loadDiagnoses();
  
      alert("Diagnosis saved successfully!");
    } catch (error) {
      console.log("Diagnosis save error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="dashboardLayout">
      <Sidebar role="Doctor" />

      <main className="dashboardMain">
        <DashboardNavbar title="Doctor Dashboard" />

        <section className="dashboardGrid">
          <DashboardCard
            title="Appointments"
            value={appointments.length}
            description="Today’s consultations"
          />

          <DashboardCard
            title="Departments"
            value="3"
            description="Active medical departments"
          />

          <DashboardCard
            title="Notes"
            value={savedNotes.length}
            description="Saved diagnosis notes"
          />
        </section>

        <section className="dashboardPanel">
          <h2>Patient Appointments</h2>

          {appointments.length === 0 ? (
            <p className="emptyText">No patient appointments yet.</p>
          ) : (
            <div className="appointmentList">
              {appointments.map((appointment) => (
                <div className="appointmentItem" key={appointment.id}>
                  <strong>{appointment.doctor}</strong>
                  <p>Patient: {appointment.patientEmail}</p>
                  <p>{appointment.department}</p>
                  <p>Status: {appointment.status}</p>
                  <span>{appointment.time}</span>

                  <button
                    className="smallActionButton"
                    onClick={() => setSelectedPatient(appointment)}
                  >
                    Add Diagnosis
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboardPanel">
          <h2>Saved Medical Notes</h2>

          {savedNotes.length === 0 ? (
            <p className="emptyText">No diagnosis notes saved yet.</p>
          ) : (
            <div className="appointmentList">
              {savedNotes.map((note) => (
                <div className="appointmentItem" key={note.id}>
                  <strong>{note.patientEmail}</strong>
                  <p>Doctor: {note.doctor}</p>
                  <p>Department: {note.department}</p>
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