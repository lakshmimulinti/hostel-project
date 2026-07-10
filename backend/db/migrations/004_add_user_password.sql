-- 004_add_user_password.sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);
