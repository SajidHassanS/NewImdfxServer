const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const appointmentSchema = new mongoose.Schema({
    doc_id: { type: String, required: false },
    userId: { type: String, required: false },
    Details: { type: String, required: false },
    gender: { type: String, required: false },
    patientAge: { type: String, required: false },
    expiryYear: { type: String, required: false },
    expiryMonth: { type: String, required: false },
    cvv: { type: String, required: false },
    cardNumber: { type: String, required: false },
    holderName: { type: String, required: false },
    cardType: { type: String, required: false },
    selectedDate: { type: String, required: false },
    selectedTimeSlot: { type: String, required: false },
    bookingDate: { type: String, required: false },
    bookingFor: { type: String, required: false },
    Fees: { type: String, required: false },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { versionKey: false });

appointmentSchema.plugin(aggregatePaginate);

 mongoose.model('Appointment', appointmentSchema);



