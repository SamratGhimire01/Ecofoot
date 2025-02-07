// script.js

document.getElementById('startButton').addEventListener('click', () => {
  document.getElementById('home').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
});

document.getElementById('carbonForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const energyUsage = document.getElementById('energyUsage').value;

  try {
    const response = await fetch('/api/calculate-carbon-footprint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ energyUsage })
    });

    const data = await response.json();
    console.log('Backend Response:', data);

    if (data.error) {
      document.getElementById('carbonResult').textContent = 'Failed to calculate carbon footprint.';
    } else {
      document.getElementById('carbonResult').textContent = `Your Carbon Footprint: ${data.carbonFootprint} kg CO2`;
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('carbonResult').textContent = 'An error occurred. Please try again.';
  }
});