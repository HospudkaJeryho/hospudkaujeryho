const express = require('express');
const { Pool } = require('pg');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(cors());
app.use(express.json());

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

// API pro přidání nového produktu
app.post('/products', (req, res) => {
    const { name, price, img, description } = req.body;
    const sql = 'INSERT INTO products (name, price, img, description) VALUES ($1, $2, $3, $4)';
    const values = [name, price, img, description];
    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Chyba při přidávání produktu:', err);
            res.status(500).send('Chyba serveru při přidávání produktu.');
            return;
        }
        res.status(201).send('Produkt úspěšně přidán.');
    });
});

// API pro získání všech produktů nebo jednoho konkrétního
app.get('/products', (req, res) => {
    const productName = req.query.name;
    let sql;
    let values;

    if (productName) {
        sql = 'SELECT * FROM products WHERE name = $1';
        values = [productName];
    } else {
        sql = 'SELECT * FROM products';
        values = [];
    }

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Chyba při načítání produktů:', err);
            res.status(500).send('Chyba serveru při načítání produktů.');
            return;
        }
        res.json(result.rows);
    });
});

// API pro úpravu existujícího produktu
app.put('/products/:name', (req, res) => {
    const originalName = req.params.name;
    const { name, price, img, description } = req.body;
    const sql = 'UPDATE products SET name = $1, price = $2, img = $3, description = $4 WHERE name = $5';
    const values = [name, price, img, description, originalName];
    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Chyba při úpravě produktu:', err);
            res.status(500).send('Chyba serveru při úpravě produktu.');
            return;
        }
        res.send('Produkt úspěšně upraven.');
    });
});

// API pro smazání produktu
app.delete('/products/:name', (req, res) => {
    const nameToDelete = req.params.name;
    const sql = 'DELETE FROM products WHERE name = $1';
    const values = [nameToDelete];
    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Chyba při mazání produktu:', err);
            res.status(500).send('Chyba serveru při mazání produktu.');
            return;
        }
        res.send('Produkt úspěšně smazán.');
    });
});

app.listen(port, () => {
    console.log(`Server běží na http://localhost:${port}`);
    console.log('Připojeno k databázi PostgreSQL.');
});