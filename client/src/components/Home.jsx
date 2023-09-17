import React, { useState } from 'react';
import { TextField, Select, MenuItem, Button } from '@mui/material';
import Card from '@mui/material/Card';
import Navbar from './Navbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserContext } from './UserContext';
const defaultTheme = createTheme();

function Home() {

  const { user } = useUserContext();
  console.log(user)

  const [formData, setFormData] = useState({
    ages: [],
    cityTier: '',
    sumAssured: '',
    tenure: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/calculate_premium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
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
            <MenuItem value="Tier 1">Tier 1</MenuItem>
            <MenuItem value="Tier 2">Tier 2</MenuItem>
            <MenuItem value="Tier 3">Tier 3</MenuItem>
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
