import {
    collection,
    addDoc,
    getDocs,
    serverTimestamp,
    query,
    orderBy,
    where,
    doc,
    updateDoc,
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