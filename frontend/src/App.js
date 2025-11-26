import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import "./App.css";
import "./User/user-pages.css";

// Pages
import Login from "./Authentication/Login";
import SignUp from "./Authentication/SignUp";
import AdminDashboard from "./AdminPortal/AdminDashboard";

// TODO: change paths if your files are elsewhere
import Home from "./Guest/Home";
import AddPhotos from "./Guest/AddPhotos";
import ParkingCapacity from "./Guest/ParkingCapacity";

function App() {
  return (
    <Router>
      <Routes>
        {/* default -> login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* after login */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* invitation routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/invite/:invitationId/photos" element={<AddPhotos />} />
        <Route
          path="/invite/:invitationId/parking"
          element={<ParkingCapacity />}
        />
      </Routes>
    </Router>
  );
}

// --------- Component wrappers ---------

function LoginPage() {
  const navigate = useNavigate();

  function handleLogin(form) {
    console.log("Logged in:", form);
    // here you would normally check credentials, then:
    navigate("/admin");
  }

  return (
    <Login
      onLogin={handleLogin}
      onGoSignUp={() => navigate("/signup")}
    />
  );
}

function SignUpPage() {
  const navigate = useNavigate();

  function handleSignUp(form) {
    console.log("Signed up:", form);
    // after signup go to login (or /admin if you prefer)
    navigate("/login");
  }

  return (
    <SignUp
      onSignUp={handleSignUp}
      onGoLogin={() => navigate("/login")}
    />
  );
}

export default App;
