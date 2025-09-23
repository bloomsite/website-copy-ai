import React, { useState } from "react";
import { useUsers } from "../../../hooks/Users/useUsers";
import "./UsersOverview.css";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 50;

const UsersOverview: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [includeAdmins, setIncludeAdmins] = useState(true);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  const handleNavigate = (userId: string) => {
    navigate(`/admin/users/${userId}`);
  };

  // Build filter options
  const filterOptions: any = {
    first_name: firstName || undefined,
    last_name: lastName || undefined,
    email: email || undefined,
    role: includeAdmins ? undefined : "client",
  };

  const { users, loading, error } = useUsers(filterOptions);

  // Pagination logic
  const paginatedUsers = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(users.length / PAGE_SIZE);

  return (
    <div className="users-overview-container">
      <h2 className="users-overview-title">Gebruikers Overzicht</h2>
      <div className="users-filters">
        <input
          type="text"
          placeholder="Voornaam"
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
            setPage(1);
          }}
        />
        <input
          type="text"
          placeholder="Achternaam"
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
            setPage(1);
          }}
        />
        <input
          type="text"
          placeholder="E-mail"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setPage(1);
          }}
        />
        <div className="chip-container">
          <span
            className={`chip${includeAdmins ? " active" : ""}`}
            onClick={() => {
              setIncludeAdmins(!includeAdmins);
              setPage(1);
            }}
            role="button"
            tabIndex={0}
          >
            Inclusief Admins
          </span>
        </div>
      </div>
      {loading && <div className="users-loading">Loading users...</div>}
      {error && <div className="users-error">{error}</div>}
      <table className="users-table">
        <thead>
          <tr>
            <th>Voornaam</th>
            <th>Achternaam</th>
            <th>Email</th>
            <th>Profiel</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.email}</td>
              <td className="actions-cell">
                <button
                  className="profile-button"
                  onClick={() => handleNavigate(user.id)}
                >
                  Profiel bekijken
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="users-pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Vorige
        </button>
        <span>
          Pagina {page} van {totalPages || 1}
        </span>
        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
        >
          Volgende
        </button>
      </div>
    </div>
  );
};

export default UsersOverview;
