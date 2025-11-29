import { Link } from "react-router-dom";
import "./style.css";

function Home() {
  return (
    <div className="home-wrapper">
      <div className="home-card">
        <span className="home-pill">Wedding Moments · Guest Portal 💌</span>

        <h1 className="wedding-title">
          ✨ Welcome to Our Wedding ✨
        </h1>

        <p className="wedding-subtitle">
          We’re so happy to have you with us.
        </p>

        <p className="wedding-message">
          This little space lets you{" "}
          <strong>share your favorite memories</strong> and{" "}
          <strong>help us with practical details</strong> like parking — so we
          can focus on what truly matters: a joyful, stress-free day filled
          with love and laughter. 💐
        </p>

        <div className="home-buttons">
          <Link to="/invite/abc123/photos" className="btn-large btn-violet">
            <span className="btn-icon">📸</span>
            <span className="btn-text">
              Add Your Photos
              <span className="btn-caption">
                Upload your favorite wedding moments
              </span>
            </span>
          </Link>

          <Link to="/invite/abc123/parking" className="btn-large btn-gold">
            <span className="btn-icon">🚗</span>
            <span className="btn-text">
              Inform Parking Capacity
              <span className="btn-caption">
                Tell us how many cars you’re bringing
              </span>
            </span>
          </Link>
        </div>

        <p className="home-footer-note">
          No account needed · Your answers are saved securely 🌸
        </p>
      </div>
    </div>
  );
}

export default Home;
