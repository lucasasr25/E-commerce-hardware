const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

const clientRoutes = require("./src/routes/clientRoutes");
const addressRoutes = require("./src/routes/addressRoutes");
app.set("views", path.join(__dirname, "src/views"));
// Defina o mecanismo de view como EJS
app.set("view engine", "ejs");


// Servindo arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use("/api", clientRoutes);
app.use("/api", addressRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
