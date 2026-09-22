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

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const url = getApiUrl('leaderboard');
    console.log('Fetching leaderboard from', url);

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed with ${response.status}`);
        return response.json();
      })
      .then((data) => {
        const records = normalizeRecords(data);
        console.log('Leaderboard payload:', data);
        setLeaders(records);
      })
      .catch((err) => {
        console.error('Leaderboard fetch error:', err);
        setError('Unable to load leaderboard at the moment.');
      });
  }, []);

  return (
    <div className="panel-card">
      <div className="section-header">
        <h2>Leaderboard</h2>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Student</th>
              <th>Total points</th>
            </tr>
          </thead>
          <tbody>
            {leaders.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center text-muted">
                  No leaderboard results yet.
                </td>
              </tr>
            ) : (
              leaders.map((entry, index) => (
                <tr key={entry.id || entry.username || index}>
                  <td>#{index + 1}</td>
                  <td>{entry.username || 'Unknown student'}</td>
                  <td>{entry.total_points || 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
