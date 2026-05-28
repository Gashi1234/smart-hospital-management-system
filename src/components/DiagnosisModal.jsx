function DiagnosisModal({ selectedPatient, diagnosis, setDiagnosis, onSave, onClose }) {
    if (!selectedPatient) return null;
  
    return (
      <div className="modalOverlay">
        <div className="modalCard">
          <h2>Add Diagnosis</h2>
          <p>
            Patient: <strong>{selectedPatient.patientName}</strong>
          </p>
  
          <textarea
            className="symptomInput"
            placeholder="Write diagnosis, prescription, or medical notes..."
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />
  
          <div className="modalActions">
            <button onClick={onSave}>Save Diagnosis</button>
            <button className="cancelButton" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default DiagnosisModal;