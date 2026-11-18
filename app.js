                    console.log("School Management System Has Started");




                    const studentForm = document.getElementById("studentForm");
                    
                    

                    
                        

                


                // ================= EDIT STUDENT =================

                const editStudent = localStorage.getItem("editStudent");

                if(editStudent && studentForm){

                    const student = JSON.parse(editStudent);

                    document.getElementById("studentName").value = student.name;
                    document.getElementById("studentId").value = student.id;
                    document.getElementById("dob").value = student.dob;
                    document.getElementById("gender").value = student.gender;

                    document.getElementById("studentClass").value = student.className;
                    document.getElementById("section").value = student.section;

                    document.getElementById("parentName").value = student.parentName;
                    document.getElementById("contact").value = student.contact;
                    document.getElementById("email").value = student.email;
                    document.getElementById("address").value = student.address;

                    document.getElementById("totalFee").value = student.totalFee;
                    document.getElementById("initialPayment").value = student.initialPayment;

                }


                if (studentForm) {
                    studentForm.addEventListener("submit", async function (event) {
                        event.preventDefault();

                        const student = {
                            name: document.getElementById("studentName").value.trim(),
                            id: document.getElementById("studentId").value.trim(),
                            dob: document.getElementById("dob").value,
                            gender: document.getElementById("gender").value,
                            className: document.getElementById("studentClass").value,
                            section: document.getElementById("section").value,
                            parentName: document.getElementById("parentName").value.trim(),
                            contact: document.getElementById("contact").value.trim(),
                            email: document.getElementById("email").value.trim(),
                            address: document.getElementById("address").value.trim(),
                            totalFee: Number(document.getElementById("totalFee").value) || 0,
                            initialPayment: Number(document.getElementById("initialPayment").value) || 0
                        };

                        
                        try {

                            const editStudentData = localStorage.getItem("editStudent");
                            const oldStudent = editStudentData
                                ? JSON.parse(editStudentData)
                                : null;

                            const url = oldStudent
                                ? `http://localhost:3000/api/students/${encodeURIComponent(oldStudent.id)}`
                                : "http://localhost:3000/api/students";

                            const response = await fetch(url, {
                                method: oldStudent ? "PUT" : "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(student)
                            });

                            const result = await response.json();

                            if (!response.ok) {
                                alert(result.message || "Failed to save student");
                                return;
                            }

                            alert(oldStudent
                                ? "Student updated successfully!"
                                : "Student added successfully!"
                            );

                            localStorage.removeItem("editStudent");

                            studentForm.reset();

                            window.location.href = "students.html";

                        } catch (error) {

                            console.error("Error:", error);
                            alert("Cannot connect to backend. Please check your server.");

                        }

                    });
                }


                    // localStorage.setItem("test","hello");

                    // console.log(localStorage.getItem("test"));


                    // console.log("HI");



                    // // const studeent ={
                    // //     name : "Mani",
                    // //     id:546
                    // // };

                    // // const data = JSON.stringify(studeent);

                    // // console.log(data);


                    // // const studentAgain = JSON.parse(data);

                    // // console.log(studentAgain);
                    // // console.log(studentAgain.name);




            
                // ======================================
                // FEE COLLECTION - MYSQL INTEGRATION
                // ======================================

                const feeTableBody = document.getElementById("feeTableBody");
                const paymentStudent = document.getElementById("paymentStudent");
                const feePaymentForm = document.getElementById("feePaymentForm");
                const paymentAmount = document.getElementById("paymentAmount");

                const feeSearchInput = document.getElementById("feeSearchInput");
                const feeClassFilter = document.getElementById("feeClassFilter");
                const feeStatusFilter = document.getElementById("feeStatusFilter");

                const collectFeeButton = document.querySelector(".collect-fee-btn");
                const collectFeeForm = document.getElementById("collectFeeForm");
                const closeFeeForm = document.getElementById("closeFeeForm");
                const cancelFeeForm = document.getElementById("cancelFeeForm");

                let feeStudents = [];
                let feePayments = [];

                if (feeTableBody) {

                    // Calculate total paid by a student
                    function getStudentPaid(student) {
                        const additionalPayments = feePayments
                            .filter(payment =>
                                String(payment.studentId) === String(student.id)
                            )
                            .reduce((sum, payment) =>
                                sum + Number(payment.amount || 0), 0
                            );

                        return Number(student.initialPayment || 0) + additionalPayments;
                    }

                    // Load students and payments from MySQL
                    async function loadFeeData() {
                        try {
                            const [studentsResponse, paymentsResponse] = await Promise.all([
                                fetch("http://localhost:3000/api/students"),
                                fetch("http://localhost:3000/api/payments")
                            ]);

                            if (!studentsResponse.ok || !paymentsResponse.ok) {
                                throw new Error("Failed to load fee data");
                            }

                            const studentsResult = await studentsResponse.json();
                            const paymentsResult = await paymentsResponse.json();

                            feeStudents = studentsResult.data;
                            feePayments = paymentsResult.data;

                            populatePaymentStudents();
                            displayFeeStudents(feeStudents);

                        } catch (error) {
                            console.error("Fee data loading error:", error);

                            feeTableBody.innerHTML = `
                                <tr>
                                    <td colspan="9">
                                        Unable to load fee details. Check your backend.
                                    </td>
                                </tr>
                            `;
                        }
                    }

                    // Populate student dropdown
                    function populatePaymentStudents() {
                        if (!paymentStudent) return;

                        paymentStudent.innerHTML =
                            '<option value="">Select a student</option>';

                        feeStudents.forEach(student => {
                            const option = document.createElement("option");

                            option.value = student.id;
                            option.textContent =
                                `${student.name} (${student.id})`;

                            paymentStudent.appendChild(option);
                        });
                    }

                    // Display fee details
                    function displayFeeStudents(students) {
                        feeTableBody.innerHTML = "";

                        if (students.length === 0) {
                            feeTableBody.innerHTML = `
                                <tr>
                                    <td colspan="9">No students found.</td>
                                </tr>
                            `;
                            return;
                        }

                        students.forEach((student, index) => {
                            const totalFee = Number(student.totalFee || 0);
                            const paid = getStudentPaid(student);
                            const pending = Math.max(0, totalFee - paid);

                            let status = "pending";

                            if (pending === 0 && totalFee > 0) {
                                status = "paid";
                            } else if (paid > 0) {
                                status = "partial";
                            }

                            const row = document.createElement("tr");

                            row.innerHTML = `
                                <td>${index + 1}</td>
                                <td></td>
                                <td>
                                    <div class="student">
                                        <div class="student-avatar">
                                            ${student.name
                                                ? student.name.substring(0, 2).toUpperCase()
                                                : "NA"}
                                        </div>
                                        <span></span>
                                    </div>
                                </td>
                                <td></td>
                                <td>₹${totalFee.toLocaleString("en-IN")}</td>
                                <td>₹${paid.toLocaleString("en-IN")}</td>
                                <td>₹${pending.toLocaleString("en-IN")}</td>
                                <td>
                                    <span class="status ${status}">${status}</span>
                                </td>
                                <td>—</td>
                            `;

                            row.cells[1].textContent = student.id;
                            row.cells[2].querySelector("span").textContent = student.name;
                            row.cells[3].textContent = student.className || "";

                            feeTableBody.appendChild(row);
                        });
                    }

                    // Search and filter fee records
                    function filterFeeTable() {
                        const searchValue =
                            feeSearchInput.value.toLowerCase().trim();

                        const selectedClass = feeClassFilter.value;
                        const selectedStatus = feeStatusFilter.value;

                        const filteredStudents = feeStudents.filter(student => {
                            const studentId = String(student.id).toLowerCase();
                            const studentName = String(student.name).toLowerCase();
                            const studentClass = student.className || "";

                            const totalFee = Number(student.totalFee || 0);
                            const paid = getStudentPaid(student);
                            const pending = Math.max(0, totalFee - paid);

                            let status = "pending";

                            if (pending === 0 && totalFee > 0) {
                                status = "paid";
                            } else if (paid > 0) {
                                status = "partial";
                            }

                            const matchesSearch =
                                studentId.includes(searchValue) ||
                                studentName.includes(searchValue);

                            const matchesClass =
                                selectedClass === "all" ||
                                studentClass === selectedClass;

                            const matchesStatus =
                                selectedStatus === "all" ||
                                status === selectedStatus;

                            return matchesSearch && matchesClass && matchesStatus;
                        });

                        displayFeeStudents(filteredStudents);
                    }

                    if (feeSearchInput) {
                        feeSearchInput.addEventListener("input", filterFeeTable);
                    }

                    if (feeClassFilter) {
                        feeClassFilter.addEventListener("change", filterFeeTable);
                    }

                    if (feeStatusFilter) {
                        feeStatusFilter.addEventListener("change", filterFeeTable);
                    }

                    // Open and close payment form
                    if (collectFeeButton && collectFeeForm) {
                        collectFeeButton.addEventListener("click", function () {
                            collectFeeForm.style.display = "block";
                        });
                    }

                    if (closeFeeForm && collectFeeForm) {
                        closeFeeForm.addEventListener("click", function () {
                            collectFeeForm.style.display = "none";
                        });
                    }

                    if (cancelFeeForm && collectFeeForm) {
                        cancelFeeForm.addEventListener("click", function () {
                            collectFeeForm.style.display = "none";
                        });
                    }

                    // Save payment to MySQL
                    if (feePaymentForm && paymentAmount && paymentStudent) {

                        feePaymentForm.addEventListener("submit", async function (event) {
                            event.preventDefault();

                            const selectedId = paymentStudent.value;
                            const amount = Number(paymentAmount.value);
                            const method =
                                document.getElementById("paymentMethod").value;

                            const student = feeStudents.find(item =>
                                String(item.id) === String(selectedId)
                            );

                            if (!student) {
                                alert("Please select a student.");
                                return;
                            }

                            if (!Number.isFinite(amount) || amount <= 0) {
                                alert("Enter a valid payment amount.");
                                return;
                            }

                            if (!method) {
                                alert("Please select a payment method.");
                                return;
                            }

                            const totalFee = Number(student.totalFee || 0);
                            const paid = getStudentPaid(student);
                            const pending = Math.max(0, totalFee - paid);

                            if (amount > pending) {
                                alert(
                                    "Payment cannot exceed the pending fee of ₹" +
                                    pending.toLocaleString("en-IN")
                                );
                                return;
                            }

                            // Generate local date in YYYY-MM-DD format
                            const today = new Date();
                            const paymentDate =
                                today.getFullYear() + "-" +
                                String(today.getMonth() + 1).padStart(2, "0") + "-" +
                                String(today.getDate()).padStart(2, "0");

                            const payment = {
                                receiptId: "REC-" + Date.now(),
                                studentId: student.id,
                                amount: amount,
                                method: method,
                                date: paymentDate
                            };

                            try {
                                const response = await fetch(
                                    "http://localhost:3000/api/payments",
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(payment)
                                    }
                                );

                                const result = await response.json();

                                if (!response.ok) {
                                    alert(result.message || "Failed to record payment");
                                    return;
                                }

                                alert("Payment recorded successfully!");

                                feePaymentForm.reset();
                                collectFeeForm.style.display = "none";

                                // Refresh fee details from MySQL
                                await loadFeeData();

                            } catch (error) {
                                console.error("Payment error:", error);
                                alert("Cannot connect to backend. Please check your server.");
                            }
                        });
                    }

                    // Initial load
                    loadFeeData();
                }




            // ================= DASHBOARD RECENT PAYMENTS =================

            const recentPaymentsBody = document.getElementById("recentPaymentsBody");

            if (recentPaymentsBody) {

                async function loadRecentPayments() {
                    try {
                        // Fetch payments and students from MySQL
                        const [paymentsResponse, studentsResponse] = await Promise.all([
                            fetch("http://localhost:3000/api/payments"),
                            fetch("http://localhost:3000/api/students")
                        ]);

                        if (!paymentsResponse.ok || !studentsResponse.ok) {
                            throw new Error("Failed to fetch dashboard payments");
                        }

                        const paymentsResult = await paymentsResponse.json();
                        const studentsResult = await studentsResponse.json();

                        const payments = paymentsResult.data;
                        const students = studentsResult.data;

                        recentPaymentsBody.innerHTML = "";

                        // Display the latest 6 payments
                        payments.slice(0, 6).forEach(payment => {

                            const student = students.find(item =>
                                String(item.id) === String(payment.studentId)
                            );

                            const row = document.createElement("tr");

                            const studentCell = document.createElement("td");
                            const studentDiv = document.createElement("div");
                            studentDiv.className = "student";

                            const avatar = document.createElement("div");
                            avatar.className = "student-avatar";
                            avatar.textContent = (payment.studentName || "NA")
                                .substring(0, 2).toUpperCase();

                            const name = document.createElement("span");
                            name.textContent = payment.studentName || "Unknown Student";

                            studentDiv.appendChild(avatar);
                            studentDiv.appendChild(name);
                            studentCell.appendChild(studentDiv);

                            const classCell = document.createElement("td");
                            classCell.textContent = student ? student.className || "—" : "—";

                            const amountCell = document.createElement("td");
                            amountCell.textContent =
                                "₹" + Number(payment.amount).toLocaleString("en-IN");

                            const dateCell = document.createElement("td");
                            dateCell.textContent = payment.date
                                ? new Date(payment.date).toLocaleDateString("en-IN")
                                : "—";

                            const statusCell = document.createElement("td");
                            const status = document.createElement("span");
                            status.className = "status paid";
                            status.textContent = "Paid";
                            statusCell.appendChild(status);

                            row.appendChild(studentCell);
                            row.appendChild(classCell);
                            row.appendChild(amountCell);
                            row.appendChild(dateCell);
                            row.appendChild(statusCell);

                            recentPaymentsBody.appendChild(row);
                        });

                    } catch (error) {
                        console.error("Dashboard recent payments error:", error);

                        recentPaymentsBody.innerHTML = `
                            <tr>
                                <td colspan="5">Unable to load recent payments.</td>
                            </tr>
                        `;
                    }
                }

                loadRecentPayments();
            }











            
            // ================= DASHBOARD STATISTICS =================

            const totalStudentsCount = document.getElementById("totalStudentsCount");
            const totalFeesCollected = document.getElementById("totalFeesCollected");
            const pendingFeesAmount = document.getElementById("pendingFeesAmount");
            const receiptsGeneratedCount = document.getElementById("receiptsGeneratedCount");

            if (totalStudentsCount) {

                async function loadDashboardStatistics() {

                    try {
                        // Fetch students and payments from MySQL
                        const [studentsResponse, paymentsResponse] = await Promise.all([
                            fetch("http://localhost:3000/api/students"),
                            fetch("http://localhost:3000/api/payments")
                        ]);

                        if (!studentsResponse.ok || !paymentsResponse.ok) {
                            throw new Error("Failed to fetch dashboard statistics");
                        }

                        const studentsResult = await studentsResponse.json();
                        const paymentsResult = await paymentsResponse.json();

                        const students = studentsResult.data;
                        const payments = paymentsResult.data;

                        // 1. Total number of students
                        totalStudentsCount.textContent = students.length;

                        // 2. Calculate initial payments
                        const initialPayments = students.reduce((sum, student) => {
                            return sum + Number(student.initialPayment || 0);
                        }, 0);

                        // 3. Calculate additional payments
                        const additionalPayments = payments.reduce((sum, payment) => {
                            return sum + Number(payment.amount || 0);
                        }, 0);

                        const collected = initialPayments + additionalPayments;

                        // 4. Calculate total expected fees
                        const totalFees = students.reduce((sum, student) => {
                            return sum + Number(student.totalFee || 0);
                        }, 0);

                        // 5. Calculate pending fees
                        const pending = Math.max(0, totalFees - collected);

                        // 6. Update dashboard cards
                        if (totalFeesCollected) {
                            totalFeesCollected.textContent =
                                "₹" + collected.toLocaleString("en-IN");
                        }

                        if (pendingFeesAmount) {
                            pendingFeesAmount.textContent =
                                "₹" + pending.toLocaleString("en-IN");
                        }

                        if (receiptsGeneratedCount) {
                            receiptsGeneratedCount.textContent = payments.length;
                        }

                        // 7. Update fee summary progress
                        const dashboardProgressFill =
                            document.getElementById("dashboardProgressFill");

                        const dashboardProgressText =
                            document.getElementById("dashboardProgressText");

                        const dashboardSummaryCollected =
                            document.getElementById("dashboardSummaryCollected");

                        const progressPercentage = totalFees > 0
                            ? Math.min(100, (collected / totalFees) * 100)
                            : 0;

                        if (dashboardProgressFill) {
                            dashboardProgressFill.style.width =
                                progressPercentage + "%";
                        }

                        if (dashboardProgressText) {
                            dashboardProgressText.textContent =
                                progressPercentage.toFixed(1) + "% collected";
                        }

                        if (dashboardSummaryCollected) {
                            dashboardSummaryCollected.textContent =
                                "₹" + collected.toLocaleString("en-IN");
                        }

                    } catch (error) {
                        console.error("Dashboard statistics error:", error);
                    }
                }

                loadDashboardStatistics();
            }



            // ======================================
            // FETCH STUDENTS AND PAYMENTS FROM MYSQL
            // ======================================

            const studentTableBody = document.getElementById("studentTableBody");

            if (studentTableBody) {

                let allStudents = [];
                let allPayments = [];

                // Calculate total paid by a student
                function getStudentPaid(student) {
                    const additionalPaid = allPayments
                        .filter(payment =>
                            String(payment.studentId) === String(student.id)
                        )
                        .reduce((sum, payment) =>
                            sum + Number(payment.amount || 0), 0
                        );

                    return Number(student.initialPayment || 0) + additionalPaid;
                }

                // Load students and payments from MySQL
                async function loadStudents() {
                    try {
                        const [studentsResponse, paymentsResponse] = await Promise.all([
                            fetch("http://localhost:3000/api/students"),
                            fetch("http://localhost:3000/api/payments")
                        ]);

                        if (!studentsResponse.ok || !paymentsResponse.ok) {
                            throw new Error("Failed to fetch data");
                        }

                        const studentsResult = await studentsResponse.json();
                        const paymentsResult = await paymentsResponse.json();

                        allStudents = studentsResult.data;
                        allPayments = paymentsResult.data;

                        applyStudentFilters();

                    } catch (error) {
                        console.error("Error loading students:", error);

                        studentTableBody.innerHTML = `
                            <tr>
                                <td colspan="11">
                                    Unable to load students. Check your backend.
                                </td>
                            </tr>
                        `;
                    }
                }

                // Display students
                function displayStudents(students) {

                    studentTableBody.innerHTML = "";

                    if (students.length === 0) {
                        studentTableBody.innerHTML = `
                            <tr>
                                <td colspan="11">No students found.</td>
                            </tr>
                        `;
                        return;
                    }

                    students.forEach((student, index) => {

                        const totalFee = Number(student.totalFee) || 0;
                        const paid = getStudentPaid(student);
                        const pending = Math.max(totalFee - paid, 0);

                        let status = "Pending";

                        if (pending === 0 && totalFee > 0) {
                            status = "Paid";
                        } else if (paid > 0) {
                            status = "Partial";
                        }

                        const row = document.createElement("tr");

                        const values = [
                            index + 1,
                            student.id,
                            student.name,
                            `${student.className || ""} ${student.section || ""}`.trim(),
                            student.parentName || "-",
                            student.contact || "-",
                            `₹${totalFee.toLocaleString("en-IN")}`,
                            `₹${paid.toLocaleString("en-IN")}`,
                            `₹${pending.toLocaleString("en-IN")}`,
                            status
                        ];

                        values.forEach(value => {
                            const cell = document.createElement("td");
                            cell.textContent = value;
                            row.appendChild(cell);
                        });

                        // Edit button
                        const actionCell = document.createElement("td");

                        const editButton = document.createElement("button");
                        editButton.className = "action-btn edit";
                        editButton.type = "button";
                        editButton.textContent = "✏️";

                        editButton.addEventListener("click", function () {
                            localStorage.setItem("editStudent", JSON.stringify(student));
                            window.location.href = "add-student.html";
                        });

                        // Delete button
                        const deleteButton = document.createElement("button");
                        deleteButton.className = "action-btn delete";
                        deleteButton.type = "button";
                        deleteButton.textContent = "🗑️";

                        deleteButton.addEventListener("click", async function () {

                            const confirmDelete = confirm(
                                `Are you sure you want to delete ${student.name}?`
                            );

                            if (!confirmDelete) return;

                            try {
                                const response = await fetch(
                                    `http://localhost:3000/api/students/${encodeURIComponent(student.id)}`,
                                    { method: "DELETE" }
                                );

                                const result = await response.json();

                                if (!response.ok) {
                                    alert(result.message || "Failed to delete student");
                                    return;
                                }

                                alert("Student deleted successfully!");

                                await loadStudents();

                            } catch (error) {
                                console.error("Delete error:", error);
                                alert("Cannot connect to backend.");
                            }
                        });

                        actionCell.appendChild(editButton);
                        actionCell.appendChild(deleteButton);

                        row.appendChild(actionCell);
                        studentTableBody.appendChild(row);
                    });

                    // Update footer count
                    const footer = document.querySelector(".students-footer span");

                    if (footer) {
                        footer.textContent = `Showing ${students.length} students`;
                    }
                }

                // Search and filters
                const studentSearch = document.getElementById("studentSearch");
                const classFilter = document.getElementById("classFilter");
                const statusFilter = document.getElementById("statusFilter");

                function applyStudentFilters() {

                    const searchValue = studentSearch?.value.toLowerCase().trim() || "";
                    const selectedClass = classFilter?.value || "";
                    const selectedStatus = statusFilter?.value || "";

                    const filteredStudents = allStudents.filter(student => {

                        const totalFee = Number(student.totalFee) || 0;
                        const paid = getStudentPaid(student);
                        const pending = Math.max(totalFee - paid, 0);

                        let status = "Pending";

                        if (pending === 0 && totalFee > 0) {
                            status = "Paid";
                        } else if (paid > 0) {
                            status = "Partial";
                        }

                        const matchesSearch =
                            String(student.name || "").toLowerCase().includes(searchValue) ||
                            String(student.id || "").toLowerCase().includes(searchValue) ||
                            String(student.contact || "").includes(searchValue);

                        const matchesClass =
                            !selectedClass || student.className === selectedClass;

                        const matchesStatus =
                            !selectedStatus || status === selectedStatus;

                        return matchesSearch && matchesClass && matchesStatus;
                    });

                    displayStudents(filteredStudents);
                }

                if (studentSearch) {
                    studentSearch.addEventListener("input", applyStudentFilters);
                }

                if (classFilter) {
                    classFilter.addEventListener("change", applyStudentFilters);
                }

                if (statusFilter) {
                    statusFilter.addEventListener("change", applyStudentFilters);
                }

                // Initial load
                loadStudents();
            }




 // ======================================
 // RECEIPTS - MYSQL INTEGRATION
 // ======================================

