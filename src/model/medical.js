const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const medicalSchema = new mongoose.Schema({
    userId: { type: String, required: false },
    bmi: { type: String, required: false },
    hr: { type: String, required: false },
    Weight: { type: String, required: false },
    Fbc: { type: String, required: false },
    dob: { type: String, required: false },

    userId: { type: String, required: true },
    BloodReport: String,
    STscan: String,
    MRI: String,

    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { versionKey: false });

medicalSchema.plugin(aggregatePaginate);

const MedicalRecords = mongoose.model("Medical", medicalSchema);
module.exports = MedicalRecords;


