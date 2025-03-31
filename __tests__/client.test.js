const request = require('supertest'); 
const app = require('../server.js'); 
describe('Client API', () => {
    let clientId;
    it('should register a new client successfully', async () => {
        const newClient = {
            name: 'João Silva',
            email: 'joao.silva@example.com',
            password: 'SenhaForte123!',
            document: '51591253851',
            active: 'on', // 'on' pode ser interpretado como um valor verdadeiro para booleano
            adr_type: ['billing'],  // Envia como array
            street: ['Rua A'],  // Envia como array
            number: ['123'],  // Envia como array
            complement: ['Apto 45'],  // Envia como array
            neighborhood: ['Centro'],  // Envia como array
            city: ['São Paulo'],  // Envia como array
            state: ['SP'],  // Envia como array
            country: ['BR'],  // Envia como array
            zipcode: ['12345-678'],  // Envia como array
            phoneNumbers: ['11912085492']  // Envia como array
        };

        const response = await request(app)
            .post('/client/createClient')
            .send(newClient);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Client successfully registered!');
        clientId = response.body.client.id; // Pega o ID do cliente registrado
    });

});
