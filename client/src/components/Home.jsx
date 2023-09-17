import React, { useState } from 'react';
import { TextField, Select, MenuItem, Button } from '@mui/material';
import Card from '@mui/material/Card';
import Navbar from './Navbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
const defaultTheme = createTheme();

const tableCellStyle = {
  border: '2px solid black',
  padding: '8px',
};

function Home() {

  const navigate = useNavigate();
  const { user } = useUserContext();

  const [formData, setFormData] = useState({
    ages: [],
    cityTier: '',
    sumAssured: '',
    tenure: '',
  });

  const [responseData, setResponseData] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/calculate_premium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      console.log(response)

      if (response.status === 200) {
        const data = await response.json();
        console.log("Print", data.insurance_plan._id);
        setResponseData(data);

        toast.success('calculated premium Successfully', {
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
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addToCart = async (planId) => {
    try {
      const response = await fetch(`http://localhost:5000/add_to_cart/${planId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (response.ok) {
        toast.success('Added to cart Successfully', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        navigate('/cart');
      } else {
        toast.error('Failed to add to cart', {
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
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Navbar page="Home" />
      <Card>
        <form onSubmit={handleSubmit} maxWidth="sm">
          <br></br>
          <br></br>
          <TextField
            label="Ages of Insured Persons"
            id="ages"
            name="ages"
            value={formData.ages}
            onChange={(e) => setFormData({ ...formData, ages: e.target.value })}
            placeholder="e.g., 30, 35, 40"
            variant="outlined"
            fullWidth
            required
          />
          <br></br>
          <br></br>
          <Select
            label="City Tier"
            id="cityTier"
            name="cityTier"
            placeholder="City Tier"
            value={formData.cityTier}
            onChange={(e) => setFormData({ ...formData, cityTier: e.target.value })}
            variant="outlined"
            fullWidth
            required
          >
            <MenuItem value="">Select City Tier</MenuItem>
            <MenuItem value="Tier-1">Tier 1</MenuItem>
            <MenuItem value="Tier-2">Tier 2</MenuItem>
          </Select>
          <br></br>
          <br></br>
          <Select
            label="Sum Assured"
            id="sumAssured"
            name="sumAssured"
            value={formData.sumAssured}
            onChange={(e) => setFormData({ ...formData, sumAssured: e.target.value })}
            placeholder="e.g., 1000000"
            variant="outlined"
            fullWidth
            required
          >
            <MenuItem value="">Sum insured</MenuItem>
            <MenuItem value="100000">100000</MenuItem>
            <MenuItem value="200000">200000</MenuItem>
            <MenuItem value="500000">500000</MenuItem>
          </Select>
          <br></br>
          <br></br>
          
          <TextField
            label="Policy Tenure (in years)"
            id="tenure"
            name="tenure"
            value={formData.tenure}
            onChange={(e) => setFormData({ ...formData, tenure: e.target.value })}
            placeholder="e.g., 10"
            variant="outlined"
            fullWidth
            required
          />
          <br></br>
          <br></br>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Calculate Premium
          </Button>
        </form>
      </Card>
      {responseData && responseData.members && responseData.members.length > 0 && (
        <Card>
          <h2>Members Data</h2>
          <table style={{ border: '5px solid black', padding: '10px' }}>
            <thead>
              <tr>
                <th style={tableCellStyle}>Name</th>
                {responseData.members.map((member, index) => (
                  <th style={tableCellStyle} key={index}>{member.age}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tableCellStyle}>Base Rate</td>
                {responseData.members.map((member, index) => (
                  <td style={tableCellStyle} key={index}>{member.base_premium}</td>
                ))}
              </tr>
              <tr>
                <td style={tableCellStyle}>Floater Discount</td>
                {responseData.members.map((member, index) => (
                  <td style={tableCellStyle} key={index}>{member.discount}</td>
                ))}
              </tr>

              <tr>
                <td style={tableCellStyle}>Discounted Rate</td>
                {responseData.members.map((member, index) => (
                  <td style={tableCellStyle} key={index}>{member.discounted_rate}</td>
                ))}
              </tr>

              <tr>
                <td style={tableCellStyle}>Total Premium</td>
                <td style={tableCellStyle} key={responseData.total_premium}>{responseData.total_premium}</td>
              </tr>

            </tbody>


          </table>
          <Button variant="contained" color="primary" onClick={() => addToCart(responseData.insurance_plan._id.$oid)} style={{ marginLeft: '16px' }}>
              Add to cart
            </Button>
        </Card>
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

export default Home;
