const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
const port = 3000;

const clientRoutes = require("./src/routes/clientRoutes.js");
const apiRoutes = require("./src/routes/apiClientRoutes.js");
const cartRoutes = require("./src/routes/cartRoutes.js");
const productRoutes = require("./src/routes/productRoutes.js");
const websiteRoutes = require("./src/routes/mainRoutes.js");

app.set("views", path.join(__dirname, "src/views"));
// Defina o mecanismo de view como EJS
app.set("view engine", "ejs");


// Servindo arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "chave-super-secreta",
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false, // true se HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 // 1h
  }
}));

// 🔐 Login automático como administrador (mock)
app.use((req, res, next) => {
  if (!req.session.user) {
      req.session.user = {
          id: 3,
          name: "Administrador",
          email: "admin@loja.com",
          role: "admin"
      };
      console.log("Login automático como admin.");
  }
  next();
});


app.use(express.json());
app.use("/client", clientRoutes);
app.use("/api", apiRoutes);
app.use("/product", productRoutes);
app.use("/cart", cartRoutes);
app.use("/", websiteRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(3000, () => {
      console.log('Servidor rodando em http://localhost:3000');
  });
}

module.exports = app;  // Exporta a instância do app
