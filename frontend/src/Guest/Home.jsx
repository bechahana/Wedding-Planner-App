import { Link } from "react-router-dom";
import "./style.css";   


function Home() {
  return (
    <div className="home-wrapper">
      <div className="home-card">
        <h1 className="wedding-title">✨ Welcome to Our Wedding ✨</h1>
        <p className="wedding-message">
          At <strong>Wedding Moments</strong>, we’re dedicated to making every celebration
          unforgettable. This platform allows your guests to easily share their
          favorite wedding memories and provide important event details like parking
          availability — helping you focus on what truly matters: creating joyful,
          stress-free experiences filled with love and elegance. 💐
        </p>

        <div className="home-buttons">
          <Link to="/invite/abc123/photos" className="btn-large btn-violet">
            📸 Add Your Photos
          </Link>
          <Link to="/invite/abc123/parking" className="btn-large btn-gold">
            🚗 Inform Parking Capacity
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
