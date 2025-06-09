import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserContext } from "./userContext";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Logout from "./components/Logout";
import Main from "./components/Main";
import Footer from './components/Footer';

import CocktailSelection from "./components/CocktailSelection";
import CreateCocktail from "./components/CreateCocktail";
import AddDrink from "./components/AddDrink";
import AddCocktail from "./components/AddCocktail";
import Dashboard from "./components/Dashboard";
import AddPaketnik from './components/AddPaketnik';

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
            title="CocktailBox"
          />

          <main>
            <Routes>
              <Route path="/" exact element={<Main />}></Route>
              <Route path="/login" exact element={<Login />}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route path="/profile" element={<Profile />}></Route>
              <Route path="/logout" element={<Logout />}></Route>


              <Route path="/cocktails" element={<CocktailSelection />} />
              <Route path="/create-cocktail" element={<CreateCocktail />} />
              <Route path="/add-drink" element={<AddDrink />} />
              <Route path="/add-cocktail" element={<AddCocktail />} />
                
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-paketnik" element={<AddPaketnik />} />
            </Routes>
          </main>
          <Footer/>
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;