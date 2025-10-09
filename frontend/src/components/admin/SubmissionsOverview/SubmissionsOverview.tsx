import React, { useEffect, useState } from "react";
import { useFromSubmissions } from "../../../hooks/Forms/useFormSubmissions";
import "./SubmissionsOverview.css";

const PAGE_SIZE = 20;

const SubmissionsOverview: React.FC = () => {
  const [formName, setFormName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [page, setPage] = useState(1);
  const { loading, error, submissions, fetchSubmissions } =
    useFromSubmissions();

  // Filter submissions based on search criteria
  const filteredSubmissions = submissions.filter((submission) => {
    const matchesFormName =
      formName === "" ||
      submission.formName.toLowerCase().includes(formName.toLowerCase());
    const matchesFirstName =
      firstName === "" ||
      submission.firstName.toLowerCase().includes(firstName.toLowerCase());
    const matchesLastName =
      lastName === "" ||
      submission.lastName.toLowerCase().includes(lastName.toLowerCase());
    const matchesEmail =
      email === "" ||
      submission.email.toLowerCase().includes(email.toLowerCase());

    return (
      matchesFormName && matchesFirstName && matchesLastName && matchesEmail
    );
  });

  const paginatedSubmissions = filteredSubmissions.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );
  const totalPages = Math.ceil(filteredSubmissions.length / PAGE_SIZE);

  const handleNavigate = () => {};

  useEffect(() => {
    fetchSubmissions();
  }, []);
  return (
    <div className="submissions-overview-container">
      <h2 className="submissions-overview-title"> Inzendingen</h2>
      <div className="submissions-filters">
        <input
          type="text"
          placeholder="Formulier naam"
          value={formName}
          onChange={(e) => {
            setFormName(e.target.value);
            setPage(1);
          }}
        />
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
      </div>
      {loading && (
        <div className="submissions-loading">Loading submissions...</div>
      )}
      {error && <div className="submissions-error">{error.message}</div>}
      <table className="submissions-table">
        <thead>
          <tr>
            <th>Formulier</th>
            <th>Voornaam</th>
            <th>Achternaam</th>
            <th>Email</th>
            <th>Profiel</th>
          </tr>
        </thead>
        <tbody>
          {paginatedSubmissions.map((submission) => (
            <tr key={submission.id}>
              <td>{submission.formName}</td>
              <td>{submission.firstName}</td>
              <td>{submission.lastName}</td>
              <td>{submission.email}</td>
              <td className="actions-cell">
                <button
                  className="profile-button"
                  onClick={() => handleNavigate()}
                >
                  Profiel bekijken
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="submissions-pagination">
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

export default SubmissionsOverview;
