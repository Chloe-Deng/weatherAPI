const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  documentId: mongoose.Schema.Types.ObjectId,
  document: mongoose.Schema.Types.Mixed,
  deletedAt: Date,
  type: String,
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
