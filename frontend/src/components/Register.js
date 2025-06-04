import { useState } from 'react';

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

    async function Register(e){
        e.preventDefault();
        const res = await fetch("http://localhost:3001/users", {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                username: username,
                password: password,
                _2FA: false
            })
        });
        const data = await res.json();
        if(data._id !== undefined){
            window.location.href="/";
        }
        else{
            setUsername("");
            setPassword("");
            setEmail("");
            setError("Registration failed");
        }
    }
  }

  return (
    <div className="container py-5" style={{ minHeight: "80vh" }}>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h3 className="text-center mb-4" style={{ color: "#FF7A00" }}>Registracija</h3>
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Vnesi email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
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
              <div className="mb-3">
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
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="d-grid">
                <button type="submit" className="btn btn-warning btn-lg">Registracija</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
