import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';

function Dashboard() {
  const { user } = useContext(UserContext);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/users/mylogs', {
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

  function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - day);
    return d;
  }

  function getWeeklyData(logs) {
    const startOfWeek = getStartOfWeek(new Date());
    const counts = Array(7).fill(0);

    logs.forEach(log => {
      const logDate = new Date(log.dateTime);
      if (logDate >= startOfWeek) {
        const diffDays = Math.floor((logDate - startOfWeek) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays < 7) {
          counts[diffDays]++;
        }
      }
    });

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return counts.map((count, index) => ({
      day: dayNames[index],
      count,
    }));
  }

  const weeklyData = getWeeklyData(logs);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/2 bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Login Logs</h3>
        {logs.length > 0 ? (
          <table className="w-full text-left table-auto border-collapse">
            <thead>
              <tr>
                <th className="border-b border-gray-600 pb-2">#</th>
                <th className="border-b border-gray-600 pb-2">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-700">
                  <td className="py-2">{index + 1}</td>
                  <td className="py-2">{new Date(log.dateTime).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No logs available.</p>
        )}
      </div>

      <div className="md:w-1/2 bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        <p>Welcome, {user?.username || 'Owner'}! This is your dashboard.</p>
      </div>
    </div>
  );
}

export default Dashboard;