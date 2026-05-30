import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDgVFYDQunFUAKBRiHC8ZN2i_jJz-2OCp4",
  authDomain: "smart-hospital-managemen-d0343.firebaseapp.com",
  projectId: "smart-hospital-managemen-d0343",
  storageBucket: "smart-hospital-managemen-d0343.firebasestorage.app",
  messagingSenderId: "209917583776",
  appId: "1:209917583776:web:cc507a57da951d58c644c5",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;