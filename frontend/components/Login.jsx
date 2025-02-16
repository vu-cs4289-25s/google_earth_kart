import { useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import app from "../src/firebaseConfig.js"; 
import SignIn from "./sign-in/SignIn.jsx";


function Login({ onLogin }) {


    return (
        <div>
            <SignIn />
        </div>
    );
}

export default Login;