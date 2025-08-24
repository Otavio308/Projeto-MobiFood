const mongoose = require('mongoose');

const ResetTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Referencia o modelo User
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: '1h', // O token expira em 1 hora. Ajuste conforme sua política de segurança.
  },
});

module.exports = mongoose.model('ResetToken', ResetTokenSchema);