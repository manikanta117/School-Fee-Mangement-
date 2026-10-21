    console.log("School Management System Has Started");




    const studentForm = document.getElementById("studentForm");
     
    

    
        

    const savedStudent = localStorage.getItem("students");

    const students = savedStudent ? JSON.parse(savedStudent) : [];

    console.log("Students loaded:", students);

    const tableBody = document.getElementById("studentTableBody");


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

    console.log(tableBody);

    if(tableBody){

        

        students.forEach((student,index)=>{
        const row = document.createElement("tr");

        // const numberCell = document.createElement("td");

        // numberCell.textContent=student.id;


        // const nameCell = document.createElement("td");
        // nameCell.textContent = student.name;

        // row.appendChild(numberCell);

        // row.appendChild(nameCell);
        


            const numberCell = document.createElement("td");
        numberCell.textContent = index + 1;
        row.appendChild(numberCell);

        // Student ID
        const idCell = document.createElement("td");
        idCell.textContent = student.id;
        row.appendChild(idCell);

        // Student Name
        const nameCell = document.createElement("td");
        nameCell.textContent = student.name;
        row.appendChild(nameCell);

        const classCell = document.createElement("td");
        classCell.textContent = student.className;
        row.appendChild(classCell);


        const parentCell = document.createElement("td");
        parentCell.textContent = student.parentName;
        row.appendChild(parentCell);


        const contactCell = document.createElement("td");
        contactCell.textContent = student.contact;
        row.appendChild(contactCell);

        // Total Fee
        const totalFeeCell = document.createElement("td");
        totalFeeCell.textContent = "₹" + student.totalFee;
        row.appendChild(totalFeeCell);

        // Paid
        const paidCell = document.createElement("td");
        paidCell.textContent = "₹" + student.initialPayment;
        row.appendChild(paidCell);

            const pendingFee = Number(student.totalFee)-Number(student.initialPayment);
        const pendingCell = document.createElement("td");
            pendingCell.textContent = "₹" + pendingFee;
            row.appendChild(pendingCell)


            //status


            let statusText;

            if(Number(student.initialPayment)===Number(student.totalFee)){
                statusText = "paid";
            }
            else if (Number(student.initialPayment) > 0){
            statusText="partial";    
            }
            else{
                statusText = "Pending";
            }

            const statusCell = document.createElement("td");

            const statusSpan = document.createElement("span");
            statusSpan.textContent = statusText;
            statusSpan.classList.add("status", statusText.toLowerCase());

            statusCell.appendChild(statusSpan);
            row.appendChild(statusCell);  





            const actionCell = document.createElement("td");

            const editButton = document.createElement("button");
            editButton.className = "action-btn edit";
            editButton.textContent = "✏️";
            editButton.type="button";


                // editButton.addEventListener("click", function() {

                //     console.log("Modify clicked:", student);

                //     localStorage.setItem("editStudent", JSON.stringify(student));

                //     window.location.href="add-student.html";
                //     console.log("Edit student saved:", localStorage.getItem("editStudent"));    
                // });


                
            editButton.addEventListener("click", function() {
                console.log("Modify clicked:", student);

                localStorage.setItem("editStudent", JSON.stringify(student));

                console.log("Saved data:", localStorage.getItem("editStudent"));

                window.location.href = "add-student.html";
            });

            




            const deleteButton = document.createElement("button");
            deleteButton.className = "action-btn delete";
            deleteButton.textContent = "🗑️";

            deleteButton.addEventListener("click", function() {

                console.log("Delete clicked:", student);

                const studentIndex = students.indexOf(student);

                students.splice(studentIndex, 1);

                localStorage.setItem("students", JSON.stringify(students));

                row.remove();

                const rows = tableBody.querySelectorAll("tr");
                console.log(rows);

                rows.forEach((row,index) =>{

                    row.cells[0].textContent = index+1;
                });

                console.log("Student index:", studentIndex);
            });

            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);

            row.appendChild(actionCell);
        tableBody.appendChild(row);

        });

    }
    




    if(studentForm){
        studentForm.addEventListener("submit",function(event){
            event.preventDefault();
            console.log("save student button clicked");
            const studentName = document.getElementById("studentName").value;
            const studentId = document.getElementById("studentId").value;


            const dob = document.getElementById("dob").value;
            const gender = document.getElementById("gender").value;

            const studentClass = document.getElementById("studentClass").value;
            const section = document.getElementById("section").value;

            const parentName = document.getElementById("parentName").value;
            const contact = document.getElementById("contact").value;
            const email = document.getElementById("email").value;
            const address = document.getElementById("address").value;

            const totalFee = document.getElementById("totalFee").value;
            const initialPayment = document.getElementById("initialPayment").value;

        const student ={
        name: studentName,
        id: studentId,
        dob: dob,
        gender: gender,
        className: studentClass,
        section: section,
        parentName: parentName,
        contact: contact,
        email: email,
        address: address,
        totalFee: totalFee,
        initialPayment: initialPayment
    };


    
const editStudentData = localStorage.getItem("editStudent");
const oldStudent = editStudentData
    ? JSON.parse(editStudentData)
    : null;

const duplicateStudent = students.some((s) =>
    s.id === studentId &&
    (!oldStudent || s.id !== oldStudent.id)
);

if (duplicateStudent) {
    alert("This Student ID already exists!");
    return;
}



  const editStudent = localStorage.getItem("editStudent");

if(editStudent && studentForm){

    const oldStudent = JSON.parse(editStudent);

    console.log("Old student ID:", oldStudent.id);
console.log("All student IDs:");
    

    const studentIndex = students.findIndex((s)=>{
        return s.id === oldStudent.id;
    });

        console.log("Editing ID:", oldStudent.id);
    console.log("Found index:", studentIndex);
    console.log("Before update:", students);

    students[studentIndex] = student;

    localStorage.removeItem("editStudent");

}
else{

    students.push(student);

}


            console.log("Students array:", students);


            // Convert array into string and save it
            localStorage.setItem("students", JSON.stringify(students));

            // console.log("Saved data:", localStorage.getItem("students"));


            console.log("Student saved successfully!");
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




const feeTableBody = document.getElementById("feeTableBody");

// check whether the table exist

console.log("Fee table body:", feeTableBody);

if(feeTableBody){

    const savedStudent = localStorage.getItem("students"); // converst data in to javaScrit while retrving from localStorage

    const studentList = savedStudent ?
                       JSON.parse(savedStudent):[];

    studentList.forEach((student,index)=>{
        const  row = document.createElement("tr");

       
        const totalFee = Number(student.totalFee) || 0;
        const initialPayment = Number(student.initialPayment) || 0;

        const savedPayments = localStorage.getItem("feePayments");
        const paymentList = savedPayments
            ? JSON.parse(savedPayments)
            : [];

        const additionalPayments = paymentList
            .filter(function (payment) {
                return String(payment.studentId) === String(student.id);
            })
            .reduce(function (sum, payment) {
                return sum + Number(payment.amount);
            }, 0);

        const paid = initialPayment + additionalPayments;
        const pending = Math.max(0, totalFee - paid);

        let status;

        if (paid >= totalFee && totalFee > 0) {
            status = "paid";
        } else if (paid > 0) {
            status = "partial";
        } else {
            status = "pending";
        }



        // row.innerHTML = `
        // <td>${index + 1}</td>
        // <td>${student.id}</td>
        // <td>${student.name}</td>
        // `

         row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.id}</td>
            <td>
                <div class="student">
                    <div class="student-avatar">
                        ${student.name ? student.name.substring(0, 2).toUpperCase() : "NA"}
                    </div>
                    <span>${student.name || "Unnamed Student"}</span>
                </div>
            </td>
            <td>${student.className || ""}</td>
            <td>₹${totalFee.toLocaleString("en-IN")}</td>
            <td>₹${paid.toLocaleString("en-IN")}</td>
            <td>₹${pending.toLocaleString("en-IN")}</td>
            <td><span class="status ${status.toLowerCase()}">${status}</span></td>
            <td>—</td>
        `;


        feeTableBody.appendChild(row);
     });


     const feeSearchInput = document.getElementById("feeSearchInput");
     const feeStatusFilter=document.getElementById("feeStatusFilter");
     const feeClassFilter = document.getElementById("feeClassFilter");
    

     function  filterFeeTable(){


        const searchValue = feeSearchInput.value.toLowerCase().trim();
        const selectedClass = feeClassFilter.value;
        const selectedStatus = feeStatusFilter.value;


        const rows = feeTableBody.querySelectorAll("tr");

            rows.forEach(function (row) {
            const studentId = row.cells[1].textContent.toLowerCase();
            const studentName = row.cells[2].textContent.toLowerCase();
            const studentClass = row.cells[3].textContent.trim();
            const studentStatus = row.cells[7].textContent.toLowerCase().trim();
            
            const matchesSearch = 
                  studentId.includes(searchValue) ||
                  studentName.includes(searchValue);


            const matchesClass = 
                selectedClass === "all" ||
                studentClass === selectedClass;


        const matchesStatus =
            selectedStatus === "all" ||
            studentStatus === selectedStatus;


            row.style.display =
                    matchesSearch && matchesClass && matchesStatus ? "" : "none";
        });
    }


   if (feeTableBody && feeSearchInput && feeClassFilter && feeStatusFilter) {
    feeSearchInput.addEventListener("input", filterFeeTable);
    feeClassFilter.addEventListener("change", filterFeeTable);
    feeStatusFilter.addEventListener("change", filterFeeTable);
   }
}



const collectFeeButton = document.querySelector(".collect-fee-btn");
const collectFeeForm = document.getElementById("collectFeeForm");
const closeFeeForm = document.getElementById("closeFeeForm");
const cancelFeeForm = document.getElementById("cancelFeeForm");

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

const paymentStudent = document.getElementById("paymentStudent");

if (paymentStudent) {
    const savedStudents = localStorage.getItem("students");
    const studentList = savedStudents
        ? JSON.parse(savedStudents)
        : [];

    studentList.forEach(function (student) {
        const option = document.createElement("option");

        option.value = student.id;
        option.textContent = student.name + " (" + student.id + ")";

        paymentStudent.appendChild(option);
    });
}


const feePaymentForm = document.getElementById("feePaymentForm");
const paymentAmount = document.getElementById("paymentAmount");

if (feePaymentForm && paymentAmount && paymentStudent) {
    feePaymentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const selectedId = paymentStudent.value;
        const amount = Number(paymentAmount.value);
        const method = document.getElementById("paymentMethod").value;

        const savedStudents = localStorage.getItem("students");
        const studentList = savedStudents
            ? JSON.parse(savedStudents)
            : [];

        const student = studentList.find(function (item) {
            return String(item.id) === String(selectedId);
        });

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

        const totalFee = Number(student.totalFee) || 0;
        const initialPayment = Number(student.initialPayment) || 0;

        const savedPayments = localStorage.getItem("feePayments");
        const paymentList = savedPayments
            ? JSON.parse(savedPayments)
            : [];

        const additionalPayments = paymentList
            .filter(function (payment) {
                return String(payment.studentId) === String(student.id);
            })
            .reduce(function (sum, payment) {
                return sum + Number(payment.amount);
            }, 0);

        const pending = Math.max(
            0,
            totalFee - initialPayment - additionalPayments
        );

        if (amount > pending) {
            alert("Payment cannot exceed the pending fee of ₹" + pending);
            return;
        }

        paymentList.push({
            receiptId: "REC-" + Date.now(),
            studentId: student.id,
            studentName: student.name,
            amount: amount,
            method: method,
            date: new Date().toISOString()
        });

        localStorage.setItem(
            "feePayments",
            JSON.stringify(paymentList)
        );

        alert("Payment recorded successfully!");

        // Reload the page to recalculate the fee table.
        window.location.reload();

    });
}


// ================= RECEIPTS PAGE =================

const receiptTableBody = document.getElementById("receiptTableBody");

if (receiptTableBody) {
    console.log("Receipts page detected!");

    const savedPayments = localStorage.getItem("feePayments");
    const paymentList = savedPayments
        ? JSON.parse(savedPayments)
        : [];

    console.log("Payments for receipts:", paymentList);


    paymentList.forEach((payment,index)=>{
        const row= document.createElement("tr");

        const studentList = JSON.parse(localStorage.getItem("students") || "[]");


        const student = studentList.find(function(item){
            return String(item.id)==String(payment.studentId);
        });

         const receiptId = payment.receiptId ||
        (payment.date ? "REC-" + new Date(payment.date).getTime() : "—");
        const paymentDate = payment.date
    ? new Date(payment.date).toLocaleDateString("en-IN")
    : "—";


        row.innerHTML = `
         <td>${index+1}</td>
         <td>${receiptId}</td>
         <td><div class="student">
          <div class="student-avatar">
                ${(payment.studentName || "NA").substring(0,2).toUpperCase()}
          </div>
           <span>${payment.studentName || "Unknown Student"}</span>
         </div>
         
         </td>
         <td>${student ? student.className : "—"}</td>
         <td>₹${Number(payment.amount).toLocaleString("en-IN")}</td>
        <td>${paymentDate}</td>
        <td>${payment.method || "—"}</td>
         <td><span class="status paid">Generated</span></td>
          <td>—</td>

        `;

        receiptTableBody.appendChild(row);
    });
}



 // ================= DASHBOARD RECENT PAYMENTS =================

const recentPaymentsBody = document.getElementById("recentPaymentsBody");

if (recentPaymentsBody) {
    const payments = JSON.parse(
        localStorage.getItem("feePayments") || "[]"
    );

    const students = JSON.parse(
        localStorage.getItem("students") || "[]"
    );

    // Show newest payments first
    payments.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    });

    recentPaymentsBody.innerHTML = "";

    payments.slice(0, 6).forEach(function (payment) {
        const student = students.find(function (item) {
            return String(item.id) === String(payment.studentId);
        });

        const row = document.createElement("tr");

        const paymentDate = payment.date
            ? new Date(payment.date).toLocaleDateString("en-IN")
            : "—";

        row.innerHTML = `
            <td>
                <div class="student">
                    <div class="student-avatar">
                        ${(payment.studentName || "NA").substring(0, 2).toUpperCase()}
                    </div>
                    <span>${payment.studentName || "Unknown Student"}</span>
                </div>
            </td>
            <td>${student ? student.className : "—"}</td>
            <td>₹${Number(payment.amount).toLocaleString("en-IN")}</td>
            <td>${paymentDate}</td>
            <td>
                <span class="status paid">Paid</span>
            </td>
        `;

        recentPaymentsBody.appendChild(row);
    });
}










 // ================= DASHBOARD STATISTICS =================

const totalStudentsCount = document.getElementById("totalStudentsCount");
const totalFeesCollected = document.getElementById("totalFeesCollected");
const pendingFeesAmount = document.getElementById("pendingFeesAmount");
const receiptsGeneratedCount = document.getElementById("receiptsGeneratedCount");

if (totalStudentsCount) {
    const students = JSON.parse(localStorage.getItem("students") || "[]");
    const payments = JSON.parse(localStorage.getItem("feePayments") || "[]");

    // Total number of students
    totalStudentsCount.textContent = students.length;

    // Total fees collected from initial and additional payments
    const initialPayments = students.reduce(function (sum, student) {
        return sum + Number(student.initialPayment || 0);
    }, 0);

    const additionalPayments = payments.reduce(function (sum, payment) {
        return sum + Number(payment.amount || 0);
    }, 0);

    const collected = initialPayments + additionalPayments;

    // Total fees expected from all students
    const totalFees = students.reduce(function (sum, student) {
        return sum + Number(student.totalFee || 0);
    }, 0);


    
const dashboardProgressFill = document.getElementById("dashboardProgressFill");
const dashboardProgressText = document.getElementById("dashboardProgressText");

const progressPercentage = totalFees > 0
    ? Math.min(100, (collected / totalFees) * 100)
    : 0;

if (dashboardProgressFill) {
    dashboardProgressFill.style.width = progressPercentage + "%";
}

if (dashboardProgressText) {
    dashboardProgressText.textContent =
        progressPercentage.toFixed(1) + "% collected";
}


    // Update collected and pending amounts
    totalFeesCollected.textContent = "₹" + collected.toLocaleString("en-IN");
    const dashboardSummaryCollected = document.getElementById("dashboardSummaryCollected");

if (dashboardSummaryCollected) {
    dashboardSummaryCollected.textContent =
        "₹" + collected.toLocaleString("en-IN");
}
    pendingFeesAmount.textContent = "₹" + Math.max(0, totalFees - collected).toLocaleString("en-IN");

    // Number of payment receipts
    receiptsGeneratedCount.textContent = payments.length;
}
