const request = require('supertest');
const app = require('../api/index');
const mongoose = require('mongoose');
const User = require('../api/models/User');

beforeAll(async () => {
    // Conectarse a MongoDB de prueba
    await mongoose.connect('mongodb://localhost:27017/gestor-productos', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
});

describe('Pruebas de Auth', () => {

    it('Debe registrar un nuevo usuario', async () => {
        const res = await request(app).post('/api/auth/register')
            .send({ username: 'broki', password: '123456' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('userId');
        expect(res.body.username).toBe('broki');
    });

    it('Debe iniciar sesión con usuario existente', async () => {
        const res = await request(app).post('/api/auth/login')
            .send({ username: 'broki', password: '123456' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('No debe iniciar sesión con contraseña incorrecta', async () => {
        const res = await request(app).post('/api/auth/login')
            .send({ username: 'broki', password: 'mal123' });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Contraseña incorrecta');
    });

});
