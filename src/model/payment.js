const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const paymentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    doc_id: { type: String, required: false },
    Amount: { type: String, required: false },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { versionKey: false });

paymentSchema.plugin(aggregatePaginate);

mongoose.model('Payment', paymentSchema);

