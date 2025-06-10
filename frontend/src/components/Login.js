import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom'; 

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [requestId, setRequestId] = useState(null); // 🆕 za sledenje Face ID prijave
  const userContext = useContext(UserContext);

  // Prijava z geslom
  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch("http://localhost:3001/users/login", {
      method: "POST",
      credentials: "include",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        password: password,
        _2FA: false
      })
    });
    const data = await res.json();
    if (data._id !== undefined) {
      if (data._id === "0000000000"){
        
      }
      else{
        userContext.setUserContext(data);
      }
    } else {
      setUsername("");
      setPassword("");
      setError("Invalid username or password");
    }
  }

  // Prijava z Face ID
  async function handleFaceIdLogin() {
    const deviceToken = 'ex5XmaMbQMOuMOM3iLEeOQ:APA91bGsX00lIQ52BvfSyZH0qcixRACBpYRjFqTglXiQRZu8n5cteXsEiLPhvwIUk55X5vLooHaGzGJAAJp_yLFipbEQ8JMzQ8HQwHLqOthjq81Xp1ubqcY';
    const newRequestId = "test-request-id-123";     // Date.now().toString();
    setRequestId(newRequestId); // Shrani za polling

    try {
      const res = await fetch('http://localhost:3001/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceToken: deviceToken,
          requestId: newRequestId
        })
      });

      const result = await res.json();
      console.log(result);
      if (result.success) {
        alert('Push notification za prijavo poslan na napravo!');
      } else {
        alert('Napaka pri pošiljanju Face ID prijave.');
      }
    } catch (error) {
      console.error('Napaka:', error);
    }
  }

  // 🧠 Polling za status potrditve
  useEffect(() => {
    if (!requestId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:3001/faceid/status/${requestId}`);
        const data = await res.json();
        if (data.approved) {
          clearInterval(interval); // Ustavi polling
          alert('Prijava s Face ID je bila odobrena! ✅');
          // Tukaj lahko narediš še login uporabnika ali redirect
          // npr: userContext.setUserContext(userInfo);
        }
      } catch (error) {
        console.error('Napaka pri preverjanju statusa:', error);
      }
    }, 3000); // preveri vsakih 3 sekunde

    return () => clearInterval(interval); // počisti ob unmountu
  }, [requestId, userContext]);

  return (
    <div className="container py-5" style={{ minHeight: "80vh" }}>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h3 className="text-center mb-4" style={{ color: "#FF7A00" }}>Prijava</h3>
            {userContext.user && <Navigate replace to="/profile" />}
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Uporabniško ime</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Vnesi uporabniško ime"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="form-label">Geslo</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Vnesi geslo"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="alert alert-danger mb-3">{error}</div>}
              <div className="d-grid mb-3">
                <button type="submit" className="btn btn-warning btn-lg">Prijava z geslom</button>
              </div>
            </form>
            <div className="text-center text-muted my-3">— ali —</div>
            <div className="d-grid">
              <button className="btn btn-outline-warning btn-lg" onClick={handleFaceIdLogin}>
                Prijava s Face ID
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
