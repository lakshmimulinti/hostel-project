const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const runMigrations = async () => {
    console.log('🔄 Database migration started...');
    try {
        const migrationsDir = path.join(__dirname, 'migrations');
        const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
        
        for (const file of files) {
            console.log(`Running migration: ${file}`);
            const sqlPath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(sqlPath, 'utf8');
            await pool.query(sql);
        }
        console.log('✅ Database migration completed successfully! Tables are ready.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    }
};

runMigrations();