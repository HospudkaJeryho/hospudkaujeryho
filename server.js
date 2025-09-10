const express = require('express');
const { Pool } = require('pg');
const app = express();
const cors = require('cors');
const port = 3000;

const pool = new Pool({
    host: 'db.dw022.nameserver.sk', // Zde je adresa
    user: 'hospudkaujeryho1', // Vaše uživatelské jméno k databázi
    password: '5eEDGW1j', // Vaše heslo k databázi
    database: 'hospudkaujeryho1', // Název databáze
    port: 5434 // Zde je port
});
pool.on('error', (err) => {
    console.error('Neočekávaná chyba klienta:', err);
    process.exit(-1);
});

app.use(cors());
app.use(express.json());

// Zde by měly být tvé GET a POST endpointy pro /products a další routy
// Například:
// app.get('/products', (req, res) => {
//   pool.query('SELECT * FROM products', (err, result) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send('Chyba serveru');
//     } else {
//       res.json(result.rows);
//     }
//   });
// });

app.listen(port, () => {
  console.log(`Server běží na portu ${port}`);
});
// Zde jsou moje routy