import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Cart from './components/Cart';
import SignIn from './components/Signin';
import SignUp from './components/Signup';
import { useUserContext } from './components/UserContext';

function App() {
  const { user } = useUserContext();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user ? <Home /> : <SignUp />}
        />
        <Route
          path="/cart"
          element={user ? <Cart /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/signup"
          element={!user ? <SignUp /> : <Navigate to="/" replace />}
        />
        <Route
          path="/signin"
          element={!user ? <SignIn /> : <Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
