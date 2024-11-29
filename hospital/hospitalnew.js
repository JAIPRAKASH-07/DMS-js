
const form = document.getElementById('hospitalForm');
const actionBtn = document.getElementById('hospitalbtn');
const hospitalTable = document.getElementById('hospitalTable').querySelector('tbody');
const toggleFormBtn = document.getElementById('toggleButton');

let isEditing = false;
let currentRow = null;

// Toggle form visibility
toggleFormBtn.addEventListener('click', function () {
    const formContainer = document.querySelector('.containerhospital');
    formContainer.style.display = formContainer.style.display === 'none' || formContainer.style.display === '' ? 'block' : 'none';
});

// Fetch hospitals on page load
window.onload = fetchHospitals;

// Function to fetch hospitals (GET)
function fetchHospitals() {
    fetch('http://77.37.45.2:1000/api/v1/hospitalregistration/fetchallhospitalregistrations')
        .then(response => response.json())
        .then(data => {
            hospitalTable.innerHTML = ''; // Clear current table rows
            data.forEach(hospital => addHospitalToTable(hospital));
        })
        .catch(error => console.error('Error fetching hospitals:', error));
}

// Add hospital to the table (helper function)
function addHospitalToTable(hospital) {
    const newRow = hospitalTable.insertRow();
    newRow.insertCell(0).textContent = hospital.name;
    newRow.insertCell(1).textContent = hospital.email;
    newRow.insertCell(2).textContent = hospital.phone;
    newRow.insertCell(3).textContent = hospital.location;
    newRow.insertCell(4).textContent = hospital.address;
    newRow.insertCell(5).textContent = hospital.pincode;

    const actionCell = newRow.insertCell(6);

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit-btn');
    editBtn.onclick = () => editHospital(newRow, hospital.id);
    actionCell.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.onclick = () => deleteHospital(hospital.id, newRow);
    actionCell.appendChild(deleteBtn);
}

// Add or update hospital on form submit (POST/PUT)
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const hospitalData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value,
        address: document.getElementById('address').value,
        pincode: document.getElementById('pincode').value
    };

    if (isEditing && currentRow) {
        // Update existing hospital (PUT)
        fetch(`http://77.37.45.2:1000/api/v1/hospitalregistration/updatehospitalregistration/${currentRow.dataset.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(hospitalData)
        })
        .then(response => response.json())
        .then(data => {
            updateHospitalRow(data);
            isEditing = false;
            actionBtn.value = 'Submit';
            form.reset();
        })
        .catch(error => console.error('Error updating hospital:', error));
    } else {
        // Add new hospital (POST)
        fetch('http://77.37.45.2:1000/api/v1/hospitalregistration/savehospitalregistration', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(hospitalData)
        })
        .then(response => response.json())
        .then(data => {
            addHospitalToTable(data);
            form.reset();
        })
        .catch(error => console.error('Error adding hospital:', error));
    }
});

// Edit hospital
function editHospital(row, id) {
    isEditing = true;
    currentRow = row;
    currentRow.dataset.id = id;

    document.getElementById('name').value = row.cells[0].textContent;
    document.getElementById('email').value = row.cells[1].textContent;
    document.getElementById('phone').value = row.cells[2].textContent;
    document.getElementById('location').value = row.cells[3].textContent;
    document.getElementById('address').value = row.cells[4].textContent;
    document.getElementById('pincode').value = row.cells[5].textContent;

    actionBtn.value = 'Update';
}

// Delete hospital (DELETE)
function deleteHospital(id, row) {
    if (confirm('Are you sure you want to delete this hospital?')) {
        fetch(`http://77.37.45.2:1000/api/v1/hospitalregistration/deletehospitalregistration/${id}`, {
            method: 'DELETE'
        })
        .then(() => row.remove())
        .catch(error => console.error('Error deleting hospital:', error));
    }
}

// Helper function to update the row after editing
function updateHospitalRow(data) {
    currentRow.cells[0].textContent = data.name;
    currentRow.cells[1].textContent = data.email;
    currentRow.cells[2].textContent = data.phone;
    currentRow.cells[3].textContent = data.location;
    currentRow.cells[4].textContent = data.address;
    currentRow.cells[5].textContent = data.pincode;
}
// Fetch hospitals on page load
window.onload = fetchHospitals;
