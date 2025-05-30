import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';

function Dashboard() {
  const { user } = useContext(UserContext);
  const [logs, setLogs] = useState([]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <p>Welcome, Owner! This is your dashboard.</p>
    </div>
  );
}

export default Dashboard;