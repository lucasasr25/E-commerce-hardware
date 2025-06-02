const RenderOrdersUseCase = require('./RenderOrdersUseCase');
const {RegisterClientUseCase} = require('./ClientUseCases');
const {updateClientUseCase} = require('./ClientUseCases');
const RenderClientsViewUseCase = require('./RenderClientsViewUseCase');
const RenderClientDetailUseCase = require('./RenderClientDetailUseCase');
const {DeleteClientUseCase} = require('./ClientUseCases');
const SearchClientsUseCase = require('./SearchClientsUseCase');
const RenderEditViewUseCase = require('./RenderEditViewUseCase');
const RenderCardEditUseCase = require('./RenderCardEditUseCase');
const {UpdateCreditCardsUseCase} = require('./ClientUseCases');
const RenderClientProfileUseCase = require('./RenderClientProfileUseCase');
const RenderCreateViewUseCase = require('./RenderCreateViewUseCase');
const {CreateClientUseCase} = require('./ClientUseCases');
const RenderOrderUseCase = require('./RenderOrderUseCase');
const {RegisterReturnUseCase} = require('./ClientUseCases');
const ViewReturnsUseCase = require('./ViewReturnsUseCase');
const {GetOrdersByClientIdUseCase} = require('./ClientUseCases');
const {UpdateOrderStatusUseCase} = require('./ClientUseCases');

module.exports = {
    RenderOrdersUseCase,
    RegisterReturnUseCase,
    RegisterClientUseCase,
    updateClientUseCase,
    SearchClientsUseCase,
    RenderClientsViewUseCase,
    RenderClientDetailUseCase,
    DeleteClientUseCase,
    RenderEditViewUseCase,
    RenderCardEditUseCase,
    UpdateCreditCardsUseCase,
    RenderClientProfileUseCase,
    RenderCreateViewUseCase,
    CreateClientUseCase,
    RenderOrderUseCase,
    ViewReturnsUseCase,
    GetOrdersByClientIdUseCase,
    UpdateOrderStatusUseCase
};
