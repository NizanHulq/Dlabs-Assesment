import React from "react";

const UserTable = ({ users, onEdit, onDelete }) => {
    return (
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Umur</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", color: "red" }}>
                    Belum ada data
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.nama}</td>
                    <td>{user.email}</td>
                    <td>{user.umur}</td>
                    <td
                      className={`status-${user.status
                        .toLowerCase()
                        .replace(" ", "")}`}
                    >
                      {user.status}
                    </td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => onEdit(user.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => onDelete(user.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
};

export default UserTable;
