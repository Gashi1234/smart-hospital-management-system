import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import DashboardCard from "../components/DashboardCard";
import AdminCharts from "../components/AdminCharts";
import {
  addDoctor,
  getDoctors,
  deleteDoctor,
  updateDoctor,
  getAppointments,
  getDiagnoses,
  getPatientRecords,
} from "../services/firestoreService";
import "../styles/dashboard.css";

function AdminDashboard() {
  const [doctorList, setDoctorList] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [patientRecords, setPatientRecords] = useState([]);
  const [doctorName, setDoctorName] = useState("");
  const [department, setDepartment] = useState("");
  const [availableTime, setAvailableTime] = useState("");
  const [editingDoctorId, setEditingDoctorId] = useState(null);

  const loadAdminData = async () => {
    const doctorsData = await getDoctors();
    const appointmentsData = await getAppointments();
    const diagnosesData = await getDiagnoses();
    const patientRecordsData = await getPatientRecords();

    setDoctorList(doctorsData);
    setAppointments(appointmentsData);
    setDiagnoses(diagnosesData);
    setPatientRecords(patientRecordsData);
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const clearForm = () => {
    setDoctorName("");
    setDepartment("");
    setAvailableTime("");
    setEditingDoctorId(null);
  };

  const handleSaveDoctor = async () => {
    if (!doctorName.trim() || !department.trim() || !availableTime.trim()) {
      alert("Please fill all doctor fields.");
      return;
    }

    const doctorData = {
      name: doctorName,
      department,
      availableTime,
    };

    if (editingDoctorId) {
      await updateDoctor(editingDoctorId, doctorData);
    } else {
      await addDoctor(doctorData);
    }

    clearForm();
    loadAdminData();
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctorId(doctor.id);
    setDoctorName(doctor.name);
    setDepartment(doctor.department);
    setAvailableTime(doctor.availableTime);
  };

  const handleDeleteDoctor = async (doctorId) => {
    await deleteDoctor(doctorId);
    loadAdminData();
  };

  const mostRequestedDepartment =
    appointments.length === 0
      ? "No data"
      : Object.entries(
          appointments.reduce((acc, appointment) => {
            const department = appointment.department || "Unknown";
            acc[department] = (acc[department] || 0) + 1;
            return acc;
          }, {})
        ).sort((a, b) => b[1] - a[1])[0][0];

  const acceptedAppointments = appointments.filter(
    (appointment) => appointment.status === "Accepted"
  ).length;

  const rejectedAppointments = appointments.filter(
    (appointment) => appointment.status === "Rejected"
  ).length;

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "Completed"
  ).length;

  const bookedAppointments = appointments.filter(
    (appointment) => appointment.status === "Booked"
  ).length;

  const symptomReports = appointments.filter(
    (appointment) => appointment.symptoms && appointment.symptoms.trim()
  ).length;

  return (
    <div className="dashboardLayout">
      <Sidebar role="Admin" />

      <main className="dashboardMain">
        <DashboardNavbar title="Admin Dashboard" />

        <section className="dashboardGrid">
          <DashboardCard
            title="Doctors"
            value={doctorList.length}
            description="Registered doctors"
          />

          <DashboardCard
            title="Patients"
            value={patientRecords.length}
            description="Patient records"
          />

          <DashboardCard
            title="Appointments"
            value={appointments.length}
            description="Total booked appointments"
          />
        </section>

        <section className="dashboardPanel">
          <h2>Manage Doctors and Departments</h2>

          <div className="adminForm">
            <input
              type="text"
              placeholder="Doctor name"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />

            <input
              type="text"
              placeholder="Available time"
              value={availableTime}
              onChange={(e) => setAvailableTime(e.target.value)}
            />

            <button className="smallActionButton" onClick={handleSaveDoctor}>
              {editingDoctorId ? "Update Doctor" : "Add Doctor"}
            </button>

            {editingDoctorId && (
              <button className="cancelButtonInline" onClick={clearForm}>
                Cancel
              </button>
            )}
          </div>

          <div className="appointmentList">
            {doctorList.length === 0 ? (
              <p className="emptyText">No doctors added yet.</p>
            ) : (
              doctorList.map((doctor) => (
                <div className="appointmentItem" key={doctor.id}>
                  <strong>{doctor.name}</strong>
                  <p>{doctor.department}</p>
                  <span>{doctor.availableTime}</span>

                  <button
                    className="smallActionButton"
                    onClick={() => handleEditDoctor(doctor)}
                  >
                    Edit Doctor
                  </button>

                  <button
                    className="deleteButton"
                    onClick={() => handleDeleteDoctor(doctor.id)}
                  >
                    Delete Doctor
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="dashboardPanel">
          <h2>Patient Records</h2>

          {patientRecords.length === 0 ? (
            <p className="emptyText">No patient records yet.</p>
          ) : (
            <div className="appointmentList">
              {patientRecords.map((patient) => (
                <div className="appointmentItem" key={patient.email}>
                  <strong>{patient.email}</strong>
                  <p>Department: {patient.department}</p>
                  <p>Symptoms: {patient.symptoms}</p>
                  <p>Status: {patient.status}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboardPanel">
          <h2>Reports and Analytics</h2>

          <div className="reportGrid">
            <div className="reportBox">
              <strong>{mostRequestedDepartment}</strong>
              <p>Most requested department</p>
            </div>

            <div className="reportBox">
              <strong>{appointments.length}</strong>
              <p>Total appointments</p>
            </div>

            <div className="reportBox">
              <strong>{diagnoses.length}</strong>
              <p>Total medical notes</p>
            </div>

            <div className="reportBox">
              <strong>{symptomReports}</strong>
              <p>Appointments with symptoms</p>
            </div>

            <div className="reportBox">
              <strong>{bookedAppointments}</strong>
              <p>Booked appointments</p>
            </div>

            <div className="reportBox">
              <strong>{acceptedAppointments}</strong>
              <p>Accepted appointments</p>
            </div>

            <div className="reportBox">
              <strong>{rejectedAppointments}</strong>
              <p>Rejected appointments</p>
            </div>

            <div className="reportBox">
              <strong>{completedAppointments}</strong>
              <p>Completed appointments</p>
            </div>
          </div>
        </section>
        <AdminCharts appointments={appointments} />
      </main>
    </div>
  );
}

export default AdminDashboard;