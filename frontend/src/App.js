import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./global.css"; 
import "./App.css";
import "./User/user-pages.css";
import UserDashboard from "./User/UserDashboard";
// Pages
import Login from "./Authentication/Login";
import SignUp from "./Authentication/SignUp";
import AdminDashboard from "./AdminPortal/AdminDashboard";
import BrowseServices from "./User/ManageServices/BrowseServices";

import Home from "./Guest/Home";
import AddPhotos from "./Guest/AddPhotos";
import ParkingCapacity from "./Guest/ParkingCapacity";
import InvitationView from "./Guest/InvitationView";

// Auth API helpers
import { loginAccount, registerAccount } from "./api/client";

function App() {
  return (
    <Router>
      <Routes>
        {/* default -> login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* role-based routes */}
        {/* /admin/:id -> Admin dashboard */}
        <Route path="/admin/:id" element={<AdminDashboard />} />
        {/* /user/:id -> normal user home (for now using Guest Home) */}
        <Route path="/user/:id" element={<UserDashboard />} />
        {/* if you ever add guests: <Route path="/guest/:id" ... /> */}
        <Route path="/home" element={<Home />} />
        <Route path="/user/services" element={<BrowseServices />} />

        {/* invitation routes keep working */}
        <Route path="/invite/:invitationId/photos" element={<AddPhotos />} />
        <Route
          path="/invite/:invitationId/parking"
          element={<ParkingCapacity />}
        />
        <Route path="/invitation/shared/:id" element={<InvitationView />} />
      </Routes>
    </Router>
  );
}

// ---------- Login wrapper ----------
function LoginPage() {
  const navigate = useNavigate();

  async function handleLogin(form) {
    try {
      console.log("Login form:", form);

      const { user, token } = await loginAccount({
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("authToken", token);
      localStorage.setItem("currentUser", JSON.stringify(user));

      // ⭐ role-based URL: /role/id
      const pathRole = (user.role || "").toLowerCase(); // 'ADMIN' -> 'admin'
      navigate(`/${pathRole}/${user.id}`);
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Please check your email and password.");
    }
  }

  return (
    <Login
      onLogin={handleLogin}
      onGoSignUp={() => navigate("/signup")}
    />
  );
}

// ---------- SignUp wrapper ----------
function SignUpPage() {
  const navigate = useNavigate();

  async function handleSignUp(form) {
    try {
      console.log("SignUp form:", form);

      const { user, token } = await registerAccount({
        full_name: form.fullName,
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("authToken", token);
      localStorage.setItem("currentUser", JSON.stringify(user));

      // new users always have role = 'USER' from backend
      const pathRole = (user.role || "").toLowerCase(); // should be 'user'
      navigate(`/${pathRole}/${user.id}`);
    } catch (err) {
      console.error("Sign up failed:", err);
      alert("Sign up failed. Try a different email.");
    }
  }

  return (
    <SignUp
      onSignUp={handleSignUp}
      onGoLogin={() => navigate("/login")}
    />
  );
}

export default App;
