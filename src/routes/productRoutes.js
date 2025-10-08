const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.post("/products", productController.createProduct); 
router.get("/products", productController.getProducts); 
router.delete("/products/:id", productController.deleteProduct); 

router.get("/product-details", productController.getProductDetails); 
router.get("/product-details", productController.getProductDetails); 
router.post("/product-details", productController.addProductDetails); 
router.delete("/product-details/:id", productController.deleteProductDetails); 

router.post("/updateProduct", productController.updateProductDetails); 

router.get("/view", productController.renderProductsView); 
router.get("/product-detail", productController.renderProductDetailView); 
router.get("/create", productController.renderCreateProductView); 
router.get("/edit", productController.renderEditProductView); 
router.post("/delete/:id", productController.deleteProduct); 


module.exports = router;
