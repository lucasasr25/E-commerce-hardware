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
            .post('/api/clients')
            .send(newClient);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Client successfully registered!');
        clientId = response.body.client.id; // Pega o ID do cliente registrado
    });

    // Teste de atualização do cliente
    it('should update an existing client successfully', async () => {
        const updatedClient = {
            name: "Novo Nome",
            email: "novoemail@example.com",
            active: true
        };

        const response = await request(app)
            .put(`/api/clients/${clientId}`) // Usa o ID do cliente registrado para atualizar
            .send(updatedClient);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Client successfully updated');
        expect(response.body.client).toMatchObject(updatedClient);
    });
});
