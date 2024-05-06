const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const patientSchema = new mongoose.Schema({
    image: { type: String, required: false },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    dateOfBirth: { type: String },
    email: { type: String, required: false, unique: true },
    mobile: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String },
    userId: { type: String },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { versionKey: false });

patientSchema.plugin(aggregatePaginate);

mongoose.model('Patient', patientSchema);

