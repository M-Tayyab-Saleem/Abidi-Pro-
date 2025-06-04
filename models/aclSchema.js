const mongoose = require('mongoose');

const aclSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User' },
  role:   { type: String, enum: ['viewer','editor','owner'], required: true }
});