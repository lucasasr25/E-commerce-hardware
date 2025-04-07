const clientRepository = require('../repositories/clientRepository');

const renderCheckoutView = async (req, res) => {
    try {

        const id = parseInt(req.query.id); // converte para número, se necessário

        const cliente = await clientRepository.getClientById(id);

        const cartoes = await clientRepository.getCreditCardsByUserId(id);

        if (!cliente) {
            return res.status(404).send("Cliente não encontrado");
        }

        // Pega o endereço favorito como o primeiro (se houver)
        const enderecoFavorito = cliente.addresses?.find(endereco => endereco.is_default) || {};
        const telefone = cliente.phone_numbers?.[0] || "";

        res.render("shopping/checkout", {
            nome: cliente.name,
            email: cliente.email,
            apelido: enderecoFavorito.nick,
            endereco: `${enderecoFavorito.street || ''}, ${enderecoFavorito.number || ''}.....`,
            cidade: enderecoFavorito.city || '',
            cep: enderecoFavorito.zipcode || '',
            telefone,
            cartoes,
            enderecos: cliente.addresses || []
        });

    } catch (error) {
        console.error("Erro ao renderizar checkout:", error);
        res.status(500).send("Erro ao carregar o checkout");
    }
};

module.exports = {
    renderCheckoutView,
};
