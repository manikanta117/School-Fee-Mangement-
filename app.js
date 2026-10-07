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


                editButton.addEventListener("click", function() {

                    console.log("Modify clicked:", student);

                    localStorage.setItem("editStudent", JSON.stringify(student));

                    window.location.href="add-student.html";
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


  const editStudent = localStorage.getItem("editStudent");

if(editStudent){

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
