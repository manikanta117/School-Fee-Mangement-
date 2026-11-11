
const pool = require("../db");

async function testConnection() {
    try {
        const connection = await pool.getConnection();

        console.log("MySQL Connected Successfully!");

        connection.release();
        await pool.end();

    } catch (error) {
        console.error("Database Connection Failed:", error.message);
        process.exitCode = 1;
    }
}

testConnection();
