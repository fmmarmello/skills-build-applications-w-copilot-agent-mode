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

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const url = getApiUrl('users');
    console.log('Fetching users from', url);

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed with ${response.status}`);
        return response.json();
      })
      .then((data) => {
        const records = normalizeRecords(data);
        console.log('Users payload:', data);
        setUsers(records);
      })
      .catch((err) => {
        console.error('Users fetch error:', err);
        setError('Unable to load users right now.');
      });
  }, []);

  return (
    <div className="panel-card">
      <div className="section-header">
        <h2>Students</h2>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Fitness level</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No users available.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id || user.username}>
                  <td>{user.username}</td>
                  <td>{`${user.first_name || ''} ${user.last_name || ''}`.trim() || '—'}</td>
                  <td>{user.fitness_level || 'Not set'}</td>
                  <td>{user.email || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
