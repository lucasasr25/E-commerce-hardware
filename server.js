const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

// Servindo arquivos estáticos da pasta 'www'
app.use(express.static(path.join(__dirname, "www")));

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
