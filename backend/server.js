const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;


app.use(cors());


const dataFilePath = path.join(__dirname, 'data.json');


app.get('/api/keywords', (req, res) => {
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error leyendo el archivo JSON:', err);
      res.status(500).json({ error: 'Error al leer los datos.' });
      return;
    }
    const jsonData = JSON.parse(data);
    const keywords = jsonData.keywords.flatMap(category => category.data);
    res.json(keywords);
  });
});


app.use(express.static(path.join(__dirname, '../frontend')));


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});