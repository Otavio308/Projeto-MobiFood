const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth'); // Seu middleware de autenticação
const authorizeRole = require('../middleware/role'); // Seu middleware de role

// @route   POST /api/orders
// @desc    Criar um novo pedido (apenas clientes)
// @access  Private (Client)
router.post('/', auth, authorizeRole(['client']), orderController.createOrder);

// @route   GET /api/orders/customer
// @desc    Listar pedidos do cliente logado
// @access  Private (Client)
router.get('/customer', auth, authorizeRole(['client']), orderController.getCustomerOrders);

// @route   GET /api/orders/restaurant
// @desc    Listar pedidos para o restaurante logado
// @access  Private (Restaurant)
router.get('/restaurant', auth, authorizeRole(['restaurant']), orderController.getRestaurantOrders);

// @route   PUT /api/orders/:id/status
// @desc    Atualizar status de um pedido (cliente ou restaurante)
// @access  Private (Client/Restaurant)
router.put('/:id/status', auth, orderController.updateOrderStatus);

// @route   DELETE /api/orders/:id
// @desc    Deletar pedido (apenas se concluído/cancelado, por restaurante/admin)
// @access  Private (Restaurant/Admin)
router.delete('/:id', auth, authorizeRole(['restaurant', 'admin']), orderController.deleteOrder);

module.exports = router;