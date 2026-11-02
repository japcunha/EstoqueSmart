const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json);

//listar
app.get("/produtos", (req, res) => {
  db.all(
    "SELECT * FROM produtos ORDER BY data_validade ASC",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ erro: err.message });

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const produtosComDias = rows.map((p) => {
        const validade = new Date(p.data_validade);
        const diffMs = validade - hoje;
        const diasRestantes = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return {
          ...p,
          diasRestantes,
        };
      });
      res.json(produtosComDias);
    },
  );
});

//cadastrar
app.post("/produtos", (req, res) => {
  const { nome, categoria, quantidade, data_validade } = req.body;
  if (!nome || !quantidade || !data_validade) {
    return res
      .status(400)
      .json({ erro: "Preencha nome,quantidade e validade " });
  }
  const sql = `INSERT INTO produtos (nome,categoria,quantidade,data_validade)
    VALUES (?,?,?,?)`;

  db.run(
    sql,
    [nome, categoria || "", quantidade, data_validade],
    function (err) {
      if (err) return res.status(500).json({ erro: err.message });
      res.json({ id: this.lastID, nome, categoria, quantidade, data_validade });
    },
  );
});
//atualiza produto:
app.put("/produtos/:id", (req, res) => {
  const { id } = req.params;
  const { nome, categoria, quantidade, data_validade } = req.body;

  const sql = `UPDATE produtos
SET nome = ?, categoria = ?, quantidade = ?, data_validade = ?
               WHERE id = ?`;

  db.run(sql, [nome, categoria, quantidade, data_validade, id], function (err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.json({ mensagem: "Produto atualizado!" });
  });
});

app.delete('/produtos/:id', (req, res) => {
  db.run('DELETE FROM produtos WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.json({ mensagem: 'Produto removido!' });
  });
});
