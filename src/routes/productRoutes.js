const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');

// @route   POST /api/products
// @desc    Criar um novo produto (apenas para usuários autenticados, o controlador verificará o role)
// @access  Private
router.post('/', auth, productController.createProduct);

// @route   GET /api/products
// @desc    Listar todos os produtos (pode ser acessado por qualquer um)
// @access  Public
router.get('/', productController.getProducts);

// @route   PUT /api/products/:id
// @desc    Atualizar um produto (apenas pelo restaurante dono do produto)
// @access  Private
router.put('/:id', auth, productController.updateProduct);

// @route   DELETE /api/products/:id
// @desc    Deletar um produto (apenas pelo restaurante dono do produto)
// @access  Private
router.delete('/:id', auth, productController.deleteProduct);

module.exports = router;