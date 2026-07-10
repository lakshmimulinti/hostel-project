-- 005_seed_hostels.sql

-- Clear any existing data first to prevent duplicate seeds
TRUNCATE TABLE bookings CASCADE;
TRUNCATE TABLE hostels CASCADE;

-- Insert final seeded hostels data with rating, total_beds, and room_details JSONB schema
INSERT INTO hostels (name, city, address, badge, verified, distance_km, price_daily, price_monthly, photo_image, amenities, rating, total_beds, room_details)
VALUES 
-- Hyderabad Hostels
(
  'Stanza Living Montreal House', 
  'Hyderabad', 
  'Gachibowli Near DLF Cyber City, Hyderabad', 
  'Co-Living', 
  true, 
  1.2, 
  500, 
  9500, 
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80', 
  ARRAY['fa-wifi', 'fa-utensils', 'fa-user-shield', 'fa-couch', 'fa-plug'],
  4.7,
  30,
  '[
    {"type": "Single Share", "price": 9500, "available": 2, "total": 5},
    {"type": "Double Share", "price": 7500, "available": 4, "total": 10},
    {"type": "Triple Share", "price": 6000, "available": 6, "total": 10},
    {"type": "Four Share", "price": 5000, "available": 3, "total": 5}
  ]'::jsonb
),
(
  'PGO Gachibowli Boys Hostel', 
  'Hyderabad', 
  'Sri Harsha Plaza, Prashanth Hills, Khajaguga, Gachibowli, Hyderabad', 
  'Boys', 
  true, 
  12.05, 
  200, 
  3500, 
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80', 
  ARRAY['fa-utensils', 'fa-lock', 'fa-user-friends', 'fa-tint', 'fa-tv'],
  4.2,
  60,
  '[
    {"type": "Double Share", "price": 5500, "available": 3, "total": 20},
    {"type": "Triple Share", "price": 4200, "available": 5, "total": 20},
    {"type": "Four Share", "price": 3500, "available": 12, "total": 20}
  ]'::jsonb
),
(
  'Sree Sai Luxury Girls PG', 
  'Hyderabad', 
  'HITEC City Road, Madhapur, Hyderabad', 
  'Girls', 
  true, 
  2.5, 
  300, 
  6500, 
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80', 
  ARRAY['fa-wifi', 'fa-coffee', 'fa-user-shield', 'fa-spray-can'],
  4.5,
  40,
  '[
    {"type": "Single Share", "price": 8500, "available": 1, "total": 10},
    {"type": "Double Share", "price": 6500, "available": 4, "total": 15},
    {"type": "Triple Share", "price": 5000, "available": 8, "total": 15}
  ]'::jsonb
),
(
  'Kondapur Premium Co-Living', 
  'Hyderabad', 
  'Botanical Garden Road, Kondapur, Hyderabad', 
  'Co-Living', 
  true, 
  3.8, 
  450, 
  8000, 
  'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&q=80', 
  ARRAY['fa-wifi', 'fa-user-shield', 'fa-couch', 'fa-plug', 'fa-motorcycle'],
  4.6,
  45,
  '[
    {"type": "Single Share", "price": 10500, "available": 3, "total": 10},
    {"type": "Double Share", "price": 8000, "available": 5, "total": 20},
    {"type": "Triple Share", "price": 6500, "available": 7, "total": 15}
  ]'::jsonb
),

-- Bengaluru Hostels
(
  'Zolo Stay Sapphire', 
  'Bengaluru', 
  'Koramangala 4th Block, Near Sony Signal, Bengaluru', 
  'Co-Living', 
  true, 
  0.8, 
  600, 
  11000, 
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80', 
  ARRAY['fa-wifi', 'fa-utensils', 'fa-user-shield', 'fa-couch'],
  4.8,
  50,
  '[
    {"type": "Single Share", "price": 13000, "available": 2, "total": 10},
    {"type": "Double Share", "price": 11000, "available": 6, "total": 20},
    {"type": "Triple Share", "price": 8500, "available": 4, "total": 20}
  ]'::jsonb
),
(
  'Stanza Living Hamburg House', 
  'Bengaluru', 
  'Electronic City Phase 1, Near Wipro Gate, Bengaluru', 
  'Boys', 
  true, 
  2.1, 
  400, 
  7500, 
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80', 
  ARRAY['fa-wifi', 'fa-utensils', 'fa-user-shield', 'fa-plug', 'fa-motorcycle'],
  4.4,
  35,
  '[
    {"type": "Single Share", "price": 11000, "available": 1, "total": 5},
    {"type": "Double Share", "price": 8500, "available": 4, "total": 15},
    {"type": "Triple Share", "price": 7500, "available": 8, "total": 15}
  ]'::jsonb
),
(
  'Nesta Nest Girls Luxury PG', 
  'Bengaluru', 
  'HSR Layout Sector 3, Bengaluru', 
  'Girls', 
  true, 
  1.5, 
  350, 
  7000, 
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80', 
  ARRAY['fa-wifi', 'fa-coffee', 'fa-user-shield', 'fa-spray-can'],
  4.3,
  25,
  '[
    {"type": "Single Share", "price": 9000, "available": 0, "total": 5},
    {"type": "Double Share", "price": 7000, "available": 3, "total": 10},
    {"type": "Triple Share", "price": 5500, "available": 5, "total": 10}
  ]'::jsonb
),

