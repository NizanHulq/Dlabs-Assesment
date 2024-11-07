import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import UserTable from "./components/UserTable";
import UserForm from "./components/UserForm";
import EditModal from "./components/EditModal";
import "./style.css";
import GitHubUsers from "./components/GithubTable";

const App = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const addUser = (user) => setUsers([...users, user]);

  const deleteUser = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
  };

  const openEditModal = (userId) => {
    const userToEdit = users.find((user) => user.id === userId);
    setEditUser(userToEdit);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditUser(null);
    setIsEditModalOpen(false);
  };

  const handleEditSubmit = (updatedData) => {
    setUsers(
      users.map((user) =>
        user.id === editUser.id ? { ...editUser, ...updatedData } : user
      )
    );
    closeEditModal();
  };

  return (
    <div>
      <Header title="Data Keanggotaan" />
      <UserTable users={users} onDelete={deleteUser} onEdit={openEditModal} />
      <UserForm onSubmit={addUser} />
      {isEditModalOpen && (
        <EditModal
          user={editUser}
          onClose={closeEditModal}
          onSubmit={handleEditSubmit}
        />
      )}
      <GitHubUsers/>
    </div>
  );
};

export default App;
