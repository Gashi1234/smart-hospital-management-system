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
  updateUserProfileByEmail,
  updateDoctorByEmail,
  updateStaffProfileByEmail,
} from "../services/firestoreService";
import "../styles/dashboard.css";

function DoctorDashboard() {
  const [doctorName, setDoctorName] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorAvailability, setDoctorAvailability] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);

  const buildAvailabilityText = (from, to) => {
    if (!from || !to) return "No availability set";
    return `${from} to ${to}`;
  };

  const loadDoctorData = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) return;

    const doctorProfile = await getUserProfile(currentUser.uid);

    if (!doctorProfile?.doctorName) {
      alert("Doctor profile is missing doctorName field.");
      return;
    }

    const from = doctorProfile.availableFrom || "";
    const to = doctorProfile.availableTo || "";

    setDoctorName(doctorProfile.doctorName);
    setDoctorEmail(doctorProfile.email);
    setAvailableFrom(from);
    setAvailableTo(to);
    setDoctorAvailability(
      doctorProfile.availableTime || buildAvailabilityText(from, to)
    );

    const appointmentData = await getAppointmentsByDoctor(
      doctorProfile.doctorName
    );

    const diagnosisData = await getDiagnosesByDoctor(doctorProfile.doctorName);

    setAppointments(appointmentData);
    setSavedNotes(diagnosisData);
  };

  useEffect(() => {
    loadDoctorData();
  }, []);

  const updateAvailability = async () => {
    if (!availableFrom || !availableTo) {
      alert("Please select both available from and available to.");
      return;
    }

    if (availableFrom >= availableTo) {
      alert("Available From time must be earlier than Available To time.");
      return;
    }

    const availableTime = buildAvailabilityText(availableFrom, availableTo);

    await updateUserProfileByEmail(doctorEmail, {
      availableFrom,
      availableTo,
      availableTime,
    });

    await updateDoctorByEmail(doctorEmail, {
      availableFrom,
      availableTo,
      availableTime,
    });

    await updateStaffProfileByEmail(doctorEmail, {
      availableFrom,
      availableTo,
      availableTime,
    });

    setDoctorAvailability(availableTime);

    alert("Availability updated successfully.");
  };

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
            title="Availability"
            value={doctorAvailability || "Loading"}
            description="Your available time"
          />

          <DashboardCard
            title="Notes"
            value={savedNotes.length}
            description="Your saved diagnosis notes"
          />
        </section>

        <section className="dashboardPanel">
          <h2>Update Availability</h2>

          <div className="adminForm">
            <input
              type="time"
              value={availableFrom}
              onChange={(e) => setAvailableFrom(e.target.value)}
            />

            <input
              type="time"
              value={availableTo}
              onChange={(e) => setAvailableTo(e.target.value)}
            />

            <button className="smallActionButton" onClick={updateAvailability}>
              Update Availability
            </button>
          </div>
        </section>

        <section className="dashboardPanel">
          <h2>My Patient Appointments</h2>

          {appointments.map((appointment) => (
            <div className="appointmentCard" key={appointment.id}>
              <div className="appointmentCardHeader">
                <h3>{appointment.patientEmail}</h3>
                <span className="statusBadge">{appointment.status}</span>
              </div>

              <div className="appointmentMetaGrid">
                <div className="metaBox">
                  <span>Doctor</span>
                  <strong>{appointment.doctor}</strong>
                </div>

                <div className="metaBox">
                  <span>Department</span>
                  <strong>{appointment.department}</strong>
                </div>

                <div className="metaBox">
                  <span>Date & Time</span>
                  <strong>
                    {appointment.date || "No date"} at{" "}
                    {appointment.time || "No time"}
                  </strong>
                </div>
              </div>

              <div className="symptomsBox">
                <span>Symptoms</span>
                <p>
                  {appointment.symptoms || "No symptoms provided"}
                </p>
              </div>

              <div className="statusActionsModern">
                <button
                  className="smallActionButton"
                  onClick={() => setSelectedPatient(appointment)}
                >
                  Add Medical Note
                </button>

                <button
                  className="acceptButton"
                  onClick={() =>
                    changeAppointmentStatus(appointment.id, "Accepted")
                  }
                >
                  Accept
                </button>

                <button
                  className="rejectButton"
                  onClick={() =>
                    changeAppointmentStatus(appointment.id, "Rejected")
                  }
                >
                  Reject
                </button>

                <button
                  className="completeButton"
                  onClick={() =>
                    changeAppointmentStatus(appointment.id, "Completed")
                  }
                >
                  Complete
                </button>
              </div>
              
            </div>
          ))}
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