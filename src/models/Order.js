const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { // Duplicar nome e preço para garantir que o pedido não mude se o produto mudar
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  restaurant: { // O restaurante que irá preparar o pedido
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Ou 'Restaurant' se você criar um modelo de restaurante separado
    required: true,
  },
  items: [OrderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix', 'Pagar no Balcão'], // Adapte as opções
    required: true,
  },
  status: {
    type: String,
    enum: ['Pendente', 'Em Preparação', 'Pronto para Retirada', 'Concluído', 'Cancelado'],
    default: 'Pendente',
  },
  // Opcional: Adicionar um campo para o status de pagamento
  paymentStatus: {
    type: String,
    enum: ['Não Pago', 'Pago'],
    default: 'Não Pago',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para atualizar 'updatedAt'
OrderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', OrderSchema);