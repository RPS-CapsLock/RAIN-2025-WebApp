import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [cocktails, setCocktails] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [paketniki, setPaketniki] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('http://localhost:3001/users/mylogs', {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(console.error);

    fetch('http://localhost:3001/cocktails')
      .then(res => res.json())
      .then(setCocktails)
      .catch(console.error);

    fetch('http://localhost:3001/drinks')
      .then(res => res.json())
      .then(setDrinks)
      .catch(console.error);

    fetch('http://localhost:3001/paketniki/my-paketniki', {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(setPaketniki)
      .catch(console.error);
  };

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - day);
    return d;
  };

  const getWeeklyData = (logs) => {
    const startOfWeek = getStartOfWeek(new Date());
    const counts = Array(7).fill(0);
    logs.forEach((log) => {
      const logDate = new Date(log.dateTime);
      if (logDate >= startOfWeek) {
        const diffDays = Math.floor((logDate - startOfWeek) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays < 7) {
          counts[diffDays]++;
        }
      }
    });
    const dayNames = ['Ned', 'Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob'];
    return counts.map((count, index) => ({ day: dayNames[index], count }));
  };

  const weeklyData = getWeeklyData(logs);

  const deleteCocktail = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/cocktails/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteDrink = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/drinks/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const deletePaketnik = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/paketniki/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-3xl font-bold mb-12 text-center text-orange-500">CocktailBox Admin Dashboard</h1>

      {/* Seznam koktejlov */}
      <div className="mb-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-500">Seznam koktejlov</h2>
          <button className="btn btn-warning" onClick={() => navigate('/add-cocktail')}>➕ Dodaj nov koktejl</button>
        </div>
        <table className="table table-striped w-full mb-16">
          <thead>
            <tr><th>Ime</th><th>Cena (€)</th><th>Akcije</th></tr>
          </thead>
          <tbody>
            {cocktails.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.price?.toFixed(2)}</td>
                <td><button className="btn btn-danger btn-sm" onClick={() => deleteCocktail(c._id)}>Briši</button></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Seznam pijač */}
        <div className="flex justify-between items-center mb-6 mt-20">
          <h2 className="text-2xl font-bold text-orange-500">Seznam pijač</h2>
          <button className="btn btn-warning" onClick={() => navigate('/add-drink')}>➕ Dodaj novo pijačo</button>
        </div>
        <table className="table table-striped w-full mb-20">
          <thead>
            <tr><th>Ime</th><th>Tip</th><th>Cena (€)</th><th>Akcije</th></tr>
          </thead>
          <tbody>
            {drinks.map((d) => (
              <tr key={d._id}>
                <td>{d.name}</td>
                <td>{d.type}</td>
                <td>{d.price?.toFixed(2)}</td>
                <td><button className="btn btn-danger btn-sm" onClick={() => deleteDrink(d._id)}>Briši</button></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Seznam paketnikov */}
        <div className="flex justify-between items-center mb-6 mt-20">
          <h2 className="text-2xl font-bold text-orange-500">Seznam paketnikov</h2>
          <button className="btn btn-warning" onClick={() => navigate('/add-paketnik')}>➕ Dodaj nov paketnik</button>
        </div>
        <table className="table table-striped w-full mb-20">
          <thead>
            <tr><th>Številka</th><th>Lokacija</th><th>Status</th><th>Akcije</th></tr>
          </thead>
          <tbody>
            {paketniki.map((p) => (
              <tr key={p._id}>
                <td>{p.number}</td>
                <td>{p.location}</td>
                <td>{p.status}</td>
                <td><button className="btn btn-danger btn-sm" onClick={() => deletePaketnik(p._id)}>Briši</button></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Logi paketnikov */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-orange-500 mb-6">Logi paketnikov</h2>
          {paketniki.length > 0 ? (
            <table className="table table-striped w-full">
              <thead><tr><th>Številka Paketnika</th><th>Datum</th><th>Status</th></tr></thead>
              <tbody>
                {paketniki.flatMap((p) =>
                  p.open_logs.map((log, i) => (
                    <tr key={`${p._id}-${i}`}>
                      <td>{p.number}</td>
                      <td>{new Date(log.dateTime).toLocaleString()}</td>
                      <td style={{ color: log.status === 'failed' ? 'red' : log.status === 'opened' ? 'green' : 'gray' }}>
                        {log.status}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">Ni logov za prikaz.</p>
          )}
        </div>
      </div>

      {/* Prijave in graf */}
      <div className="grid md:grid-cols-2 gap-20">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-8 text-orange-500">Prijave</h2>
          {logs.length > 0 ? (
            <ul className="space-y-3">
              {logs.map((log, i) => (
                <li key={i} className="text-gray-700">{new Date(log.dateTime).toLocaleString()}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Ni podatkov o prijavah.</p>
          )}
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-8 text-orange-500">Logini ta teden</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="day" stroke="#8884d8" />
              <YAxis allowDecimals={false} stroke="#8884d8" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#ccc' }} itemStyle={{ color: '#333' }} />
              <Bar dataKey="count" fill="#FF7A00" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
