const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User'); // Para notificação, se implementado

// @route   POST /api/orders
// @desc    Cria um novo pedido
// @access  Private (Cliente)
exports.createOrder = async (req, res) => {
  try {
    const { items, paymentMethod, restaurantId } = req.body;
    // req.user.id e req.user.role vêm do middleware de autenticação (auth.js)

    // Verificar se o usuário é um cliente
    const customer = await User.findById(req.user.id);
    if (!customer || customer.role !== 'client') {
      return res.status(403).json({ message: 'Acesso negado. Apenas clientes podem criar pedidos.' });
    }

    // Verificar se o restaurante existe e é um restaurante
    const restaurant = await User.findById(restaurantId); // Ou buscar em um modelo Restaurant
    if (!restaurant || restaurant.role !== 'restaurant') {
      return res.status(400).json({ message: 'Restaurante inválido.' });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Validar itens e calcular o total
    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: `Produto com ID ${item.productId} não encontrado.` });
      }
      if (product.quantity < item.quantity) { // Verificar estoque
        return res.status(400).json({ message: `Estoque insuficiente para ${product.name}. Disponível: ${product.quantity}` });
      }

      // Atualizar o estoque do produto (diminuir)
      product.quantity -= item.quantity;
      await product.save();

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
      totalAmount += product.price * item.quantity;
    }

    // Gerar número do pedido (pode ser mais robusto em produção)
    const orderNumber = `#${Math.floor(100 + Math.random() * 900)}${Date.now().toString().slice(-4)}`;

    const newOrder = new Order({
      orderNumber,
      customer: req.user.id, // O ID do cliente logado
      restaurant: restaurant._id, // O ID do restaurante
      items: orderItems,
      totalAmount,
      paymentMethod,
      status: 'Pendente', // Status inicial
      paymentStatus: 'Não Pago', // Status de pagamento inicial
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao criar pedido.' });
  }
};

// @route   GET /api/orders/customer
// @desc    Lista pedidos do cliente logado
// @access  Private (Cliente)
exports.getCustomerOrders = async (req, res) => {
  try {
    // Apenas pedidos que não estão 'Concluído' ou 'Cancelado'
    const orders = await Order.find({ 
      customer: req.user.id,
      status: { $nin: ['Concluído', 'Cancelado'] } // Não incluir status finalizados
    })
    .populate('items.product', 'name price') // Popula detalhes do produto
    .sort({ createdAt: -1 }); // Mais recentes primeiro

    res.status(200).json(orders);
  } catch (error) {
    console.error('Erro ao buscar pedidos do cliente:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar pedidos.' });
  }
};

// @route   GET /api/orders/restaurant
// @desc    Lista pedidos para o restaurante logado
// @access  Private (Restaurante)
exports.getRestaurantOrders = async (req, res) => {
  try {
    // Apenas pedidos que não estão 'Concluído' ou 'Cancelado' para o restaurante
    const orders = await Order.find({ 
      restaurant: req.user.id,
      status: { $nin: ['Concluído', 'Cancelado'] } // Não incluir status finalizados
    })
    .populate('customer', 'name mobile') // Popula o nome e mobile do cliente
    .populate('items.product', 'name price') // Popula detalhes do produto
    .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Erro ao buscar pedidos do restaurante:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar pedidos.' });
  }
};

// @route   PUT /api/orders/:id/status
// @desc    Atualiza o status de um pedido
// @access  Private (Cliente ou Restaurante, dependendo da transição)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado.' });
    }

    // Lógica de autorização e transição de status
    // Cliente pode marcar como 'Concluído'
    // Restaurante pode marcar como 'Em Preparação', 'Pronto para Retirada', 'Cancelado' (e 'Pago' para paymentStatus)

    const user = await User.findById(req.user.id);

    if (user.role === 'client' && order.customer.toString() === req.user.id) {
      // Cliente pode marcar como 'Concluído'
      if (status === 'Concluído' && order.status === 'Pronto para Retirada') {
        order.status = status;
        order.paymentStatus = 'Pago'; // Cliente só marca como concluído se já pagou
        // Aqui você pode enviar uma notificação para o restaurante de que o cliente pegou
      } else {
        return res.status(403).json({ message: 'Cliente não pode realizar esta transição de status.' });
      }
    } else if (user.role === 'restaurant' && order.restaurant.toString() === req.user.id) {
      // Restaurante pode marcar como 'Em Preparação', 'Pronto para Retirada', 'Cancelado'
      if (['Em Preparação', 'Pronto para Retirada', 'Cancelado'].includes(status)) {
        order.status = status;
        // Se o status for 'Pronto para Retirada', envie uma notificação ao cliente
        if (status === 'Pronto para Retirada') {
            // Implementar notificação push/email para o cliente (complexo, fora do escopo inicial)
            console.log(`Notificação: Pedido ${order.orderNumber} está pronto para retirada!`);
        }
      }
      // Restaurante também pode atualizar o status de pagamento
      if (paymentStatus && ['Não Pago', 'Pago'].includes(paymentStatus)) {
        order.paymentStatus = paymentStatus;
      }
      if (!status && !paymentStatus) { // Se não enviou nem status, nem paymentStatus
        return res.status(400).json({ message: 'Nenhum status ou status de pagamento fornecido para atualização.' });
      }
    } else {
      return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para atualizar este pedido.' });
    }

    await order.save();
    res.status(200).json(order);
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao atualizar status do pedido.' });
  }
};

// @route   DELETE /api/orders/:id
// @desc    Deleta um pedido (apenas se for 'Concluído' ou 'Cancelado')
// @access  Private (Restaurante ou Admin)
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado.' });
    }

    const user = await User.findById(req.user.id);

    // Apenas o restaurante dono do pedido (ou admin) pode deletar e apenas se for concluído/cancelado
    if (user.role === 'restaurant' && order.restaurant.toString() === req.user.id && ['Concluído', 'Cancelado'].includes(order.status)) {
      await Order.findByIdAndDelete(id);
      res.status(200).json({ message: 'Pedido deletado com sucesso.' });
    } else if (user.role === 'admin') { // Admin pode deletar qualquer pedido
      await Order.findByIdAndDelete(id);
      res.status(200).json({ message: 'Pedido deletado com sucesso por admin.' });
    } else {
      return res.status(403).json({ message: 'Acesso negado. Pedidos só podem ser deletados se concluídos ou cancelados e pelo restaurante ou administrador.' });
    }
  } catch (error) {
    console.error('Erro ao deletar pedido:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao deletar pedido.' });
  }
};