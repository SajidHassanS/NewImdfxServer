const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const hospitalRequestSchema = new mongoose.Schema({
    Hos_Id: { type: String, required: false },
    doc_id: { type: String, required: false },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { versionKey: false });

hospitalRequestSchema.plugin(aggregatePaginate);

mongoose.model('HospitalRequest', hospitalRequestSchema);






