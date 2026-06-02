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
  addStaffProfile,
  updateUserProfileByEmail,
  updateStaffProfileByEmail,
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

  const [staffEmail, setStaffEmail] = useState("");
  const [staffRole, setStaffRole] = useState("Doctor");
  const [staffDoctorName, setStaffDoctorName] = useState("");
  const [staffDepartment, setStaffDepartment] = useState("");
  const [staffAvailableTime, setStaffAvailableTime] = useState("");

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

  const clearStaffForm = () => {
    setStaffEmail("");
    setStaffRole("Doctor");
    setStaffDoctorName("");
    setStaffDepartment("");
    setStaffAvailableTime("");
    setEditingDoctorId(null);
  };

  const handleAddStaffProfile = async () => {
    if (!editingDoctorId && (!staffEmail.trim() || !staffRole.trim())) {
      alert("Please fill staff email and role.");
      return;
    }

    if (staffRole === "Doctor") {
      if (
        !staffDoctorName.trim() ||
        !staffDepartment.trim() ||
        !staffAvailableTime.trim()
      ) {
        alert("Please fill doctor name, department, and available time.");
        return;
      }
    }

    const staffData = {
      email: staffEmail,
      role: staffRole,
      doctorName: staffRole === "Doctor" ? staffDoctorName : "",
      department: staffRole === "Doctor" ? staffDepartment : "",
      availableTime: staffRole === "Doctor" ? staffAvailableTime : "",
    };

    if (staffRole === "Doctor" && editingDoctorId) {
      if (!staffEmail.trim()) {
        alert("This doctor is missing an email. Please add email field to this doctor in Firestore once.");
        return;
      }

      const updatedDoctorData = {
        name: staffDoctorName,
        department: staffDepartment,
        availableTime: staffAvailableTime,
        email: staffEmail,
      };

      const updatedUserData = {
        fullName: staffDoctorName,
        doctorName: staffDoctorName,
        department: staffDepartment,
        availableTime: staffAvailableTime,
        role: "Doctor",
      };

      const updatedStaffData = {
        doctorName: staffDoctorName,
        department: staffDepartment,
        availableTime: staffAvailableTime,
        role: "Doctor",
      };

      await updateDoctor(editingDoctorId, updatedDoctorData);
      await updateUserProfileByEmail(staffEmail, updatedUserData);
      await updateStaffProfileByEmail(staffEmail, updatedStaffData);

      alert("Doctor updated successfully everywhere.");
    } else {
      await addStaffProfile(staffData);

      if (staffRole === "Doctor") {
        await addDoctor({
          email: staffEmail,
          name: staffDoctorName,
          department: staffDepartment,
          availableTime: staffAvailableTime,
        });
      }

      alert("Staff profile created successfully.");
    }

    clearStaffForm();
    loadAdminData();
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctorId(doctor.id);
    setStaffEmail(doctor.email || "");
    setStaffRole("Doctor");
    setStaffDoctorName(doctor.name);
    setStaffDepartment(doctor.department);
    setStaffAvailableTime(doctor.availableTime);
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
          <h2>Create & Edit Staff Account Approval</h2>

          <div className="adminForm">
            <input
              type="email"
              placeholder="Staff email"
              value={staffEmail}
              onChange={(e) => setStaffEmail(e.target.value)}
              disabled={editingDoctorId !== null}
            />

            <select
              value={staffRole}
              onChange={(e) => setStaffRole(e.target.value)}
              disabled={editingDoctorId !== null}
            >
              <option>Doctor</option>
              <option>Admin</option>
            </select>

            <input
              type="text"
              placeholder="Doctor name"
              value={staffDoctorName}
              onChange={(e) => setStaffDoctorName(e.target.value)}
              disabled={staffRole !== "Doctor"}
            />

            <input
              type="text"
              placeholder="Department"
              value={staffDepartment}
              onChange={(e) => setStaffDepartment(e.target.value)}
              disabled={staffRole !== "Doctor"}
            />

            <input
              type="text"
              placeholder="Available time"
              value={staffAvailableTime}
              onChange={(e) => setStaffAvailableTime(e.target.value)}
              disabled={staffRole !== "Doctor"}
            />

            <button
              className="smallActionButton"
              onClick={handleAddStaffProfile}
            >
              {editingDoctorId ? "Update Doctor" : "Approve Staff"}
            </button>

            {editingDoctorId && (
              <button className="cancelButtonInline" onClick={clearStaffForm}>
                Cancel
              </button>
            )}
          </div>

          <div className="appointmentList">
            {doctorList.length === 0 ? (
              <p className="emptyText">No approved doctors yet.</p>
            ) : (
              doctorList.map((doctor) => (
                <div className="appointmentItem" key={doctor.id}>
                  <strong>{doctor.name}</strong>
                  <p>Email: {doctor.email || "No email linked"}</p>
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