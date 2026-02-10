const express = require('express');
const app = express();

const PORT = 3000;

// Middleware para JSON
app.use(express.json());

// Ruta básica
app.get('/', (req, res) => {
    res.send('Servidor Express funcionando');
});

// Arrancar servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
