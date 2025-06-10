import { useContext, useEffect, useState } from "react";
import { UserContext } from "../userContext";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const { user } = useContext(UserContext);
  const [paketniki, setPaketniki] = useState([]);
  const [izbrani, setIzbrani] = useState(null);
  const [timer, setTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [zakljuceno, setZakljuceno] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/paketniki")
      .then((res) => res.json())
      .then((data) => {
        const available = data.filter(p => p.status === "available");
        setPaketniki(available);
      })
      .catch((err) => console.error("Napaka pri pridobivanju paketnikov:", err));
  }, []);

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
      <h2 style={{ color: "#FF7A00" }}>Zaključi nakup</h2>

      {!zakljuceno ? (
        <>
          <p>Izberi paketnik za prevzem:</p>
          <select className="form-select mb-3" onChange={(e) => {
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

          {!timerActive ? (
            <button className="btn btn-success" onClick={handlePlacilo}>
              Plačaj
            </button>
          ) : (
            <div className="mt-3">
              <p>Priprava koktajla... ({Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')})</p>
            </div>
          )}
        </>
      ) : (
        <div className="alert alert-success mt-4">
          <h5>Koktejl pripravljen za prevzem! 🥂</h5>
          <p>Prevzemi ga v mobilni aplikaciji.</p>
          <button className="btn btn-warning mt-3" onClick={handleZakljucek}>Nazaj na domov</button>
        </div>
      )}
    </div>
  );
}

export default Checkout;
