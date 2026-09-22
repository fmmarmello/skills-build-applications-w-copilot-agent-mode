import { useEffect, useState } from 'react';

function getApiUrl(path) {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME || process.env.CODESPACE_NAME;
  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev/api/${path}/`;
  }
  return `http://localhost:8000/api/${path}/`;
}

function normalizeRecords(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
}

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const url = getApiUrl('teams');
    console.log('Fetching teams from', url);

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed with ${response.status}`);
        return response.json();
      })
      .then((data) => {
        const records = normalizeRecords(data);
        console.log('Teams payload:', data);
        setTeams(records);
      })
      .catch((err) => {
        console.error('Teams fetch error:', err);
        setError('Unable to load teams right now.');
      });
  }, []);

  return (
    <div className="panel-card">
      <div className="section-header">
        <h2>Teams</h2>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>Name</th>
              <th>Captain</th>
              <th>Members</th>
            </tr>
          </thead>
          <tbody>
            {teams.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center text-muted">
                  No teams have been created.
                </td>
              </tr>
            ) : (
              teams.map((team) => (
                <tr key={team.id || team.name}>
                  <td>{team.name}</td>
                  <td>{team.captain_name || team.captain || 'Unassigned'}</td>
                  <td>{Array.isArray(team.member_ids) ? team.member_ids.length : 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
