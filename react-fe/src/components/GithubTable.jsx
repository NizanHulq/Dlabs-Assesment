import React, { useState, useEffect } from "react";

// Komponen utama untuk menampilkan data pengguna GitHub
const GitHubUsers = () => {
  // State untuk menyimpan data pengguna
  const [users, setUsers] = useState([]);

  // Mengambil data dari API menggunakan fetch
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Mengambil data dari GitHub API
   * @returns {void}
   */
  const fetchData = async () => {
    const url = "https://api.github.com/users";
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setUsers(data); // Menyimpan data pengguna ke state
      } else {
        console.error("Failed to fetch data from API");
        alert("Failed to fetch data from API");
      }
    } catch (error) {
      console.error("Network error occurred while fetching data", error);
      alert("Network error occurred while fetching data");
    }
  };

  /**
   * Render tabel dengan data pengguna
   * @param {array} users - Array data pengguna GitHub
   * @returns {JSX.Element}
   */
  const renderTable = (users) => {
    return users.map((user, index) => (
      <tr key={index}>
        <td>{user.login}</td>
        <td>{user.html_url}</td>
        <td>{user.type}</td>
        <td>
          <a href={user.html_url} target="_blank" rel="noopener noreferrer">
            View Profile
          </a>
        </td>
      </tr>
    ));
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Data Pengguna GitHub</h1>
      </header>
      <main className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>URL Profil</th>
                <th>Type User</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>{renderTable(users)}</tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default GitHubUsers;
