const express = require("express");
const path = require("path");

const app = express();

// Your routes
const clientRoutes = require("../src/routes/clientRoutes.js");
const apiRoutes = require("../src/routes/apiClientRoutes.js");
const cartRoutes = require("../src/routes/cartRoutes.js");
const productRoutes = require("../src/routes/productRoutes.js");

app.set("views", path.join(__dirname, "src/views"));
// Defina o mecanismo de view como EJS
app.set("view engine", "ejs");

// Servindo arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define your routes
app.use("/client", clientRoutes);
app.use("/api", apiRoutes);
app.use("/", productRoutes);
app.use("/cart", cartRoutes);

// Export the app for Vercel to handle the serverless function
module.exports = app;
