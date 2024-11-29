
const form = document.getElementById('productForm');
const actionBtn = document.getElementById('actionBtn');
const productTable = document.getElementById('productTable');
const toggleFormBtn = document.getElementById('toggleFormBtn');

let isEditing = false;
let currentRow = null;

// Toggle form visibility
toggleFormBtn.addEventListener('click', function () {
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        toggleFormBtn.textContent = 'Hide Form';
    } else {
        form.style.display = 'none';
        toggleFormBtn.textContent = 'Add New Product';
    }
});

// Function to fetch products (GET)
function fetchProducts() {
    fetch('http://77.37.45.2:1000/api/v1/product/fetchallproducts')
        .then(response => response.json())
        .then(data => {
            // Clear current table rows
            productTable.innerHTML = '';

            // Loop through the fetched data and add each product to the table
            data.forEach(product => {
                const newRow = productTable.insertRow();

                newRow.insertCell(0).textContent = product.name;
                newRow.insertCell(1).textContent = product.batchCode;
                newRow.insertCell(2).textContent = product.expiryDate;
                newRow.insertCell(3).textContent = product.mrp;
                newRow.insertCell(4).textContent = product.dpvalue;
                newRow.insertCell(5).textContent = product.quantity;

                // Add Edit and Delete buttons
                const actionCell = newRow.insertCell(6);

                // Edit button
                const editBtn = document.createElement('button');
                editBtn.textContent = 'Edit';
                editBtn.onclick = () => editProduct(newRow, product.id);
                actionCell.appendChild(editBtn);

                // Delete button
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.onclick = () => deleteProduct(product.id, newRow);
                actionCell.appendChild(deleteBtn);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
}

// Add new product (POST)
form.addEventListener('submit', function (e) {
    e.preventDefault();

    var productData = {
        name: document.getElementById('name').value,
        batchCode: document.getElementById('batchCode').value,
        expiryDate: document.getElementById('expiryDate').value,
        mrp: document.getElementById('mrp').value,
        dpvalue: document.getElementById('dpvalue').value,
        quantity: document.getElementById('quantity').value
    };

    if (isEditing && currentRow) {
        // Update existing product (PUT)
        fetch(`http://77.37.45.2:1000/api/v1/product/updateproduct/${currentRow.dataset.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        })
        .then(response => response.json())
        .then(data => {
            // Update the row with new data
            currentRow.cells[0].textContent = data.name;
            currentRow.cells[1].textContent = data.batchCode;
            currentRow.cells[2].textContent = data.expiryDate;
            currentRow.cells[3].textContent = data.mrp;
            currentRow.cells[4].textContent = data.dpvalue;
            currentRow.cells[5].textContent = data.quantity;
            isEditing = false;
            actionBtn.textContent = 'Submit';
        })
        .catch(error => console.error('Error updating product:', error));
    } else {
        // Add new product (POST)
        fetch('http://77.37.45.2:1000/api/v1/product/saveproduct', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        })
        .then(response => response.json())
        .then(data => {
            // Add new row to the table
            const newRow = productTable.insertRow();

            newRow.insertCell(0).textContent = data.name;
            newRow.insertCell(1).textContent = data.batchCode;
            newRow.insertCell(2).textContent = data.expiryDate;
            newRow.insertCell(3).textContent = data.mrp;
            newRow.insertCell(4).textContent = data.dpvalue;
            newRow.insertCell(5).textContent = data.quantity;

            // Add Edit and Delete buttons
            const actionCell = newRow.insertCell(6);

            // Edit button
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.onclick = () => editProduct(newRow, data.id);
            actionCell.appendChild(editBtn);

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => deleteProduct(data.id, newRow);
            actionCell.appendChild(deleteBtn);
        })
        .catch(error => console.error('Error adding product:', error));
    }

    form.reset();
});

// Edit product
function editProduct(row, id) {
    isEditing = true;
    currentRow = row;
    currentRow.dataset.id = id; // Store the product ID in the row

    document.getElementById('name').value = row.cells[0].textContent;
    document.getElementById('batchCode').value = row.cells[1].textContent;
    document.getElementById('expiryDate').value = row.cells[2].textContent;
    document.getElementById('mrp').value = row.cells[3].textContent;
    document.getElementById('dpvalue').value = row.cells[4].textContent;
    document.getElementById('quantity').value = row.cells[5].textContent;

    actionBtn.textContent = 'Update';
}

// Delete product (DELETE)
function deleteProduct(id, row) {
    if (confirm('Are you sure you want to delete this product?')) {
        fetch(`http://77.37.45.2:1000/api/v1/product/deleteproduct/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            row.remove();
        })
        .catch(error => console.error('Error deleting product:', error));
    }
}

// Fetch products on page load
window.onload = fetchProducts;
