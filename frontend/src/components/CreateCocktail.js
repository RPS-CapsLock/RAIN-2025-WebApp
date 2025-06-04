import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateCocktail() {
  const [drinks, setDrinks] = useState([]);
  const [alcohol, setAlcohol] = useState('');
  const [nonAlcohol, setNonAlcohol] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/drinks')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDrinks(data);
        }
        else if (data.drinks && Array.isArray(data.drinks)) {
          setDrinks(data.drinks);
        } else {
          console.error('Napaka pri strukturi podatkov:', data);
        }
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const handleSubmit = () => {
    if (!alcohol || !nonAlcohol) {
      alert('Izberi alkoholno in brezalkoholno pijačo!');
      return;
    }

    const alcoholDrink = drinks.find(d => d._id === alcohol);
    const nonAlcoholDrink = drinks.find(d => d._id === nonAlcohol);

    const price = parseFloat(alcoholDrink.price) + parseFloat(nonAlcoholDrink.price);

    const newCocktail = {
      name: `${alcoholDrink.name} & ${nonAlcoholDrink.name}`,
      ingredients: [alcoholDrink._id, nonAlcoholDrink._id],
      image: '/images/custom-cocktail.png',
      price: price,
      custom: true
    };

    fetch('http://localhost:3001/cocktails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCocktail)
    })
    .then(res => res.json())
    .then(data => {
      alert('Koktejl uspešno ustvarjen!');
      navigate('/cocktails');
    })
    .catch(err => console.error('Napaka pri ustvarjanju koktejla:', err));
  };

  return (
    <div className="container py-5">
      <h2 className="mb-5 text-center" style={{ color: '#FF7A00' }}>Sestavi svoj koktejl</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="mb-4">
            <label className="form-label">Izberi alkoholno pijačo:</label>
            <select className="form-select" value={alcohol} onChange={(e) => setAlcohol(e.target.value)}>
              <option value="">-- izberi --</option>
              {drinks
                .filter(d => d.type === 'alcoholic')
                .map(d => (
                  <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="form-label">Izberi brezalkoholno pijačo:</label>
            <select className="form-select" value={nonAlcohol} onChange={(e) => setNonAlcohol(e.target.value)}>
              <option value="">-- izberi --</option>
              {drinks
                .filter(d => d.type === 'non-alcoholic')
                .map(d => (
                  <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div className="text-center">
            <button className="btn btn-warning btn-lg" onClick={handleSubmit}>Sestavi koktejl</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCocktail;
