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
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";


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
      <div className="d-flex flex-column min-vh-100">
        <Header title="CocktailBox" />

        <main className="flex-grow-1">
          <Routes>
            <Route path="/" exact element={<Main />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/cocktails" element={<CocktailSelection />} />
            <Route path="/create-cocktail" element={<CreateCocktail />} />
            <Route path="/add-drink" element={<AddDrink />} />
            <Route path="/add-cocktail" element={<AddCocktail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-paketnik" element={<AddPaketnik />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </UserContext.Provider>
  </BrowserRouter>
);

}

export default App;