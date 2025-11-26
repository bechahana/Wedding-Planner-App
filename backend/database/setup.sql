CREATE DATABASE IF NOT EXISTS wedding_planner;
USE wedding_planner;

-- WEDDINGS
CREATE TABLE IF NOT EXISTS weddings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    couple_name VARCHAR(255) NOT NULL,
    wedding_date DATE,
    wedding_place VARCHAR(255),
    invitation_id VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PHOTOS
CREATE TABLE IF NOT EXISTS photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wedding_id INT NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    uploaded_by VARCHAR(150),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wedding_id) REFERENCES weddings(id) ON DELETE CASCADE
);

-- GUEST PARKING
CREATE TABLE IF NOT EXISTS guest_parking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wedding_id INT NOT NULL,
    guest_name VARCHAR(150),
    available_spots INT,
    note TEXT,
    parking_time DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wedding_id) REFERENCES weddings(id) ON DELETE CASCADE
);

-- INDEXES
CREATE INDEX idx_invitation_id ON weddings(invitation_id);
CREATE INDEX idx_wedding_id_photos ON photos(wedding_id);
CREATE INDEX idx_wedding_id_parking ON guest_parking(wedding_id);

-- TEST DATA
INSERT IGNORE INTO weddings (couple_name, wedding_date, wedding_place, invitation_id)
VALUES
  ('Emma & Liam', '2025-06-10', 'Paris', 'abc123'),
  ('Sophia & Noah', '2025-08-21', 'London', 'def456');

INSERT IGNORE INTO guest_parking (wedding_id, guest_name, available_spots, note, parking_time)
VALUES
  (1, 'Test Guest', 3, 'Coming with family car', '2025-06-10 17:00:00');

INSERT IGNORE INTO photos (wedding_id, photo_url, uploaded_by)
VALUES
  (1, 'sample1.jpg', 'Sample Uploader');
