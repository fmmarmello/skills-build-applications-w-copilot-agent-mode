import { BrowserRouter as Router, NavLink, Route, Routes } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/users', label: 'Students' },
    { path: '/activities', label: 'Activities' },
    { path: '/teams', label: 'Teams' },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/workouts', label: 'Workouts' },
  ];

  return (
    <Router>
      <div className="app-shell">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
          <div className="container-fluid">
            <div className="navbar-brand d-flex align-items-center gap-3">
              <img
                src="/octofitapp-small.png"
                alt="OctoFit Tracker"
                className="brand-logo"
              />
              <span>OctoFit Tracker</span>
            </div>
            <div className="navbar-nav ms-auto flex-row flex-wrap gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `nav-link px-3 rounded ${isActive ? 'active bg-white text-primary' : 'text-white'}`}
                  end={item.path === '/'}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        <main className="container py-4">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/users" element={<Users />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/workouts" element={<Workouts />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Overview() {
  return (
    <div className="row g-4">
      <div className="col-lg-6">
        <div className="panel-card h-100">
          <h2 className="mb-3">School fitness overview</h2>
          <p className="lead">
            Track healthy habits, team momentum, and active challenges across Mergington High.
          </p>
          <div className="d-grid gap-2">
            <div className="alert alert-success mb-0">Weekly challenge: log 3 active sessions.</div>
            <div className="alert alert-info mb-0">Team goal: reach 3000 total activity points.</div>
          </div>
        </div>
      </div>
      <div className="col-lg-6">
        <Leaderboard />
      </div>
      <div className="col-lg-12">
        <Activities />
      </div>
    </div>
  );
}

export default App;
