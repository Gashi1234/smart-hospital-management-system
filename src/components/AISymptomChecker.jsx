import { useState } from "react";

function AISymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);

  const analyzeSymptoms = () => {
    const text = symptoms.toLowerCase();

    if (text.includes("chest") || text.includes("heart")) {
      setResult({
        department: "Cardiology",
        urgency: "High",
        advice: "Please book an appointment as soon as possible.",
      });
    } else if (text.includes("headache") || text.includes("migraine")) {
      setResult({
        department: "Neurology",
        urgency: "Medium",
        advice: "Rest, drink water, and book a neurology consultation.",
      });
    } else if (text.includes("fever") || text.includes("cough")) {
      setResult({
        department: "General Medicine",
        urgency: "Medium",
        advice: "Monitor your temperature and schedule a consultation.",
      });
    } else {
      setResult({
        department: "General Medicine",
        urgency: "Low",
        advice: "Please describe more symptoms or book a general consultation.",
      });
    }
  };

  return (
    <section className="dashboardPanel">
      <h2>AI Health Assistant</h2>

      <textarea
        className="symptomInput"
        placeholder="Enter your symptoms here..."
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />

      <button className="aiButton" onClick={analyzeSymptoms}>
        Analyze Symptoms
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
            <strong>Recommendation:</strong> {result.advice}
          </p>
        </div>
      )}
    </section>
  );
}

export default AISymptomChecker;