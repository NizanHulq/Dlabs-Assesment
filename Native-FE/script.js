/**
 * @fileoverview User Management System
 * This module handles user data display, sorting, filtering, CRUD user data
 * @version 1.0.0
 * @author Nizan Dhiaulhaq
 */

/**
 * @typedef {Object} User
 * @property {number} id - Unique identifier for user
 * @property {string} nama - User's full name
 * @property {string} email - User's email address
 * @property {number} umur - User's age
 * @property {('Aktif'|'Tidak Aktif')} status - User's membership status
 */

/** @type {User[]} */
const users = [
  {
    id: 1,
    nama: "Budi Santoso",
    email: "budi@email.com",
    umur: 25,
    status: "Aktif",
  },
  {
    id: 2,
    nama: "Ani Wijaya",
    email: "ani@email.com",
    umur: 30,
    status: "Tidak Aktif",
  },
  {
    id: 3,
    nama: "Citra Dewi",
    email: "citra@email.com",
    umur: 28,
    status: "Aktif",
  },
  {
    id: 4,
    nama: "Dedi Kurniawan",
    email: "dedi@email.com",
    umur: 35,
    status: "Aktif",
  },
];

// State untuk menyimpan arah sorting
let sortDirection = {
  nama: "asc",
  umur: "asc",
};

/**
 * Create Table Row with action button
  @param {User} user - User data to display
 * @returns {string} HTML string for table row
 */
function createTableRow(user) {
  return `
        <tr>
            <td>${user.nama}</td>
            <td>${user.email}</td>
            <td>${user.umur}</td>
            <td class="status-${user.status.toLowerCase().replace(" ", "")}">${
    user.status
  }</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="openEditModal(${
                      user.id
                    })">
                        Edit
                    </button>
                    <button class="delete-btn" onclick="deleteUser(${user.id})">
                        Hapus
                    </button>
                </div>
            </td>
        </tr>
    `;
}

/**
 * Renders the updated table with action buttons
 * @param {User[]} data - Array of users to display
 */
function renderTable(data) {
  const tbody = document.querySelector("tbody");
  if (!tbody) throw new Error("Table body element not found");

  tbody.innerHTML = "";
  data.forEach((user) => {
    tbody.innerHTML += createTableRow(user);
  });
}

/**
 * Sorts user data based on specified key
 * @param {keyof User} key - The property to sort by
 * @returns {void}
 */
function sortData(key) {
  sortDirection[key] = sortDirection[key] === "asc" ? "desc" : "asc";

  const sortedUsers = [...users].sort((a, b) => {
    if (sortDirection[key] === "asc") {
      return a[key] > b[key] ? 1 : -1;
    } else {
      return a[key] < b[key] ? 1 : -1;
    }
  });

  renderTable(sortedUsers);
}

/**
 * Filters users based on status
 * @param {string} status - Status to filter by ('semua'|'Aktif'|'Tidak Aktif')
 * @returns {void}
 */
function filterByStatus(status) {
  if (status === "semua") {
    renderTable(users);
  } else {
    const filteredUsers = users.filter((user) => user.status === status);
    renderTable(filteredUsers);
  }
}

// Initial render
document.addEventListener("DOMContentLoaded", () => {
  renderTable(users);
});


/**
 * Form handling functionality for adding new users
 * @module userForm
 */

/**
 * Validates email format using regex
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Generates a unique ID for new users
 * @returns {number} New unique ID
 */
function generateUserId() {
    return Math.max(...users.map(user => user.id), 0) + 1;
}

/**
 * Adds a new user to the users array and updates the table
 * @param {Event} event - Form submission event
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const newUser = {
        id: generateUserId(),
        nama: formData.get('nama'),
        email: formData.get('email'),
        umur: parseInt(formData.get('umur')),
        status: formData.get('status')
    };

    // Validate email
    const emailError = document.getElementById('emailError');
    if (!isValidEmail(newUser.email)) {
        emailError.textContent = 'Format email tidak valid';
        emailError.style.display = 'block';
        return;
    } else {
        emailError.style.display = 'none';
    }

    // Add new user to array
    users.push(newUser);
    
    // Update table
    renderTable(users);
    
    // Reset form
    event.target.reset();
    
    // Show success message (optional)
    alert('Data pengguna berhasil ditambahkan!');
}

/**
 * Initialize form functionality
 * Should be called after DOM is loaded
 */
function initializeForm() {
    const form = document.getElementById('userForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

// Update the initializeApp function
function initializeApp() {
    document.addEventListener('DOMContentLoaded', () => {
        try {
            renderTable(users);
            initializeForm();
            
            // Set up error boundary
            window.addEventListener('error', (event) => {
                console.error('Global error caught:', event.error);
            });
        } catch (error) {
            console.error('Initialization failed:', error);
        }
    });
}

// Initialize the application
initializeApp();


/**
 * Opens the edit modal and populates form with user data
 * @param {number} userId - ID of user to edit
 */
function openEditModal(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    // Populate form fields
    document.getElementById('editId').value = user.id;
    document.getElementById('editNama').value = user.nama;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editUmur').value = user.umur;
    document.getElementById('editStatus').value = user.status;

    // Show modal
    document.getElementById('editModal').style.display = 'block';
}

/**
 * Closes the edit modal
 */
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    document.getElementById('editEmailError').style.display = 'none';
}

/**
 * Handles the edit form submission
 * @param {Event} event - Form submission event
 */
function handleEditFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const userId = parseInt(formData.get('id'));
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) return;

    // Validate email
    const newEmail = formData.get('email');
    if (!isValidEmail(newEmail)) {
        document.getElementById('editEmailError').textContent = 'Format email tidak valid';
        document.getElementById('editEmailError').style.display = 'block';
        return;
    }

    // Update user data
    users[userIndex] = {
        id: userId,
        nama: formData.get('nama'),
        email: newEmail,
        umur: parseInt(formData.get('umur')),
        status: formData.get('status')
    };

    // Update table and close modal
    renderTable(users);
    closeModal();
    alert('Data pengguna berhasil diperbarui!');
}

/**
 * Deletes a user after confirmation
 * @param {number} userId - ID of user to delete
 */
function deleteUser(userId) {
    if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) return;
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return;
    
    users.splice(userIndex, 1);
    renderTable(users);
    alert('Data pengguna berhasil dihapus!');
}

// Update initialization function
function initializeApp() {
    document.addEventListener('DOMContentLoaded', () => {
        try {
            renderTable(users);
            initializeForm();
            
            // Initialize edit form handler
            const editForm = document.getElementById('editForm');
            if (editForm) {
                editForm.addEventListener('submit', handleEditFormSubmit);
            }

            // Close modal when clicking outside
            window.addEventListener('click', (event) => {
                const modal = document.getElementById('editModal');
                if (event.target === modal) {
                    closeModal();
                }
            });
            
        } catch (error) {
            console.error('Initialization failed:', error);
        }
    });
}