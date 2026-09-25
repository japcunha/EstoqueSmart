const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json);

app.get('/produtos', (req,res) => {
    db.all('SELECT * FROM produtos ORDER BY data_validade ASC',[], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message});

const hoje = new Date();
hoje.setHours(0,0,0,0);

const produtosComDias = rows.map((p) => {
    const validade = new Date(p.data_validade);
    const diffMs = validade - hoje;
    const diasRestantes = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return {
        ...p,diasRestantes};

    });
    res.json(produtosComDias);

});
});