import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useUserContext } from './UserContext'; // Import the UserContext
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultTheme = createTheme();

const cardStyle = {
  backgroundColor: '#2196F3',
  color: 'white',
  boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
  borderRadius: '8px',
  marginBottom: '16px',
  display: 'flex',
  justifyContent: 'center',
  minHeight: '80px',
  width: '40%', 
};

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useUserContext();

  useEffect(() => {
    fetch('http://localhost:5000/cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      })
      .then((response) => response.json())
      .then((data) => {setCartItems(data)
        console.log(data)
      })
      .catch((error) => console.error('Error fetching cart items:', error));
  }, []);

  const handleClearCart = () => {
    fetch('http://localhost:5000/clear_cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      })
      .then(() => {
        setCartItems([]);
        toast.success('Cleared cart Successfully', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((error) => {
        console.error('Error clearing cart:', error)
        toast.error('Something went wrong', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  const handleCheckout = () => {
    fetch('http://localhost:5000/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
    })
      .then((response) => {
        setCartItems([]);
        if (response.ok) {
          toast.success('Baught Insurance Plan Successfully', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          toast.error('Something went wrong', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      })
      .catch((error) => console.error('Error during checkout:', error));
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Navbar page="Cart" />
        
        <h1>Cart Page</h1>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            {cartItems[0].insurance_plans.map((item, index) => (
              <Card key={index} variant="outlined" style={cardStyle}>
                <CardContent>
                  <h2>{item.name}</h2>
                  <p>{item.status}</p>
                  <p>Price: {item.final_premium}</p>
                </CardContent>
              </Card>
            ))}
            <h1>Cart Value</h1><h2>{cartItems.total_premium}</h2>
            <Button variant="contained" color="primary" onClick={handleClearCart}>
              Clear Cart
            </Button>
            <Button variant="contained" color="primary" onClick={handleCheckout} style={{ marginLeft: '16px' }}>
              Proceed to Checkout
            </Button>
          </div>
        )}
        <ToastContainer position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover />
    </ThemeProvider>
  );
}

export default Cart;
