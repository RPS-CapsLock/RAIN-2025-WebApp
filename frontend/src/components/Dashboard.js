import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';

function Dashboard() {
  const { user } = useContext(UserContext);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('/users/mylogs', {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch logs');
        return res.json();
      })
      .then(data => setLogs(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <p>Welcome, Owner! This is your dashboard.</p>
    </div>
  );
}

export default Dashboard;