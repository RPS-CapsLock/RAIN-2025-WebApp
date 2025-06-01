import { useEffect, useState } from 'react';

function AddCocktail() {
  const [drinks, setDrinks] = useState([]);
  const [name, setName] = useState('');
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/drinks')
      .then(res => res.json())
      .then(data => setDrinks(Array.isArray(data) ? data : data.drinks || []));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCocktail = {
      name,
      ingredients: selectedDrinks,
      image,
      price: parseFloat(price),
      custom: false
    };

    fetch('http://localhost:3001/cocktails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCocktail)
    })
    .then(res => res.json())
    .then(data => {
      alert('Koktejl uspešno dodan!');
      setName('');
      setSelectedDrinks([]);
      setImage('');
      setPrice('');
    })
    .catch(err => console.error('Napaka pri dodajanju koktejla:', err));
  };

  const toggleDrink = (id) => {
    setSelectedDrinks(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center" style={{ color: '#FF7A00' }}>Dodaj nov koktejl</h2>
      <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '600px' }}>
        <div className="mb-3">
          <label className="form-label">Ime</label>
          <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Izberi sestavine</label>
          {drinks.map(drink => (
            <div key={drink._id} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value={drink._id}
                checked={selectedDrinks.includes(drink._id)}
                onChange={() => toggleDrink(drink._id)}
              />
              <label className="form-check-label">
                {drink.name} ({drink.type}) - {drink.price}€
              </label>
            </div>
          ))}
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
          <button type="submit" className="btn btn-warning">Dodaj koktejl</button>
        </div>
      </form>
    </div>
  );
}

export default AddCocktail;
