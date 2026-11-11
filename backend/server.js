const express = require("express");
const cors = require("cors");
const pool = require("../db");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


app.get("/api/test", (req, res) => {
    res.json({
        message: "School Fees Backend is running!"
    });
});


app.get("/api/test-db", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT 1 AS result");

        res.json({
            message: "Backend connected to MySQL successfully!",
            databaseResult: rows[0].result
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Database connection failed"
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});