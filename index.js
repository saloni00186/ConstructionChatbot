const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

// Middleware to parse JSON
app.use(bodyParser.json());

// Webhook route for Dialogflow
app.post('/webhook', (req, res) => {
    const intentName = req.body.queryResult.intent.displayName;

    if (intentName === 'Weather Update') {
        const city = req.body.queryResult.parameters['geo-city'];
        getWeather(city).then(response => {
            res.json({ fulfillmentText: response });
        }).catch(error => {
            res.json({ fulfillmentText: 'Sorry, I could not retrieve the weather information at this time.' });
        });
    } else {
        res.json({ fulfillmentText: 'Intent not supported by this webhook.' });
    }
});

// Function to get weather info using OpenWeather API
function getWeather(city) {
    const apiKey = 'YOUR_OPENWEATHER_API_KEY'; // Replace with your OpenWeather API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    return axios.get(url).then(response => {
        const temp = response.data.main.temp;
        const description = response.data.weather[0].description;
        return `The current temperature in ${city} is ${temp}°C with ${description}.`;
    }).catch(error => {
        console.error('Error fetching weather data:', error);
        throw new Error('Error fetching weather data.');
    });
}

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
