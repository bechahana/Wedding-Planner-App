import React, { useState } from "react";
import "./App.css";

// Import the pages
import Login from "./Authentication/Login";
import SignUp from "./Authentication/SignUp";

function App() {
  // Control which page to display
  const [view, setView] = useState("login"); // default = login
  const [user, setUser] = useState(null);

  // Simulated login/signup success handlers
  function handleLogin(form) {
    console.log("Logged in:", form);
    setUser({ email: form.email });
    setView("admin");
  }

  function handleSignUp(form) {
    console.log("Signed up:", form);
    setUser({ email: form.email });
    setView("admin");
  }

  // === Render depending on the view ===
  if (view === "login") {
    return (
      <Login
        onLogin={handleLogin}
        onGoSignUp={() => setView("signup")}
      />
    );
  }

  if (view === "signup") {
    return (
      <SignUp
        onSignUp={handleSignUp}
        onGoLogin={() => setView("login")}
      />
    );
  }

}

export default App;
