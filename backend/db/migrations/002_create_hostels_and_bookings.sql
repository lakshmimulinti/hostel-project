CREATE TABLE IF NOT EXISTS hostels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    badge VARCHAR(50),
    verified BOOLEAN DEFAULT TRUE,
    distance_km NUMERIC(5,2),
    price_daily INT,
    price_monthly INT,
    photo_image VARCHAR(500),
    amenities TEXT[]
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    hostel_id INT REFERENCES hostels(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    mobile_no VARCHAR(15) NOT NULL,
    check_in_date DATE NOT NULL,
    room_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
