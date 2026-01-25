import { useContext, useEffect, useState } from "react";
import { UserContext } from "../userContext";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const { user } = useContext(UserContext);
  const [paketniki, setPaketniki] = useState([]);
  const [izbrani, setIzbrani] = useState(null);
  const [items, setItems] = useState([]);
  const [timer, setTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [zakljuceno, setZakljuceno] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:3001/cart/${user._id}`)
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) {
          alert("Košarica je prazna. Preusmerjam nazaj.");
          navigate("/cart");
        } else {
          setItems(data);
        }
      })
      .catch(err => console.error("Napaka pri branju košarice:", err));

    fetch("http://localhost:3001/paketniki")
      .then((res) => res.json())
      .then((data) => {
        const available = data.filter(p => p.status === "available");
        setPaketniki(available);
      })
      .catch((err) => console.error("Napaka pri pridobivanju paketnikov:", err));
  }, [user, navigate]);

  useEffect(() => {
    let interval;
    if (timerActive && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      setZakljuceno(true);
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timer, timerActive]);

  const skupnaCena = items.reduce((sum, item) => sum + item.cocktail.price * item.quantity, 0);

  const handlePlacilo = () => {
    if (!izbrani || !user) {
      alert("Izberite paketnik.");
      return;
    }

    fetch(`http://localhost:3001/paketniki/${izbrani._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "occupied" }),
    }).catch(console.error);

    fetch(`http://localhost:3001/cart/${user._id}`, {
      method: "DELETE",
    }).catch(console.error);

    setTimerActive(true);
  };

  const handleZakljucek = () => {
    if (izbrani) {
      fetch(`http://localhost:3001/paketniki/${izbrani._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "available" }),
      }).catch(console.error);
    }

    navigate("/");
  };

  if (!user) return <div className="container py-5">Prijavite se.</div>;

  return (
    <div className="container py-5">
      <h2 className="text-warning mb-4">Zaključi nakup</h2>

      {!zakljuceno ? (
        <>
          <div className="mb-4">
            <p className="mb-2">Izberi paketnik za prevzem:</p>
            <select className="form-select" onChange={(e) => {
              const selected = paketniki.find(p => p._id === e.target.value);
              setIzbrani(selected);
            }}>
              <option value="">-- Izberi --</option>
              {paketniki.map(p => (
                <option key={p._id} value={p._id}>
                  {p.location} (#{p.number})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <h5>Skupna cena: <strong>{skupnaCena.toFixed(2)} €</strong></h5>
          </div>

          {!timerActive ? (
            <button className="btn btn-success" onClick={handlePlacilo}>
              Plačaj in pripravi koktejl
            </button>
          ) : (
            <div className="mt-4">
              <div className="alert alert-info">
                <strong>Priprava koktajla...</strong><br />
                Čas do prevzema: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="alert alert-success mt-4">
          <h5>Koktejl pripravljen za prevzem! 🥂</h5>
          <p>Prevzemi ga v mobilni aplikaciji ali na terminalu.</p>
          <button className="btn btn-warning mt-3" onClick={handleZakljucek}>Nazaj na domov</button>
        </div>
      )}
    </div>
  );
}

export default Checkout;
