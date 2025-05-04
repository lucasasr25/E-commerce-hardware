const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
const port = 3000;

const clientRoutes = require("./routes/clientRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const websiteRoutes = require("./routes/mainRoutes.js");
const settingsRoutes = require("./routes/settingsRoutes.js");

app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");


app.use(express.static(path.join(__dirname, "../public")));
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
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/settings", settingsRoutes);
app.use("/cart", cartRoutes);
app.use("/", websiteRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(3000, () => {
      console.log('Servidor rodando em http://localhost:3000');
  });
}

module.exports = app;  // Exporta a instância do app
