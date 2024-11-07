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

/**
 * Gets users data from localStorage
 * @returns {User[]} Array of users
 */
function getUsersFromLocalStorage() {
  // Parse the JSON string from localStorage; return an empty array if no data exists
  const usersData = localStorage.getItem("users");
  return usersData ? JSON.parse(usersData) : [];
}

/**
 * Saves the users data to localStorage
 * @param {User[]} users - Array of users to save
 */
function saveUsersToLocalStorage(users) {
  // Convert the array of users to a JSON string and store it in localStorage
  localStorage.setItem("users", JSON.stringify(users));
}

// Initialize users array from localStorage
let users = getUsersFromLocalStorage();

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
  const tbody = document.getElementById("data-pengguna");
  if (!tbody) throw new Error("Table body element not found");

  tbody.innerHTML = "";
  if (data.length === 0) tbody.innerHTML = "<tr><td style='text-align:center;' colspan='5'><p style='color:red'>Belum ada data</p></td></tr>";
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
 * Checks if the provided age is a positive integer
 * @param {number} age - Age to validate
 * @returns {boolean} True if age is a positive integer
 */
function isValidAge(age) {
  return Number.isInteger(age) && age > 0;
}

/**
 * Generates a unique ID for new users
 * @returns {number} New unique ID
 */
function generateUserId() {
  return Math.max(...users.map((user) => user.id), 0) + 1;
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
    nama: formData.get("nama").trim(),
    email: formData.get("email").trim(),
    umur: parseInt(formData.get("umur")),
    status: formData.get("status"),
  };

  // Error elements
  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const ageError = document.getElementById("ageError");

  // Validation checks
  let isValid = true;

  // Validate name (cannot be empty)
  if (!newUser.nama) {
    nameError.textContent = "Nama tidak boleh kosong";
    nameError.style.display = "block";
    isValid = false;
  } else {
    nameError.style.display = "none";
  }

  // Validate email format
  if (!isValidEmail(newUser.email)) {
    emailError.textContent = "Format email tidak valid";
    emailError.style.display = "block";
    isValid = false;
  } else {
    emailError.style.display = "none";
  }

  // Validate age (must be a positive integer)
  if (!isValidAge(newUser.umur)) {
    ageError.textContent = "Umur harus berupa angka positif";
    ageError.style.display = "block";
    isValid = false;
  } else {
    ageError.style.display = "none";
  }

  // If validation fails, stop submission
  if (!isValid) return;

  // Add new user to array
  users.push(newUser);

  // Save updated users array to localStorage
  saveUsersToLocalStorage(users);

  // Update table
  renderTable(users);

  // Reset form
  event.target.reset();

  // Show success message (optional)
  alert("Data pengguna berhasil ditambahkan!");
}

/**
 * Initialize form functionality
 * Should be called after DOM is loaded
 */
function initializeForm() {
  const form = document.getElementById("userForm");
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }
}

/**
 * Opens the edit modal and populates form with user data
 * @param {number} userId - ID of user to edit
 */
function openEditModal(userId) {
  const user = users.find((u) => u.id === userId);
  if (!user) return;

  // Populate form fields
  document.getElementById("editId").value = user.id;
  document.getElementById("editNama").value = user.nama;
  document.getElementById("editEmail").value = user.email;
  document.getElementById("editUmur").value = user.umur;
  document.getElementById("editStatus").value = user.status;

  // Show modal
  document.getElementById("editModal").style.display = "block";
}

/**
 * Closes the edit modal
 */
function closeModal() {
  document.getElementById("editModal").style.display = "none";
  document.getElementById("editEmailError").style.display = "none";
}

/**
 * Handles the edit form submission
 * @param {Event} event - Form submission event
 */
function handleEditFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const userId = parseInt(formData.get("id"));
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) return;

  // Validate email
  const newName = formData.get("nama").trim();
  const newEmail = formData.get("email").trim();
  const newAge = parseInt(formData.get("umur"));

  // Error elements
  const nameError = document.getElementById("editNameError");
  const emailError = document.getElementById("editEmailError");
  const ageError = document.getElementById("editAgeError");

  // Validation checks
  let isValid = true;

  // Validate name (cannot be empty)
  if (!newName) {
    nameError.textContent = "Nama tidak boleh kosong";
    nameError.style.display = "block";
    isValid = false;
  } else {
    nameError.style.display = "none";
  }

  // Validate email format
  if (!isValidEmail(newEmail)) {
    emailError.textContent = "Format email tidak valid";
    emailError.style.display = "block";
    isValid = false;
  } else {
    emailError.style.display = "none";
  }

  // Validate age (must be a positive integer)
  if (!isValidAge(newAge)) {
    ageError.textContent = "Umur harus berupa angka positif";
    ageError.style.display = "block";
    isValid = false;
  } else {
    ageError.style.display = "none";
  }

  // If validation fails, stop submission
  if (!isValid) return;

  // Update user data
  users[userIndex] = {
    id: userId,
    nama: formData.get("nama"),
    email: newEmail,
    umur: parseInt(formData.get("umur")),
    status: formData.get("status"),
  };

  // Save updated users array to localStorage
  saveUsersToLocalStorage(users);

  // Update table and close modal
  renderTable(users);
  closeModal();
  alert("Data pengguna berhasil diperbarui!");
}

/**
 * Deletes a user after confirmation
 * @param {number} userId - ID of user to delete
 */
function deleteUser(userId) {
  if (!confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) return;

  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex === -1) return;

  users.splice(userIndex, 1);

  // Save updated users array to localStorage
  saveUsersToLocalStorage(users);

  renderTable(users);
  alert("Data pengguna berhasil dihapus!");
}

//

/**
 * Fetch data from Public API using AJAX XHR
 * @returns {void}
 */
function fetchData() {
  const xhr = new XMLHttpRequest();
  const url = "https://api.github.com/users";

  xhr.open("GET", url, true);

  // Define callback for handle fetch data
  xhr.onload = function () {
    if (xhr.status === 200) {
      // Parse response from JSON to JavaScript object
      const users = JSON.parse(xhr.responseText);

      renderTableGithub(users);
    } else {
      console.error("Failed to fetch data from API");
      alert("Failed to fetch data from API");
    }
  };

  // error handling
  xhr.onerror = function () {
    console.error("Network error occurred while fetching data");
    alert("Network error occurred while fetching data");
  };

  xhr.send();
}

/**
 * Create Table Row with action button
  @param {object} users - User github data to display
 * @returns {void}
 */
function renderTableGithub(users) {
  const tableBody = document.getElementById("user-data");
  tableBody.innerHTML = ""; // Kosongkan tabel sebelum render data baru

  users.forEach((user) => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = user.login;
    row.appendChild(nameCell);

    const urlCell = document.createElement("td");
    urlCell.textContent = user.html_url;
    row.appendChild(urlCell);

    const typeCell = document.createElement("td");
    typeCell.textContent = user.type;
    row.appendChild(typeCell);

    const actionCell = document.createElement("td");
    const link = document.createElement("a");
    link.href = user.html_url;
    link.textContent = "View Profile";
    link.target = "_blank";
    actionCell.appendChild(link);
    row.appendChild(actionCell);

    tableBody.appendChild(row);
  });
}

// initialization function
function initializeApp() {
  document.addEventListener("DOMContentLoaded", () => {
    try {
      renderTable(users);
      initializeForm();
      fetchData();
      

      // Initialize edit form handler
      const editForm = document.getElementById("editForm");
      if (editForm) {
        editForm.addEventListener("submit", handleEditFormSubmit);
      }

      // Close modal when clicking outside
      window.addEventListener("click", (event) => {
        const modal = document.getElementById("editModal");
        if (event.target === modal) {
          closeModal();
        }
      });

      // Set up error boundary
      window.addEventListener("error", (event) => {
        console.error("Global error caught:", event.error);
      });
    } catch (error) {
      console.error("Initialization failed:", error);
    }
  });
}

// Initialize the application
initializeApp();

