const cartRepository = require("../repositories/cartRepository");
const productRepository = require("../repositories/productRepository");

// Função para adicionar um item ao carrinho
const addItemToCart = async (req, res) => {
    const { productId, quantity, price } = req.body;
    const userId = req.session.user?.id;  // Obtendo o id do usuário da sessão (já autenticado)

    if (!userId) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }

    if (!productId || !quantity) {
        return res.status(400).json({ message: "Product ID and Quantity are required" });
    }

    try {
        // Verificar se o produto existe
        const product = await productRepository.getProductById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        // Adicionar item ao carrinho
        const cartItem = await cartRepository.addItemToCart(userId, productId, quantity);

        // Resposta bem-sucedida, você pode retornar um status e mensagem
        res.redirect("/cart/view");

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
// Função para listar os itens de um carrinho
const getCartItems = async (req, res) => {
    const { cart_id } = req.query;

    if (!cart_id) {
        return res.status(400).json({ message: "Cart ID is required" });
    }

    try {
        // Buscar itens do carrinho
        const items = await cartRepository.getCartItems(cart_id);
        res.json({ items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


// Função para listar os itens de um carrinho
const getCartItemsUser = async (req, res) => {
    const userId = req.session.user?.id;  // Obtendo o id do usuário da sessão (já autenticado)
    try {
        const items = await cartRepository.getCartItems(userId);
        const total = await cartRepository.getCartTotal(userId);
        // Renderizando diretamente o HTML
        res.render('partials/cartPreview', { items, total});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


// Função para remover um item do carrinho
const removeItemFromCart = async (req, res) => {
    const { cart_id, product_id } = req.params;

    if (!cart_id || !product_id) {
        return res.status(400).json({ message: "Cart ID and Product ID are required" });
    }

    try {
        const cartItem = await cartRepository.removeItemFromCart(cart_id, product_id);

        if (!cartItem) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Função para limpar o carrinho
const clearCart = async (req, res) => {
    const { cart_id } = req.params;

    if (!cart_id) {
        return res.status(400).json({ message: "Cart ID is required" });
    }

    try {
        await cartRepository.clearCart(cart_id);
        res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Função para criar um carrinho de compras
const createCart = async (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const cart = await cartRepository.createCart(user_id);
        res.status(201).json({ message: "Cart created successfully", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
const updateCartItemQuantity = async (req, res) => {
    const { items } = req.body;  // Recebendo os itens com suas quantidades

    const userId = req.session.user?.id;  // Recuperando o userId da sessão

    if (!userId) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }

    if (!items || items.length === 0) {
        return res.status(400).json({ message: "Itens do carrinho são obrigatórios" });
    }

    try {
        // Atualizar cada item no carrinho
        for (let item of items) {
            const { productId, quantity } = item;
            if (quantity <= 0) {
                return res.status(400).json({ message: "Quantidade inválida para o produto " + productId });
            }

            // Atualiza ou remove o item do carrinho
            await cartRepository.updateCartItemQuantity(userId, productId, quantity);
        }

        res.status(200).json({ message: "Carrinho atualizado com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


// Função para renderizar a página do carrinho
const renderCartView = async (req, res) => {
    const userId = req.session.user?.id;  // Obtendo o id do usuário da sessão (já autenticado)
    if (!userId) {
        return res.status(400).json({ message: "Cart ID is required" });
    }
    try {
        const items = await cartRepository.getCartItems(userId);
        const total = await cartRepository.getCartTotal(userId);
        console.log(total)
        res.render("shopping/cart", { items, total  });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving cart items.");
    }
};

// Função para renderizar a página de checkout do carrinho


// Função para finalizar a compra
const checkoutCart = async (req, res) => {
    const { cart_id } = req.body;

    if (!cart_id) {
        return res.status(400).json({ message: "Cart ID is required" });
    }

    try {
        // Processar pagamento e criar pedido
        await cartRepository.checkoutCart(cart_id);
        res.status(200).json({ message: "Checkout completed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getCartItemsUser,
    addItemToCart,
    getCartItems,
    removeItemFromCart,
    clearCart,
    createCart,
    renderCartView,
    checkoutCart,
    updateCartItemQuantity
};
