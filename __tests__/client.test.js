const request = require('supertest'); 
const app = require('../server.js'); 
describe('Client API', () => {
    let clientId;
    it('should register a new client successfully', async () => {
        const newClient = {
            name: "João Silva",
            email: "joao.silva@example.com",
            password: "SenhaForte123!",
            document: "51591253851",
            addresses: [{
                street: "Rua A",
                number: "123",
                complement: "Apto 45",
                neighborhood: "Centro",
                city: "São Paulo",
                state: "SP",
                country: "BR",
                zipcode: "12345-678"
            }]
        };

        const response = await request(app)
            .post('/client/createClient')
            .send(newClient);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Client successfully registered!');
        clientId = response.body.client.id; // Pega o ID do cliente registrado
    });

});