const receiptTableBody = document.getElementById("receiptTableBody");

if (receiptTableBody) {

    async function loadReceipts() {

        try {
            const [paymentsResponse, studentsResponse] = await Promise.all([
                fetch("http://localhost:3000/api/payments"),
                fetch("http://localhost:3000/api/students")
            ]);

            if (!paymentsResponse.ok || !studentsResponse.ok) {
                throw new Error("Failed to load receipts");
            }

            const paymentsResult = await paymentsResponse.json();
            const studentsResult = await studentsResponse.json();

            const payments = paymentsResult.data;
            const students = studentsResult.data;

            receiptTableBody.innerHTML = "";

            if (payments.length === 0) {
                receiptTableBody.innerHTML = `
                    <tr>
                        <td colspan="9">No receipts found.</td>
                    </tr>
                `;
                return;
            }

            payments.forEach((payment, index) => {

                const student = students.find(item =>
                    String(item.id) === String(payment.studentId)
                );

                const row = document.createElement("tr");

                const values = [
                    index + 1,
                    payment.receiptId,
                    payment.studentName || "Unknown Student",
                    student ? student.className || "—" : "—",
                    "₹" + Number(payment.amount).toLocaleString("en-IN"),
                    payment.date
                        ? new Date(payment.date).toLocaleDateString("en-IN")
                        : "—",
                    payment.method || "—",
                    "Paid",
                    "—"
                ];

                values.forEach((value, cellIndex) => {
                    const cell = document.createElement("td");

                    if (cellIndex === 7) {
                        const status = document.createElement("span");
                        status.className = "status paid";
                        status.textContent = value;
                        cell.appendChild(status);
                    } else {
                        cell.textContent = value;
                    }

                    row.appendChild(cell);
                });

                receiptTableBody.appendChild(row);
            });

        } catch (error) {
            console.error("Receipt loading error:", error);

            receiptTableBody.innerHTML = `
                <tr>
                    <td colspan="9">
                        Unable to load receipts. Check your backend.
                    </td>
                </tr>
            `;
        }
    }

    loadReceipts();
}


