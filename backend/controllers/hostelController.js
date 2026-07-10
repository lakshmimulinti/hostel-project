const pool = require('../config/db');

// 1. GET HOSTELS BY CITY
exports.getHostelsByCity = async (req, res) => {
    const { city } = req.query;
    

    if (!city) {
        return res.status(400).json({ message: "City parameter is required" });
    }

    try {
        const result = await pool.query(
            'SELECT id, name, city, address, badge, verified, CAST(distance_km AS DOUBLE PRECISION) as "distanceKm", price_daily as "priceDaily", price_monthly as "priceMonthly", photo_image as "photoImage", amenities, CAST(rating AS DOUBLE PRECISION) as "rating", total_beds as "totalBeds", room_details as "roomDetails" FROM hostels WHERE LOWER(city) = LOWER($1)',
            [city]
        );
        res.status(200).json({ hostels: result.rows });
    } catch (err) {
        console.error("Error fetching hostels:", err.message);
        res.status(500).json({ error: "Server Error during fetching hostels." });
    }
};

// 2. CREATE A HOSTEL BOOKING
exports.createBooking = async (req, res) => {
    const { hostelId, fullName, email, mobileNo, checkInDate, roomType } = req.body;

    if (!hostelId || !fullName || !email || !mobileNo || !checkInDate || !roomType) {
        return res.status(400).json({ message: "All fields are required to book a hostel" });
    }

    try {
        // Insert booking details
        const result = await pool.query(
            `INSERT INTO bookings (hostel_id, full_name, email, mobile_no, check_in_date, room_type, status) 
             VALUES ($1, $2, $3, $4, $5, $6, 'Pending') RETURNING *`,
            [hostelId, fullName, email, mobileNo, checkInDate, roomType]
        );

        res.status(201).json({
            message: "Hostel Booked Successfully!",
            booking: result.rows[0]
        });
    } catch (err) {
        console.error("Error creating booking:", err.message);
        res.status(500).json({ error: "Server Error during booking." });
    }
};
