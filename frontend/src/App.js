import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Logout from "./components/Logout";
import Main from "./components/Main";

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;