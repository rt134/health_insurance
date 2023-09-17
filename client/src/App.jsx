import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Cart from './components/Cart';
import SignIn from './components/Signin';
import SignUp from './components/Signup';
import { useUserContext } from './components/UserContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/cart',
    element: <Cart />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/signin',
    element: <SignIn />,
  },
]);

function App() {
  const { user } = useUserContext();

  return (
    <RouterProvider router={router}>
      <Routes>
        <Route
          path="/"
          element={ user !== null ? <Home /> : <Navigate to="/signup" replace />}
        />
        <Route
          path="/cart"
          element={ user !== null ? <Cart /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/signup"
          element={user === null ? <SignUp /> : <Navigate to="/" replace />}
        />
        <Route
          path="/signin"
          element={
          user === null ? <SignIn /> : <Navigate to="/" replace />}
        />
      </Routes>
    </RouterProvider>
  );
}

export default App;
