const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Produtos
router.post("/products", productController.createProduct); // Criar produto
router.get("/products", productController.getProducts); // Listar todos os produtos
router.delete("/products/:id", productController.deleteProduct); // Deletar produto

// Detalhes do produto
router.get("/product-details", productController.getProductDetails); // Listar detalhes de um produto específico
router.get("/product-details", productController.getProductDetails); // Listar detalhes de um produto específico
router.post("/product-details", productController.addProductDetails); // Adicionar detalhes a um produto
router.delete("/product-details/:id", productController.deleteProductDetails); // Deletar detalhes de um produto


router.post("/updateProduct", productController.updateProductDetails); // Atualizar detalhes de um produto

// Renderizar views (caso esteja usando um motor de template como EJS, Pug, etc.)
router.get("/view", productController.renderProductsView); // Página de listagem de produtos
router.get("/product-detail", productController.renderProductDetailView); // Página de detalhes de um produto
router.get("/create", productController.renderCreateProductView); // Página de criação de produto
router.get("/edit", productController.renderEditProductView); // Página de edição de produto
router.post("/delete/:id", productController.deleteProduct); // Página de edição de produto


module.exports = router;
