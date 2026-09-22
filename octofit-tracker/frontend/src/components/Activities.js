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

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const url = getApiUrl('activities');
    console.log('Fetching activities from', url);

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed with ${response.status}`);
        return response.json();
      })
      .then((data) => {
        const records = normalizeRecords(data);
        console.log('Activities payload:', data);
        setActivities(records);
      })
      .catch((err) => {
        console.error('Activities fetch error:', err);
        setError('Unable to load activity log right now.');
      });
  }, []);

  return (
    <div className="panel-card">
      <div className="section-header">
        <h2>Activity log</h2>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>Student</th>
              <th>Type</th>
              <th>Duration</th>
              <th>Distance</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {activities.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No activities logged yet.
                </td>
              </tr>
            ) : (
              activities.map((activity) => (
                <tr key={activity.id || `${activity.user_name}-${activity.performed_at}`}>
                  <td>{activity.user_name || activity.user || 'Unknown student'}</td>
                  <td>{activity.activity_type || 'Workout'}</td>
                  <td>{activity.duration_minutes || 0} min</td>
                  <td>{activity.distance_km || 0} km</td>
                  <td>{activity.points || 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
