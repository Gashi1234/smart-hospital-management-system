import {
    collection,
    addDoc,
    getDocs,
    serverTimestamp,
    query,
    orderBy,
    where,
    updateDoc,
    deleteDoc,
    doc,
    setDoc,
    getDoc,
  } from "firebase/firestore";
  
  import { db } from "../firebase";
  
  export const addAppointment = async (appointmentData) => {
    return await addDoc(collection(db, "appointments"), {
      ...appointmentData,
      createdAt: serverTimestamp(),
    });
  };
  
  export const getAppointments = async () => {
    const querySnapshot = await getDocs(collection(db, "appointments"));
  
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };
  
  export const addDiagnosis = async (diagnosisData) => {
    return await addDoc(collection(db, "diagnoses"), {
      ...diagnosisData,
      createdAt: serverTimestamp(),
    });
  };
  
  export const getDiagnoses = async () => {
    const querySnapshot = await getDocs(
      query(collection(db, "diagnoses"), orderBy("createdAt", "desc"))
    );
  
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  export const getAppointmentsByPatient = async (patientEmail) => {
    const appointmentsQuery = query(
      collection(db, "appointments"),
      where("patientEmail", "==", patientEmail)
    );
  
    const querySnapshot = await getDocs(appointmentsQuery);
  
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  export const getDiagnosesByPatient = async (patientEmail) => {
    const diagnosesQuery = query(
      collection(db, "diagnoses"),
      where("patientEmail", "==", patientEmail)
    );
  
    const querySnapshot = await getDocs(diagnosesQuery);
  
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  export const updateAppointmentStatus = async (appointmentId, status) => {
    const appointmentRef = doc(db, "appointments", appointmentId);
  
    return await updateDoc(appointmentRef, {
      status,
    });
  };

  export const addDoctor = async (doctorData) => {
    return await addDoc(collection(db, "doctors"), {
      ...doctorData,
      createdAt: serverTimestamp(),
    });
  };
  
  export const getDoctors = async () => {
    const querySnapshot = await getDocs(collection(db, "doctors"));
  
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  export const deleteDoctor = async (doctorId) => {
    const doctorRef = doc(db, "doctors", doctorId);
    return await deleteDoc(doctorRef);
  };

  export const getPatientRecords = async () => {
    const appointmentsData = await getAppointments();
  
    const uniquePatients = {};
  
    appointmentsData.forEach((appointment) => {
      if (appointment.patientEmail) {
        uniquePatients[appointment.patientEmail] = {
          email: appointment.patientEmail,
          department: appointment.department || "Unknown department",
          symptoms: appointment.symptoms || "No symptoms provided",
          status: appointment.status || "Booked",
        };
      }
    });
  
    return Object.values(uniquePatients);
  };

  export const updateDoctor = async (doctorId, updatedDoctorData) => {
    const doctorRef = doc(db, "doctors", doctorId);
  
    return await updateDoc(doctorRef, updatedDoctorData);
  };

  export const saveUserProfile = async (userId, userData) => {
    const userRef = doc(db, "users", userId);
  
    return await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
    });
  };
  
  export const getUserProfile = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userRef);
  
    if (userSnapshot.exists()) {
      return {
        id: userSnapshot.id,
        ...userSnapshot.data(),
      };
    }
  
    return null;
  };

  export const getAppointmentsByDoctor = async (doctorName) => {
    const appointmentsQuery = query(
      collection(db, "appointments"),
      where("doctor", "==", doctorName)
    );
  
    const querySnapshot = await getDocs(appointmentsQuery);
  
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };
  
  export const getDiagnosesByDoctor = async (doctorName) => {
    const diagnosesQuery = query(
      collection(db, "diagnoses"),
      where("doctor", "==", doctorName)
    );
  
    const querySnapshot = await getDocs(diagnosesQuery);
  
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  export const getStaffProfileByEmail = async (email) => {
    const staffQuery = query(
      collection(db, "staffProfiles"),
      where("email", "==", email)
    );
  
    const querySnapshot = await getDocs(staffQuery);
  
    if (!querySnapshot.empty) {
      return {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data(),
      };
    }
  
    return null;
  };

  export const addStaffProfile = async (staffData) => {
    return await addDoc(collection(db, "staffProfiles"), {
      ...staffData,
      createdAt: serverTimestamp(),
    });
  };

  export const updateUserProfileByEmail = async (email, updatedData) => {
    const usersQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );
  
    const querySnapshot = await getDocs(usersQuery);
  
    const updatePromises = querySnapshot.docs.map((userDoc) =>
      updateDoc(doc(db, "users", userDoc.id), updatedData)
    );
  
    return await Promise.all(updatePromises);
  };
  
  export const updateStaffProfileByEmail = async (email, updatedData) => {
    const staffQuery = query(
      collection(db, "staffProfiles"),
      where("email", "==", email)
    );
  
    const querySnapshot = await getDocs(staffQuery);
  
    const updatePromises = querySnapshot.docs.map((staffDoc) =>
      updateDoc(doc(db, "staffProfiles", staffDoc.id), updatedData)
    );
  
    return await Promise.all(updatePromises);
  };