import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate, useNavigate } from 'react-router-dom';

function Profile() {
  const userContext = useContext(UserContext); 
  const [profile, setProfile] = useState({});
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      const res = await fetch("http://localhost:3001/users/profile", { credentials: "include" });
      const data = await res.json();
      setProfile(data);
      setIs2FAEnabled(data._2FA);
    };
    getProfile();
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:3001/users/logout", {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("user");
    userContext.setUserContext(null);
    navigate("/login");
  };

  const toggle2FA = async () => {
    try {
      const res = await fetch("http://localhost:3001/users/c_2fa", {
        method: "GET",
        credentials: "include"
      });
      const data = await res.json();
      setIs2FAEnabled(data._2FA);
    } catch (err) {
      console.error("Error toggling 2FA:", err);
    }
  };

  return (
    <div className="container py-5" style={{ minHeight: "80vh" }}>
      {!userContext.user ? <Navigate replace to="/login" /> : (
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow p-4">
              <h3 className="text-center mb-4" style={{ color: "#FF7A00" }}>Profil uporabnika</h3>
              <div className="text-gray-800 mb-4">
                <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                  <span className="fw-bold">Uporabniško ime:</span>
                  <span>{profile.username}</span>
                </div>
                <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                  <span className="fw-bold">Email:</span>
                  <span>{profile.email}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="fw-bold">2FA status:</span>
                  <span>{is2FAEnabled ? "Omogočeno" : "Onemogočeno"}</span>
                </div>
              </div>
              <div className="d-grid gap-2">
                <button
                  className={`btn btn-lg ${is2FAEnabled ? "btn-warning" : "btn-secondary"}`}
                  onClick={toggle2FA}
                >
                  {is2FAEnabled ? "Onemogoči 2FA" : "Omogoči 2FA"}
                </button>
                <button className="btn btn-warning btn-lg" onClick={handleLogout}>
                  Odjava
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
