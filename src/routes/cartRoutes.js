const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartContoller");
// const cartRepo = require("../repositories/cartRepository");


// renderCartView
// // Adicionar item ao carrinho


router.post("/add", cartController.addItemToCart);

router.get("/getPreview", cartController.getCartItemsUser);


// // Listar itens do carrinho
// router.get("/:userId", async (req, res) => {
//     try {
//         const cartItems = await cartRepo.getCartItems(req.params.userId);
//         res.json(cartItems);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Remover item do carrinho
// router.delete("/remove", async (req, res) => {
//     try {
//         const { userId, productId } = req.body;
//         const response = await cartRepo.removeItemFromCart(userId, productId);
//         res.json(response);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Limpar carrinho
// router.delete("/clear/:userId", async (req, res) => {
//     try {
//         const response = await cartRepo.clearCart(req.params.userId);
//         res.json(response);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

module.exports = router;
