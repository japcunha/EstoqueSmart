const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'estoque.db'));

db.serialize(() => {
    db.run(` 
        CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        categoria TEXT,
        quantidade INTEGER NOT NULL,
        data_validade TEXT NOT NULL
        )`);
        console.log(`bando de dados pronto pra rodar!`);

});
module.exports = db;










