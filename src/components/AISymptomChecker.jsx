import { useState } from "react";
import {
  getDoctors,
  addAppointment,
  checkAppointmentSlotTaken,
} from "../services/firestoreService";
import { auth } from "../firebase";

function AISymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [recommendedDoctors, setRecommendedDoctors] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDoctorTimes, setSelectedDoctorTimes] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      setError("Please enter your symptoms first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setRecommendedDoctors([]);

    try {
      const response = await fetch("http://localhost:5050/analyze-symptoms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI analysis failed.");
      }

      setResult(data);

      const doctorsData = await getDoctors();

      const matchingDoctors = doctorsData.filter(
        (doctor) =>
          doctor.department.toLowerCase() === data.department.toLowerCase()
      );

      setRecommendedDoctors(matchingDoctors);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

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

  const bookRecommendedDoctor = async (doctor) => {
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
      selectedTime > doctor.availableTo
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

    setSelectedDate("");
    setSelectedDoctorTimes({});

    alert("Appointment booked successfully!");
  };

  return (
    <section className="dashboardPanel">
      <h2>AI Health Assistant</h2>

      <label className="sectionLabel">Describe your symptoms</label>

      <textarea
        className="symptomInput"
        placeholder="Example: I have headache, dizziness, and fever..."
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />

      {error && <p className="errorText">{error}</p>}

      <button
        className="aiButton"
        onClick={analyzeSymptoms}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze Symptoms"}
      </button>

      {result && (
        <div className="aiResult">
          <h3>AI Suggestion Result</h3>

          <p>
            <strong>Suggested Department:</strong> {result.department}
          </p>

          <p>
            <strong>Urgency Level:</strong> {result.urgency}
          </p>

          <p>
            <strong>Recommendation:</strong> {result.recommendation}
          </p>

          <p>
            <strong>Reason:</strong> {result.reason}
          </p>

          <p>
            <strong>Quick Care Tip:</strong> {result.quickCareTip}
          </p>

          <h3 style={{ marginTop: "20px" }}>Recommended Doctors</h3>

          <div className="bookingFields">
            <input
              type="date"
              className="appointmentInput"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {recommendedDoctors.length === 0 ? (
            <p>No doctors found for this department.</p>
          ) : (
            recommendedDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="appointmentItem"
                style={{ marginTop: "10px" }}
              >
                <strong>{doctor.name}</strong>
                <p>{doctor.department}</p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    marginTop: "10px",
                  }}
                >
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

                    {generateTimeSlots(
                      doctor.availableFrom,
                      doctor.availableTo
                    ).map((slot) => (
                      <option key={`${doctor.id}-${slot}`} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>

                  <button
                    className="smallActionButton"
                    onClick={() => bookRecommendedDoctor(doctor)}
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}

export default AISymptomChecker;