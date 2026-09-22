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

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const url = getApiUrl('workout-suggestions');
    console.log('Fetching workout suggestions from', url);

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed with ${response.status}`);
        return response.json();
      })
      .then((data) => {
        const records = normalizeRecords(data);
        console.log('Workouts payload:', data);
        setWorkouts(records);
      })
      .catch((err) => {
        console.error('Workouts fetch error:', err);
        setError('Unable to load workout suggestions right now.');
      });
  }, []);

  return (
    <div className="panel-card">
      <div className="section-header">
        <h2>Workout suggestions</h2>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Difficulty</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {workouts.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No workout suggestions available.
                </td>
              </tr>
            ) : (
              workouts.map((workout) => (
                <tr key={workout.id || workout.title}>
                  <td>{workout.title}</td>
                  <td>{workout.activity_type || 'General'}</td>
                  <td>{workout.difficulty || 'Beginner'}</td>
                  <td>{workout.duration_minutes || 0} min</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
