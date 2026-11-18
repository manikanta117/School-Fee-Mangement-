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


    // GET ALL STUDENTS
    app.get("/api/students", async (req, res) => {
        try {
            const [students] = await pool.query(`
                SELECT
                    student_id AS id,
                    name,
                    dob,
                    gender,
                    class_name AS className,
                    section,
                    parent_name AS parentName,
                    contact,
                    email,
                    address,
                    total_fee AS totalFee,
                    initial_payment AS initialPayment
                FROM students
                ORDER BY created_at DESC
            `);

            res.status(200).json({
                success: true,
                count: students.length,
                data: students
            });

        } catch (error) {
            console.error("Error retrieving students:", error);

            res.status(500).json({
                success: false,
                message: "Failed to retrieve students"
            });
        }
    });



    // POST - ADD NEW STUDENT
    app.post("/api/students", async (req, res) => {
        try {
            const {
                name,
                id,
                dob,
                gender,
                className,
                section,
                parentName,
                contact,
                email,
                address,
                totalFee,
                initialPayment
            } = req.body;

            // Basic validation
            if (!name || !id || !className) {
                return res.status(400).json({
                    success: false,
                    message: "Name, Student ID and Class are required"
                });
            }

            // Insert student into MySQL
            const sql = `
                INSERT INTO students (
                    student_id,
                    name,
                    dob,
                    gender,
                    class_name,
                    section,
                    parent_name,
                    contact,
                    email,
                    address,
                    total_fee,
                    initial_payment
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                id,
                name,
                dob || null,
                gender || null,
                className || null,
                section || null,
                parentName || null,
                contact || null,
                email || null,
                address || null,
                Number(totalFee) || 0,
                Number(initialPayment) || 0
            ];

            const [result] = await pool.query(sql, values);

            res.status(201).json({
                success: true,
                message: "Student added successfully!",
                databaseId: result.insertId,
                studentId: id
            });

        } catch (error) {
            console.error("Error adding student:", error);

            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    success: false,
                    message: "Student ID already exists"
                });
            }

            res.status(500).json({
                success: false,
                message: "Failed to add student"
            });
        }
    });



// ======================================
// PUT - UPDATE STUDENT
// ======================================

app.put("/api/students/:id", async (req, res) => {
    try {
        const studentId = req.params.id;

        const {
            name,
            dob,
            gender,
            className,
            section,
            parentName,
            contact,
            email,
            address,
            totalFee,
            initialPayment
        } = req.body;

        if (!name || !className) {
            return res.status(400).json({
                success: false,
                message: "Name and Class are required"
            });
        }

        const sql = `
            UPDATE students
            SET
                name = ?,
                dob = ?,
                gender = ?,
                class_name = ?,
                section = ?,
                parent_name = ?,
                contact = ?,
                email = ?,
                address = ?,
                total_fee = ?,
                initial_payment = ?
            WHERE student_id = ?
        `;

        const values = [
            name,
            dob || null,
            gender || null,
            className,
            section || null,
            parentName || null,
            contact || null,
            email || null,
            address || null,
            Number(totalFee) || 0,
            Number(initialPayment) || 0,
            studentId
        ];

        const [result] = await pool.query(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Student updated successfully!"
        });

    } catch (error) {
        console.error("Error updating student:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update student"
        });
    }
});


// ======================================
// DELETE - DELETE STUDENT
// ======================================

app.delete("/api/students/:id", async (req, res) => {
    try {
        const studentId = req.params.id;

        const [result] = await pool.query(
            "DELETE FROM students WHERE student_id = ?",
            [studentId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Student deleted successfully!"
        });

    } catch (error) {
        console.error("Error deleting student:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete student"
        });
    }
});




// GET: Fetch all fee payments
app.get("/api/payments", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                p.id,
                p.receipt_id AS receiptId,
                p.student_id AS studentId,
                s.name AS studentName,
                p.amount,
                p.payment_method AS method,
                p.payment_date AS date
            FROM fee_payments p
            JOIN students s ON p.student_id = s.student_id
            ORDER BY p.id DESC
        `);

        res.json({ success: true, data: rows });
    } catch (error) {
        console.error("Fetch payments error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch payments"
        });
    }
});


// POST: Save a new fee payment
app.post("/api/payments", async (req, res) => {
    try {
        const {
            receiptId,
            studentId,
            amount,
            method,
            date
        } = req.body;

        if (!receiptId || !studentId || !amount || Number(amount) <= 0 || !method || !date) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid payment details"
            });
        }

        const [result] = await pool.query(
            `INSERT INTO fee_payments
            (receipt_id, student_id, amount, payment_method, payment_date)
            VALUES (?, ?, ?, ?, ?)`,
            [receiptId, studentId, Number(amount), method, date]
        );

        res.status(201).json({
            success: true,
            message: "Payment saved successfully",
            paymentId: result.insertId
        });

    } catch (error) {
        console.error("Save payment error:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Receipt ID already exists"
            });
        }

        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(400).json({
                success: false,
                message: "Student ID does not exist"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to save payment"
        });
    }
});


    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });