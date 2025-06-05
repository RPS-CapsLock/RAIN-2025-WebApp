import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate, useNavigate } from 'react-router-dom';

function Profile() {
  const userContext = useContext(UserContext); 
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      const res = await fetch("http://localhost:3001/users/profile", { credentials: "include" });
      const data = await res.json();
      setProfile(data);
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
                <div className="d-flex justify-content-between">
                  <span className="fw-bold">Email:</span>
                  <span>{profile.email}</span>
                </div>
              </div>
              <div className="d-grid">
                <button className="btn btn-warning btn-lg" onClick={handleLogout}>Odjava</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;