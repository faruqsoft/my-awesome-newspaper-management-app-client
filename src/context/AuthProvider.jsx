// client/src/context/AuthProvider.jsx
import { createContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getAuth } from "firebase/auth";
import app from "../firebase/firebase.config";
import axios from "axios";

export const AuthContext = createContext(null);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Login
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google Login
  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // Logout
  const logOut = () => {
    setLoading(true);
    localStorage.removeItem("token"); // Clear token manually
    return signOut(auth);
  };

  // Auth State Observer
 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setLoading(true);

    if (currentUser) {
      try {
        const res = await axios.post("http://localhost:5000/jwt", {
          email: currentUser.email,
        });

        localStorage.setItem("token", res.data.token);
        setUser(currentUser);
      } catch (err) {
        console.error("JWT error:", err);
        setUser(null);
      }
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }

    setLoading(false);
  });

  return () => unsubscribe();
}, []);


  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    googleLogin,
    logOut,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
