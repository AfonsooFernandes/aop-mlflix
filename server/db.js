require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => console.error('Erro na Conexão MONGODB:', err));