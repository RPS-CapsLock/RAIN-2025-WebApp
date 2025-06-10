import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../userContext';

function CocktailSelection() {
  const [cocktails, setCocktails] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetch('http://localhost:3001/cocktails')
      .then(res => res.json())
      .then(data => setCocktails(data))
      .catch(err => console.error("Napaka pri pridobivanju koktajlov:", err));
  }, []);

  const addToCart = (cocktailId) => {
    if (!user) {
      alert("Najprej se prijavite.");
      return;
    }

    fetch('http://localhost:3001/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id, cocktailId })
    })
      .then(res => res.json())
      .then(data => {
        alert('Koktejl uspešno dodan v košarico!');
      })
      .catch(err => console.error('Napaka pri dodajanju v košarico:', err));
  };

  const goToCreateCocktail = () => {
    navigate('/create-cocktail');
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: '#FF7A00' }}>Izberi koktejl</h2>
        <button 
          className="btn btn-outline-warning" 
          onClick={goToCreateCocktail}
          style={{ fontWeight: "600" }}
        >
          ➕ Ustvari svoj koktejl
        </button>
      </div>
      <div className="row g-4">
        {cocktails.map((cocktail) => (
          <div className="col-md-4" key={cocktail._id}>
            <div className="card shadow h-100">
              <img src={cocktail.image} className="card-img-top" alt={cocktail.name} style={{ height: '250px', objectFit: 'cover' }} />
              <div className="card-body">
                <h5 className="card-title">{cocktail.name}</h5>
                <p className="card-text">
                  {cocktail.ingredients.map(i => i.name).join(', ')}
                </p>
                <p className="card-text fw-bold">{cocktail.price.toFixed(2)} €</p>
                <button className="btn btn-warning" onClick={() => addToCart(cocktail._id)}>
                  Dodaj v košarico
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CocktailSelection;
