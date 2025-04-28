const clientRepository = require('../repositories/clientRepository');
const cartRepository = require("../repositories/cartRepository");
const orderRepository = require("../repositories/orderRepository");

const renderCheckoutView = async (req, res) => {
    try {
        const userId = req.session.user?.id;  // Obtendo o id do usuário da sessão (já autenticado)

        const cliente = await clientRepository.getClientById(userId);
        const cartoes = await clientRepository.getCreditCardsByUserId(userId);

        if (!cliente) {
            return res.status(404).send("Cliente não encontrado");
        }

        // Pega o endereço favorito como o primeiro (se houver)
        const enderecoFavorito = cliente.addresses?.find(endereco => endereco.is_default) || {};
        const telefone = cliente.phone_numbers?.[0] || "";

        const items = await cartRepository.getCartItems(userId);
        const total = await cartRepository.getCartTotal(userId);

        res.render("shopping/checkout", {
            nome: cliente.name,
            email: cliente.email,
            apelido: enderecoFavorito.nick,
            endereco: `${enderecoFavorito.street || ''}, ${enderecoFavorito.number || ''}.....`,
            cidade: enderecoFavorito.city || '',
            cep: enderecoFavorito.zipcode || '',
            telefone,
            cartoes,
            enderecos: cliente.addresses || [],
            items,
            total
        });

    } catch (error) {
        console.error("Erro ao renderizar checkout:", error);
        res.status(500).send("Erro ao carregar o checkout");
    }
};

const checkout = async (req, res) => {
    try {
        const userId = req.session.user?.id;  // Obtendo o id do usuário da sessão (já autenticado)

        // Verificar se o usuário está autenticado
        if (!userId) {
            return res.status(401).send("Usuário não autenticado.");
        }

        const cliente = await clientRepository.getClientById(userId);
        if (!cliente) {
            return res.status(404).send("Cliente não encontrado.");
        }

        // Pega o endereço favorito
        const enderecoFavorito = cliente.addresses?.find(endereco => endereco.is_default);
        if (!enderecoFavorito) {
            return res.status(400).send("Endereço padrão não encontrado.");
        }

        // Pega os itens do carrinho
        const items = await cartRepository.getCartItems(userId);
        const total = await cartRepository.getCartTotal(userId);

        // Verificar se o carrinho está vazio
        if (items.length === 0) {
            return res.status(400).send("Carrinho vazio.");
        }

        // Criar o pedido no banco de dados
        const orderId = await orderRepository.createOrder(
            userId,
            null,  // tradeCouponId (pode ser null se não houver cupom)
            null,  // promotionalCouponId (pode ser null se não houver cupom promocional)
            enderecoFavorito.id,  // ID do endereço
            2,  // Status do pedido, por exemplo, "Pendente"
            total,  // Subtotal do pedido
            total,  // Preço total (pode incluir impostos e frete)
            items.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price
            }))  // Itens do pedido
        );

        // Limpar o carrinho após a criação do pedido
        await cartRepository.clearCart(userId);

        // Redirecionar para uma página de sucesso ou mostrar um sucesso
        res.render('status/success', {
            message: "Pedido realizado com sucesso!"
        });
    } catch (error) {
        console.error("Erro no checkout:", error);
        res.status(500).send("Erro ao processar o pedido.");
    }
};

module.exports = {
    renderCheckoutView,
    checkout
};
