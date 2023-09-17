import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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

function ActivePlans() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/plans', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      })
      .then((response) => response.json())
      .then((data) => {setPlans(data)
      })
      .catch((error) => console.error('Error Plans:', error));
  }, []);

  
  return (
    <ThemeProvider theme={defaultTheme}>
      <Navbar page="Active Plans" />
        
        <h1>Plans Page</h1>

        {plans.length === 0 ? (
          <p>Your Dont have any Plans yet. <Link to='/'>Buy Insurance?</Link></p>
        ) : (
          <div>
            {plans.map((item, index) => (
              <Card key={index} variant="outlined" style={cardStyle}>
                <CardContent>
                  <p><h3>Plan Id</h3> : <h3>{item.id}</h3></p>
                  <p><h3>Plan name</h3> : <h3>{item.name}</h3></p>
                  <p><h3>Final Premium</h3> : <h3>{item.final_premium}</h3></p>
                  <p><h3>Time of activation </h3> : <h3>{item.timestamp}</h3></p>
                </CardContent>
              </Card>
            ))}
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

export default ActivePlans;