// ======================================
// RECEIPT STATISTICS - MYSQL
// ======================================

const receiptStatsSection = document.getElementById("totalReceiptsCount");

if (receiptStatsSection) {

    async function loadReceiptStatistics() {

        try {
            const response = await fetch("http://localhost:3000/api/payments");

            if (!response.ok) {
                throw new Error("Unable to load payments");
            }

            const result = await response.json();
            const payments = result.data || [];

            const now = new Date();

            const today = [
                now.getFullYear(),
                String(now.getMonth() + 1).padStart(2, "0"),
                String(now.getDate()).padStart(2, "0")
            ].join("-");

            const currentMonth = today.slice(0, 7);

            const todayPayments = payments.filter(payment =>
                String(payment.date).slice(0, 10) === today
            );

            const monthlyPayments = payments.filter(payment =>
                String(payment.date).slice(0, 7) === currentMonth
            );

            const monthlyAmount = monthlyPayments.reduce(
                (total, payment) => total + Number(payment.amount),
                0
            );

            const totalAmount = payments.reduce(
                (total, payment) => total + Number(payment.amount),
                0
            );

            const averageAmount = payments.length
                ? totalAmount / payments.length
                : 0;

            const formatINR = amount =>
                "₹" + Math.round(amount).toLocaleString("en-IN");

            document.getElementById("totalReceiptsCount").textContent =
                payments.length;

            document.getElementById("todayReceiptsCount").textContent =
                todayPayments.length;

            document.getElementById("monthlyReceiptsAmount").textContent =
                formatINR(monthlyAmount);

            document.getElementById("averageReceiptAmount").textContent =
                formatINR(averageAmount);

        } catch (error) {
            console.error("Receipt statistics error:", error);
        }
    }

    loadReceiptStatistics();
}