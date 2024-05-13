const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/api/reviews', async (req, res) => {
    const apiKey = 'AIzaSyBme_OVovVfNTizaS8MxFsg9FEpkZoPbdI';
    const placeId = 'ChIJ_xUN3qSHqkARTt50I63BiJU';
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching Google reviews');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});