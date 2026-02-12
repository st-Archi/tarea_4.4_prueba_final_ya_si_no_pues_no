const router = require('express').Router();
const Product = require('../models/Product');
const verify = require('../middleware/auth');

// Crear producto
router.post('/', verify, async (req, res) => {
    const { name, description, price } = req.body;
    const newProduct = new Product({ name, description, price });

    try {
        const savedProduct = await newProduct.save();
        res.json(savedProduct);
    } catch (err) {
        res.status(500).json({ message: 'Error al crear producto', error: err.message });
    }
});

// Obtener todos los productos
router.get('/', verify, async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener productos', error: err.message });
    }
});

// Actualizar producto
router.put('/:id', verify, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar producto', error: err.message });
    }
});

// Eliminar producto
router.delete('/:id', verify, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Producto eliminado' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar producto', error: err.message });
    }
});

module.exports = router;
