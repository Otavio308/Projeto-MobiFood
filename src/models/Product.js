const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number, // Armazene o preço como número para facilitar cálculos
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Salgados', 'Doces', 'Bebidas', 'Padaria', 'Outros'], // Suas categorias
  },
  quantity: { // Este campo é o estoque, não a quantidade no carrinho
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  image: {
    type: String, // URL ou caminho para a imagem do produto
    default: null,
  },
  restaurant: { // Se cada produto pertence a um restaurante específico
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Ou 'Restaurant' se você criar um modelo de restaurante separado
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', ProductSchema);