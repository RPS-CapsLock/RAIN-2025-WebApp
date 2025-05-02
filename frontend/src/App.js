import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserContext } from "./userContext";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Logout from "./components/Logout";
import Main from "./components/Main";

function App() {
  const [user, setUser] = useState(localStorage.user ? JSON.parse(localStorage.user) : null);

  const updateUserData = (userInfo) => {
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
  }


  return (
    <BrowserRouter>
      <UserContext.Provider value={{
        user: user,
        setUserContext: updateUserData
      }}>
        <div>
          <Header 
            title="RAI Projekt"
          />

          <main>
            <Routes>
              <Route path="/" exact element={<Main />}></Route>
              <Route path="/login" exact element={<Login />}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route path="/profile" element={<Profile />}></Route>
              <Route path="/logout" element={<Logout />}></Route>
            </Routes>
          </main>
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;