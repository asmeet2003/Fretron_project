 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const FlightPathChart = () => {
  const [flightPaths, setFlightPaths] = useState([]);

  useEffect(() => {
     axios.get('http://localhost:5000/api/flight-paths')
      .then(response => {
        setFlightPaths(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the flight paths!', error);
      });
  }, []);

  const data = {
    datasets: flightPaths.map((path, index) => ({
      label: `Flight ${index + 1}`,
      data: path.map(point => ({ x: point[0], y: point[1] })),
      borderColor: ['#FF5733', '#33FF57', '#3357FF'][index % 3],
      backgroundColor: 'rgba(0, 0, 0, 0)',
      pointRadius: 5,
      pointBorderColor: 'black',
      borderWidth: 2
    }))
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom'
      },
      y: {
        type: 'linear',
      }
    },
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `(${context.raw.x}, ${context.raw.y})`;
          }
        }
      }
    }
  };

  return (
    <div>
      <h2>Flight Paths</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default FlightPathChart;
