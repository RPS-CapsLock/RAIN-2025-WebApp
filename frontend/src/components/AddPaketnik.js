import { useState, useContext } from 'react';
import { UserContext } from '../userContext';
import { useNavigate } from 'react-router-dom';

function AddPaketnik() {
  const { user } = useContext(UserContext);
  const [number, setNumber] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('available'); // default
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user._id) {
      alert('Uporabnik ni prijavljen.');
      return;
    }

    const paketnikData = {
      number: Number(number),
      location: location,
      owner: [user._id],
      status: status
    };

    try {
      const res = await fetch('http://localhost:3001/paketniki', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paketnikData)
      });

      if (res.ok) {
        alert('Paketnik uspešno dodan!');
        navigate('/dashboard'); // vrne te nazaj na dashboard
      } else {
        const errorData = await res.json();
        alert(`Napaka: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Napaka pri dodajanju paketnika:', err);
    }
  };

  return (
    <div className="container py-5" style={{ minHeight: "80vh" }}>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h3 className="text-center mb-4" style={{ color: "#FF7A00" }}>Dodaj Paketnik</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="number" className="form-label">Številka paketnika</label>
                <input
                  type="number"
                  className="form-control"
                  id="number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="location" className="form-label">Lokacija</label>
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="status" className="form-label">Status</label>
                <select
                  id="status"
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="available">Na voljo</option>
                  <option value="occupied">Zaseden</option>
                  <option value="out_of_service">Izven delovanja</option>
                </select>
              </div>
              <div className="d-grid mb-3">
                <button type="submit" className="btn btn-warning btn-lg">Shrani Paketnik</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPaketnik;
