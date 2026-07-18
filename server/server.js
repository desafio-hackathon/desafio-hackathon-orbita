const express = require('express');
const playerRoutes = require('./src/routes/playerRoutes');

const app = express();
app.use(express.json());

app.use('/api', playerRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 API rodando naporta ${PORT}!`);
});