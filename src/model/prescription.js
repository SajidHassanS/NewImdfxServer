const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const prescriptionSchema = new mongoose.Schema({
    userId: { type: String, required: false },
    doc_id: { type: String, required: false },
    name: { type: String, required: false },
    quantity: { type: String, required: false },
    days: { type: String, required: false },
    morning: { type: Boolean, default: false },
    afternoon: { type: Boolean, default: false },
    evening: { type: Boolean, default: false },
    night: { type: Boolean, default: false },
    image: { type: String , required: false},
    reporttitle: { type: String , required: false},
    reportcagatory: { type: String , required: false},
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { versionKey: false });

prescriptionSchema.plugin(aggregatePaginate);
mongoose.model('Prescription', prescriptionSchema);

