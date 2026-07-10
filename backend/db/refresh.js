const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

const runRefresh = async () => {
    console.log('🔄 Resetting database schema and seed data...');
    try {
        console.log('Dropping existing tables...');
        await pool.query('DROP TABLE IF EXISTS bookings CASCADE;');
        await pool.query('DROP TABLE IF EXISTS hostels CASCADE;');
        await pool.query('DROP TABLE IF EXISTS users CASCADE;');
        
        console.log('Starting migrations...');
        const migrationsDir = path.join(__dirname, 'migrations');
        const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
        
        for (const file of files) {
            console.log(`Running migration: ${file}`);
            const sqlPath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(sqlPath, 'utf8');
            await pool.query(sql);
        }
        console.log('✅ Database refresh completed successfully! Fresh schema and seed data are ready.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Database refresh failed:', err.message);
        process.exit(1);
    }
};

runRefresh();
