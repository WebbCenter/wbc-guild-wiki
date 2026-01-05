const { createClient } = require('@libsql/client');
const dotenv = require('dotenv');
dotenv.config()

let db;

const initDatabase = async () => {
    if (!db) {
        db = createClient({
            url: process.env.TURSO_DATABASE_URL,
            authToken: process.env.TURSO_AUTH_TOKEN
        });
    
        console.log('Database connected successfully!');
    }
    
    return db;
};

const getDatabase = () => {
    if (!db)
        throw new Error("Database not initialized. Call initDatabase() first.")
    
    return db;
}

module.exports = { initDatabase, getDatabase };