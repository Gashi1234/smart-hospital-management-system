import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import DashboardCard from "../components/DashboardCard";
import "../styles/dashboard.css";
import AISymptomChecker from "../components/AISymptomChecker";
import {
  addAppointment,
  getAppointmentsByPatient,
  getDiagnosesByPatient,
  getDoctors,
  checkAppointmentSlotTaken,
} from "../services/firestoreService";
import { auth } from "../firebase";

function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [symptoms, setSymptoms] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDoctorTimes, setSelectedDoctorTimes] = useState({});

  const loadDoctors = async () => {
    const data = await getDoctors();
    setDoctors(data);
  };

  const loadPatientData = async (email) => {
    const appointmentData = await getAppointmentsByPatient(email);
    const diagnosisData = await getDiagnosesByPatient(email);

    setAppointments(appointmentData);
    setDiagnoses(diagnosisData);
  };

  useEffect(() => {
    loadDoctors();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        loadPatientData(user.email);
      }
    });

    return () => unsubscribe();
  }, []);

  const generateTimeSlots = (from, to, intervalMinutes = 30) => {
    if (!from || !to) return [];

    const slots = [];

    const [fromHour, fromMinute] = from.split(":").map(Number);
    const [toHour, toMinute] = to.split(":").map(Number);

    let current = fromHour * 60 + fromMinute;
    const end = toHour * 60 + toMinute;

    while (current < end) {
      const hours = String(Math.floor(current / 60)).padStart(2, "0");
      const minutes = String(current % 60).padStart(2, "0");

      slots.push(`${hours}:${minutes}`);
      current += intervalMinutes;
    }

    return slots;
  };

  const bookAppointment = async (doctor) => {
    const currentUser = auth.currentUser;
    const selectedTime = selectedDoctorTimes[doctor.id];

    if (!selectedDate || !selectedTime) {
      alert("Please select appointment date and time.");
      return;
    }

    if (!doctor.availableFrom || !doctor.availableTo) {
      alert("This doctor does not have structured availability set yet.");
      return;
    }

    if (
      selectedTime < doctor.availableFrom ||
      selectedTime >= doctor.availableTo
    ) {
      alert(
        `This doctor is only available from ${doctor.availableFrom} to ${doctor.availableTo}.`
      );
      return;
    }

    const isSlotTaken = await checkAppointmentSlotTaken(
      doctor.name,
      selectedDate,
      selectedTime
    );

    if (isSlotTaken) {
      alert("This appointment slot is already booked. Please choose another time.");
      return;
    }

    const newAppointment = {
      patientEmail: currentUser?.email || "Unknown patient",
      doctor: doctor.name,
      department: doctor.department,
      date: selectedDate,
      time: selectedTime,
      status: "Booked",
      symptoms,
    };

    await addAppointment(newAppointment);

    setSymptoms("");
    setSelectedDoctorTimes({});

    if (currentUser) {
      loadPatientData(currentUser.email);
    }

    alert("Appointment booked successfully.");
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

        <div id="ai-assistant">
          <AISymptomChecker />
        </div>

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

          <textarea
            className="symptomInput"
            placeholder="Describe your symptoms before booking..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />

          <div className="bookingFields">
            <input
              type="date"
              className="appointmentInput"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="doctorGrid">
            {doctors.map((doctor) => {
              const slots = generateTimeSlots(
                doctor.availableFrom,
                doctor.availableTo
              );

              return (
                <div className="doctorCard" key={doctor.id}>
                  <h3>{doctor.name}</h3>
                  <p>{doctor.department}</p>

                  <span>
                    Available:{" "}
                    {doctor.availableFrom && doctor.availableTo
                      ? `${doctor.availableFrom} to ${doctor.availableTo}`
                      : doctor.availableTime || "No availability set"}
                  </span>

                  <select
                    className="appointmentInput"
                    value={selectedDoctorTimes[doctor.id] || ""}
                    onChange={(e) =>
                      setSelectedDoctorTimes({
                        ...selectedDoctorTimes,
                        [doctor.id]: e.target.value,
                      })
                    }
                  >
                    <option value="">Select time slot</option>

                    {slots.map((slot) => (
                      <option key={`${doctor.id}-${slot}`} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>

                  <button onClick={() => bookAppointment(doctor)}>
                    Book Appointment
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="dashboardPanel">
          <h2>My Appointments</h2>

          {appointments.length === 0 ? (
            <p className="emptyText">No appointments booked yet.</p>
          ) : (
            <div className="appointmentList">
              {appointments.map((appointment) => (
                <div className="appointmentCard" key={appointment.id}>
                  <div className="appointmentCardHeader">
                    <h3>{appointment.doctor}</h3>
                    <span className="statusBadge">{appointment.status}</span>
                  </div>

                  <div className="appointmentMetaGrid">
                    <div className="metaBox">
                      <span>Patient</span>
                      <strong>{appointment.patientEmail}</strong>
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
                    <p>{appointment.symptoms || "No symptoms provided"}</p>
                  </div>
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
      </main>
    </div>
  );
}

export default PatientDashboard;