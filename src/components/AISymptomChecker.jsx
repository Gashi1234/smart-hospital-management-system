import { useState } from "react";
import { getDoctors } from "../services/firestoreService";
import { addAppointment } from "../services/firestoreService";
import { auth } from "../firebase";

function AISymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [recommendedDoctors, setRecommendedDoctors] = useState([]);
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

  const bookRecommendedDoctor = async (doctor) => {
    const currentUser = auth.currentUser;
  
    const newAppointment = {
      patientEmail: currentUser?.email || "Unknown patient",
      doctor: doctor.name,
      department: doctor.department,
      time: doctor.availableTime,
      status: "Booked",
      symptoms,
    };
  
    await addAppointment(newAppointment);
  
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
            <strong>Suggested Department:</strong>{" "}
            {result.department}
          </p>

          <p>
            <strong>Urgency Level:</strong>{" "}
            {result.urgency}
          </p>

          <p>
            <strong>Recommendation:</strong>{" "}
            {result.recommendation}
          </p>

          <p>
            <strong>Reason:</strong> {result.reason}
          </p>

          <p>
            <strong>Quick Care Tip:</strong>{" "}
            {result.quickCareTip}
          </p>

          <h3 style={{ marginTop: "20px" }}>
            Recommended Doctors
          </h3>

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
                    alignItems: "center",
                    gap: "12px",
                    marginTop: "10px",
                  }}
                >
                  <span>{doctor.availableTime}</span>

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