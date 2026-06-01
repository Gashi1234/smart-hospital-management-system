import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import DashboardCard from "../components/DashboardCard";
import DiagnosisModal from "../components/DiagnosisModal";
import { auth } from "../firebase";
import {
  addDiagnosis,
  getUserProfile,
  getAppointmentsByDoctor,
  getDiagnosesByDoctor,
  updateAppointmentStatus,
} from "../services/firestoreService";
import "../styles/dashboard.css";

function DoctorDashboard() {
  const [doctorName, setDoctorName] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);

  const loadDoctorData = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) return;

    const doctorProfile = await getUserProfile(currentUser.uid);

    if (!doctorProfile?.doctorName) {
      alert("Doctor profile is missing doctorName field.");
      return;
    }

    setDoctorName(doctorProfile.doctorName);

    const appointmentData = await getAppointmentsByDoctor(
      doctorProfile.doctorName
    );

    const diagnosisData = await getDiagnosesByDoctor(
      doctorProfile.doctorName
    );

    setAppointments(appointmentData);
    setSavedNotes(diagnosisData);
  };

  useEffect(() => {
    loadDoctorData();
  }, []);

  const changeAppointmentStatus = async (appointmentId, status) => {
    await updateAppointmentStatus(appointmentId, status);
    loadDoctorData();
  };

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
        doctor: selectedPatient.doctor || doctorName,
        department: selectedPatient.department || "Unknown department",
        symptoms: selectedPatient.symptoms || "No symptoms provided",
        diagnosis,
      };

      await addDiagnosis(diagnosisData);

      setSelectedPatient(null);
      setDiagnosis("");

      await loadDoctorData();

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
        <DashboardNavbar title={doctorName || "Doctor Dashboard"} />

        <section className="dashboardGrid">
          <DashboardCard
            title="Appointments"
            value={appointments.length}
            description="Your consultations"
          />

          <DashboardCard
            title="Doctor"
            value={doctorName || "Loading"}
            description="Logged-in doctor"
          />

          <DashboardCard
            title="Notes"
            value={savedNotes.length}
            description="Your saved diagnosis notes"
          />
        </section>

        <section className="dashboardPanel">
          <h2>My Patient Appointments</h2>

          {appointments.length === 0 ? (
            <p className="emptyText">No appointments assigned to you yet.</p>
          ) : (
            <div className="appointmentList">
              {appointments.map((appointment) => (
                <div className="appointmentItem" key={appointment.id}>
                  <strong>{appointment.doctor}</strong>
                  <p>Patient: {appointment.patientEmail}</p>
                  <p>{appointment.department}</p>
                  <p>
                    Symptoms:{" "}
                    {appointment.symptoms || "No symptoms provided"}
                  </p>
                  <p>Status: {appointment.status}</p>
                  <span>{appointment.time}</span>

                  <button
                    className="smallActionButton"
                    onClick={() => setSelectedPatient(appointment)}
                  >
                    Add Diagnosis
                  </button>

                  <div className="statusActions">
                    <button
                      onClick={() =>
                        changeAppointmentStatus(appointment.id, "Accepted")
                      }
                    >
                      Accept
                    </button>

                    <button
                      onClick={() =>
                        changeAppointmentStatus(appointment.id, "Rejected")
                      }
                    >
                      Reject
                    </button>

                    <button
                      onClick={() =>
                        changeAppointmentStatus(appointment.id, "Completed")
                      }
                    >
                      Complete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboardPanel">
          <h2>My Saved Medical Notes</h2>

          {savedNotes.length === 0 ? (
            <p className="emptyText">No diagnosis notes saved yet.</p>
          ) : (
            <div className="appointmentList">
              {savedNotes.map((note) => (
                <div className="appointmentItem" key={note.id}>
                  <strong>{note.patientEmail}</strong>
                  <p>Doctor: {note.doctor}</p>
                  <p>Department: {note.department}</p>
                  <p>
                    Symptoms: {note.symptoms || "No symptoms provided"}
                  </p>
                  <p>Diagnosis: {note.diagnosis}</p>
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