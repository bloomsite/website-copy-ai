import { useEffect, useState } from "react";
import { useFromSubmissions } from "../../../hooks/Forms/useFormSubmissions";

const PAGE_SIZE = 20;

const SubmissionsOverview = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [page, setPage] = useState(1);
  const { loading, error, submissions, fetchSubmissions } =
    useFromSubmissions();

  const paginatedSubmissions = submissions.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

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
      {loading && <div className="users-loading">Loading users...</div>}
      {error && <div className="users-error">{error.message}</div>}
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
          {paginatedSubmissions.map((submission) => (
            <tr key={submission.id}>
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
    </div>
  );
};

export default SubmissionsOverview;
