import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useUserContext } from './UserContext'; // Import the UserContext

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
    fetch('/cart', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setCartItems(data))
      .catch((error) => console.error('Error fetching cart items:', error));
  }, []);

  const handleClearCart = () => {
    fetch('/clear_cart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => {
        setCartItems([]);
      })
      .catch((error) => console.error('Error clearing cart:', error));
  };

  const handleCheckout = () => {
    fetch('/checkout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("Checked out")
        } else {
          console.error('Checkout failed');
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
            {cartItems.map((item, index) => (
              <Card key={index} variant="outlined" style={cardStyle}>
                <CardContent>
                  <h2>{item.name}</h2>
                  <p>{item.description}</p>
                  <p>Price: {item.price}</p>
                </CardContent>
              </Card>
            ))}
            <Button variant="contained" color="primary" onClick={handleClearCart}>
              Clear Cart
            </Button>
            <Button variant="contained" color="primary" onClick={handleCheckout} style={{ marginLeft: '16px' }}>
              Proceed to Checkout
            </Button>
          </div>
        )}
    </ThemeProvider>
  );
}

export default Cart;