-- Chennai Hostels
(
  'Adyar Elite PG for Men', 
  'Chennai', 
  'Sardar Patel Road, Adyar, Chennai', 
  'Boys', 
  true, 
  1.1, 
  350, 
  6000, 
  'https://images.unsplash.com/photo-1598900866874-9f4c39b1a50a?w=600&q=80', 
  ARRAY['fa-wifi', 'fa-utensils', 'fa-plug', 'fa-motorcycle'],
  4.1,
  40,
  '[
    {"type": "Single Share", "price": 8000, "available": 2, "total": 10},
    {"type": "Double Share", "price": 6000, "available": 5, "total": 20},
    {"type": "Triple Share", "price": 5000, "available": 8, "total": 10}
  ]'::jsonb
),
(
  'OMR Co-Living Spaces', 
  'Chennai', 
  'Thoraipakkam, OMR Food Street, Chennai', 
  'Co-Living', 
  true, 
  4.2, 
  500, 
  9000, 
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', 
  ARRAY['fa-wifi', 'fa-user-shield', 'fa-couch', 'fa-plug'],
  4.4,
  50,
  '[
    {"type": "Single Share", "price": 11000, "available": 3, "total": 10},
    {"type": "Double Share", "price": 9000, "available": 6, "total": 20},
    {"type": "Triple Share", "price": 7500, "available": 5, "total": 20}
  ]'::jsonb
),

-- Pune Hostels
(
  'Wakad Residency PG', 
  'Pune', 
  'Datta Mandir Road, Wakad, Pune', 
  'Co-Living', 
  true, 
  2.4, 
  450, 
  8500, 
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80', 
  ARRAY['fa-wifi', 'fa-utensils', 'fa-user-shield', 'fa-couch'],
  4.2,
  40,
  '[
    {"type": "Single Share", "price": 10000, "available": 2, "total": 10},
    {"type": "Double Share", "price": 8500, "available": 5, "total": 20},
    {"type": "Triple Share", "price": 7000, "available": 8, "total": 10}
  ]'::jsonb
),
(
  'Viman Nagar Girls Hostel', 
  'Pune', 
  'Symbiosis Road, Viman Nagar, Pune', 
  'Girls', 
  true, 
  0.5, 
  550, 
  10000, 
  'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&q=80', 
  ARRAY['fa-wifi', 'fa-coffee', 'fa-user-shield', 'fa-spray-can', 'fa-plug'],
  4.5,
  35,
  '[
    {"type": "Single Share", "price": 12000, "available": 1, "total": 5},
    {"type": "Double Share", "price": 10000, "available": 4, "total": 15},
    {"type": "Triple Share", "price": 8500, "available": 8, "total": 15}
  ]'::jsonb
),

-- Delhi NCR Hostels
(
  'Noida Sector 62 Executive PG', 
  'Delhi NCR', 
  'Block B, Sector 62, Noida', 
  'Boys', 
  true, 
  1.8, 
  380, 
  7200, 
  'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=600&q=80', 
  ARRAY['fa-wifi', 'fa-utensils', 'fa-plug', 'fa-motorcycle'],
  4.0,
  40,
  '[
    {"type": "Single Share", "price": 9000, "available": 2, "total": 10},
    {"type": "Double Share", "price": 7200, "available": 5, "total": 20},
    {"type": "Triple Share", "price": 6000, "available": 8, "total": 10}
  ]'::jsonb
),
(
  'Katran Co-Living PG', 
  'Delhi NCR', 
  'DLF Phase 3, Gurugram', 
  'Co-Living', 
  true, 
  1.0, 
  700, 
  13000, 
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80', 
  ARRAY['fa-wifi', 'fa-user-shield', 'fa-couch', 'fa-plug', 'fa-motorcycle'],
  4.6,
  45,
  '[
    {"type": "Single Share", "price": 15000, "available": 3, "total": 10},
    {"type": "Double Share", "price": 13000, "available": 5, "total": 20},
    {"type": "Triple Share", "price": 10000, "available": 7, "total": 15}
  ]'::jsonb
),

-- Mumbai Hostels
(
  'Andheri East Elite PG', 
  'Mumbai', 
  'Marol Naka, Andheri East, Mumbai', 
  'Co-Living', 
  true, 
  0.9, 
  800, 
  15000, 
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80', 
  ARRAY['fa-wifi', 'fa-utensils', 'fa-user-shield', 'fa-couch'],
  4.3,
  40,
  '[
    {"type": "Single Share", "price": 18000, "available": 2, "total": 10},
    {"type": "Double Share", "price": 15000, "available": 5, "total": 20},
    {"type": "Triple Share", "price": 12000, "available": 8, "total": 10}
  ]'::jsonb
),
(
  'Powai Girls Premium Residency', 
  'Mumbai', 
  'Near IIT Bombay Main Gate, Powai, Mumbai', 
  'Girls', 
  true, 
  1.6, 
  900, 
  17000, 
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80', 
  ARRAY['fa-wifi', 'fa-coffee', 'fa-user-shield', 'fa-spray-can', 'fa-plug'],
  4.6,
  35,
  '[
    {"type": "Single Share", "price": 20000, "available": 1, "total": 5},
    {"type": "Double Share", "price": 17000, "available": 4, "total": 15},
    {"type": "Triple Share", "price": 14000, "available": 8, "total": 15}
  ]'::jsonb
)
;
