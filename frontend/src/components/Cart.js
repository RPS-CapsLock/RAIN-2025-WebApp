import { useEffect, useState, useContext } from "react";
import { UserContext } from "../userContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { user } = useContext(UserContext);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:3001/cart/${user._id}`)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error("Napaka pri pridobivanju košarice:", err));
  }, [user]);

  const removeItem = (itemId) => {
    fetch(`http://localhost:3001/cart/item/${itemId}`, {
    method: "DELETE",
    })
      .then(res => res.json())
      .then(() => {
        setItems(items.filter(i => i._id !== itemId));
      })
      .catch(err => console.error("Napaka pri brisanju:", err));
  };

  const skupnaCena = items.reduce((sum, item) => sum + item.cocktail.price * item.quantity, 0);

  if (!user) {
    return <div className="container py-5">Najprej se prijavite za ogled košarice.</div>;
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4" style={{ color: "#FF7A00" }}>Moja košarica</h2>

      {items.length === 0 ? (
        <p>Košarica je prazna.</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table align-middle table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Slika</th>
                  <th>Ime</th>
                  <th>Cena</th>
                  <th>Količina</th>
                  <th>Skupaj</th>
                  <th>Odstrani</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item._id}>
                    <td style={{ width: '100px' }}>
                      <img src={item.cocktail.image} alt={item.cocktail.name} className="img-fluid rounded" style={{ maxHeight: '80px' }} />
                    </td>
                    <td>{item.cocktail.name}</td>
                    <td>{item.cocktail.price.toFixed(2)} €</td>
                    <td>{item.quantity}</td>
                    <td>{(item.cocktail.price * item.quantity).toFixed(2)} €</td>
                    <td>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(item._id)}>
                        Odstrani
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <h5>Skupna cena: <strong>{skupnaCena.toFixed(2)} €</strong></h5>
            <button className="btn btn-success" onClick={() => navigate("/checkout")}>
              Nadaljuj na plačilo
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
