import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';

const Home = () => {
  const [chartData, setChartData] = useState({});
  const [username, setUsername] = useState('');

  const [chartOptions, setChartOptions] = useState({});
  const token = localStorage.getItem('token');
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);

    // Fetch salary data from the server
    const fetchSalaryData = async () => {
      try {
        const response = await fetch('http://localhost:3500/api/emp/fetchallemp');
        if (!response.ok) {
          throw new Error('Failed to fetch salary data');
        }

        const salaryData = await response.json();

        const data = {
          labels: salaryData.map(employee => employee.name),
          datasets: [
            {
              data: salaryData.map(employee => employee.salary),
              backgroundColor: [
                documentStyle.getPropertyValue('--blue-500'),
                documentStyle.getPropertyValue('--yellow-500'),
                documentStyle.getPropertyValue('--green-500'),
                documentStyle.getPropertyValue('--red-500'),
                documentStyle.getPropertyValue('--purple-500'),
                documentStyle.getPropertyValue('--cyan-500'),
              ],
              hoverBackgroundColor: [
                documentStyle.getPropertyValue('--blue-400'),
                documentStyle.getPropertyValue('--yellow-400'),
                documentStyle.getPropertyValue('--green-400'),
                documentStyle.getPropertyValue('--red-400'),
                documentStyle.getPropertyValue('--purple-400'),
                documentStyle.getPropertyValue('--cyan-400'),
              ],
            },
          ],
        };

        setChartData(data);
        setChartOptions({
          plugins: {
            legend: {
              labels: {
                usePointStyle: true,
              },
            },
          },
        });
      } catch (error) {
        console.error('Error fetching salary data:', error.message);
      }
    };

    fetchSalaryData();
  }, []);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.user ? decoded.user.isAdmin : false);
      setUsername(decoded.user ? decoded.user.name: '');
    }
  }, [token]);


  return (
    <>
      <div>
        <h1>
          Welcome {username}!
        </h1>
        <p>{isAdmin  ? "You are an Admin" : "Manger"}</p>
      </div>
      <div className="card flex justify-content-center">
        <Chart type="pie" data={chartData} options={chartOptions} className="w-full md:w-30rem" />
      </div>
    </>
  );
};

export default Home;
