const request = require('supertest');
const app = require('../api/index');
const mongoose = require('mongoose');
const Product = require('../api/models/Product');
const User = require('../api/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let token;

beforeAll(async () => {
    // Conectarse a la base de datos de prueba
    await mongoose.connect('mongodb://localhost:27017/gestor-productos', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    // Limpiar DB antes de correr los tests
    await User.deleteMany({});
    await Product.deleteMany({});

    // Crear usuario y generar token
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);
    const user = await User.create({ username: 'broki', password: hashedPassword });
    token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'supersecreto123', { expiresIn: '1h' });
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
});

describe('Pruebas CRUD Productos', () => {

    let productId;

    it('Debe crear un producto', async () => {
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Producto1', description: 'Desc1', price: 100 });

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('Producto1');
        productId = res.body._id;
    });

    it('Debe obtener todos los productos', async () => {
        const res = await request(app)
            .get('/api/products')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('Debe actualizar un producto', async () => {
        const res = await request(app)
            .put(`/api/products/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ price: 150 });

        expect(res.statusCode).toBe(200);
        expect(res.body.price).toBe(150);
    });

    it('Debe eliminar un producto', async () => {
        const res = await request(app)
            .delete(`/api/products/${productId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Producto eliminado');
    });

});
