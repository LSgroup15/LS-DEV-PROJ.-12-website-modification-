//database//
function addFacilitator() {
    const name = document.getElementById('facilitator-name').value;
    const department = document.getElementById('facilitator-department').value;
    const plateNumber = document.getElementById('facilitator-plate_number').value;
    const validation = document.getElementById('facilitator-validation').value;
    const cpNumber = document.getElementById('facilitator-cp_number').value;

    fetch('/addFacilitator', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, department, plateNumber, validation, cpNumber })
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        hideForm();
    })
    .catch(error => console.error('Error:', error));
}



function hideForm() {
    document.getElementById('facilitator-form').style.display = 'none';
}

async function addStudent() {
    const name = document.getElementById('student-name').value;
    const department = document.getElementById('student-department').value;
    const year_section = document.getElementById('student-year_section').value;
    const plateNumber = document.getElementById('student-plate_number').value;
    const validation = document.getElementById('student-validation').value;
    const cpNumber = document.getElementById('student-cp_number').value;

    const studentData = {
        name,
        department,
        year_section,
        plate_number: plateNumber,
        validation,
        cp_number: cpNumber
    };

    try {
        const response = await fetch('/student', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });

        if (response.ok) {
            // Refresh the facilitator list
            loadStudents();

            // Clear the form fields after a successful add
            document.getElementById('student-name').value = '';
            document.getElementById('student-department').value = '';
            document.getElementById('student-year_section').value = '';
            document.getElementById('student-plate_number').value = '';
            document.getElementById('student-validation').value = '';
            document.getElementById('student-cp_number').value = '';

            // Hide the form
            document.getElementById('student-form').style.display = 'none';
            alert('Student added successfully');
        } else {
            throw new Error('Failed to add student');
        }

        if (response.ok) {
            document.getElementById('student-name').value = '';
            document.getElementById('student-department').value = '';
            document.getElementById('student-year_section').value = '';
            document.getElementById('student-plate_number').value = '';
            document.getElementById('student-validation').value = '';
            document.getElementById('student-cp_number').value = '';
            loadStudents();
        } else {
            throw new Error('Failed to add student');
        }
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}


function hideForm() {
    document.getElementById('facilitator-form').style.display = 'none';
    document.getElementById('student-form').style.display = 'none';
}

async function loadFacilitators() {
    try {
        const response = await fetch('/facilitator');
        if (response.ok) {
            const facilitators = await response.json();
            updateFacilitatorList(facilitators);
        } else {
            throw new Error('Error fetching facilitators');
        }
    } catch (error) {
        console.error('Failed to load facilitators:', error);
        alert('Failed to load facilitators. Please try again later.');
    }
}

async function loadStudents() {
    try {
        const response = await fetch('/student');
        if (response.ok) {
            const students = await response.json();
            updateStudentList(students);
        } else {
            throw new Error('Error fetching students');
        }
    } catch (error) {
        console.error('Failed to load students:', error);
        alert('Failed to load students. Please try again later.');
    }
}


// Updates the facilitator list in the UI
function updateFacilitatorList(facilitators) {
    const listContainer = document.getElementById('facilitator-list');
    listContainer.innerHTML = '';
    facilitators.forEach(facilitator => {
        const listItem = document.createElement('li');
        listItem.textContent = `${facilitator.name} - ${facilitator.department}`;
        listContainer.appendChild(listItem);
    });
}

// Updates the student list in the UI
function updateStudentList(students) {
    const listContainer = document.getElementById('student-list');
    listContainer.innerHTML = '';
    students.forEach(student => {
        const listItem = document.createElement('li');
        listItem.textContent = `${student.name} - ${student.department}`;
        listContainer.appendChild(listItem);
    });
}