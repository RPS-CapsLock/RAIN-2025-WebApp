import { useState } from 'react';

function AddDrink() {
  const [name, setName] = useState('');
  const [type, setType] = useState('alcoholic');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newDrink = { name, type, image, price: parseFloat(price) };

    fetch('http://localhost:3001/drinks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDrink)
    })
    .then(res => res.json())
    .then(data => {
      alert('Pijača uspešno dodana!');
      setName('');
      setType('alcoholic');
      setImage('');
      setPrice('');
    })
    .catch(err => console.error('Napaka pri dodajanju pijače:', err));
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center" style={{ color: '#FF7A00' }}>Dodaj novo pijačo</h2>
      <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '600px' }}>
        <div className="mb-3">
          <label className="form-label">Ime</label>
          <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Tip</label>
          <select className="form-select" value={type} onChange={e => setType(e.target.value)}>
            <option value="alcoholic">Alkoholna</option>
            <option value="non-alcoholic">Brezalkoholna</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">URL slike</label>
          <input type="text" className="form-control" value={image} onChange={e => setImage(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Cena (€)</label>
          <input type="number" step="0.01" className="form-control" value={price} onChange={e => setPrice(e.target.value)} required />
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-warning">Dodaj pijačo</button>
        </div>
      </form>
    </div>
  );
}

export default AddDrink;
