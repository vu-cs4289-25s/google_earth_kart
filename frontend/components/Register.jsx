import { useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import app from "../src/firebaseConfig.js"; 
import SignUp from "./sign-up/SignUp.jsx";


function Register({ onLogin }) {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app); // Use the initialized Firebase app

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username) {
            onLogin(username);
        }
    };


    return (
        <div>
            <SignUp />
        </div>
    );
}

export default Register;